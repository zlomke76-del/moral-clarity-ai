"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import SolaceDockPanel from "./SolaceDockPanel";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

type Message = { role: "user" | "assistant"; content: string };
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";

const POS_KEY = "solace:pos:v3";
const MINIMIZED_KEY = "solace:minimized:v1";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

export default function SolaceDock() {
  // Ensure single mount
  const [canRender, setCanRender] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;
    window.__solaceDockMounted = true;
    setCanRender(true);
    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  const { visible, x, y, setPos, filters, setFilters } = useSolaceStore();

  // -------------------------------------------------------
  // STATE
  // -------------------------------------------------------
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);
  const [panelW, setPanelW] = useState(0);
  const [panelH, setPanelH] = useState(0);

  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [minimized, setMinimized] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MINIMIZED_KEY);
      if (raw === "1") setMinimized(true);
    } catch {}
  }, []);

  const setMinimizedSafe = (v: boolean) => {
    setMinimized(v);
    try {
      localStorage.setItem(MINIMIZED_KEY, v ? "1" : "0");
    } catch {}
  };

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // -------------------------------------------------------
  // MEMORY HOOK
  // -------------------------------------------------------
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();

  // Info messages
  const appendInfo = (content: string) =>
    setMessages((m) => [...m, { role: "assistant", content }]);

  // Attachments hook
  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({ onInfoMessage: appendInfo });

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  // Seed welcome
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  // -------------------------------------------------------
  // MEASURE PANEL
  // -------------------------------------------------------
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setPanelH(r.height || 0);
      setPanelW(r.width || 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Mobile detection
  useEffect(() => {
    if (!canRender) return;
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [canRender]);

  // Auto-collapse for mobile
  useEffect(() => {
    if (isMobile) setCollapsed(true);
    else setCollapsed(false);
  }, [isMobile]);

  // -------------------------------------------------------
  // RESTORE POSITION (DESKTOP)
  // -------------------------------------------------------
  useEffect(() => {
    if (!canRender || !visible) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw <= 768) {
      setPosReady(true);
      return;
    }

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          const sx = Math.max(PAD, Math.min(vw - PAD, saved.x));
          const sy = Math.max(PAD, Math.min(vh - PAD, saved.y));
          setPos(sx, sy);
          setPosReady(true);
          return;
        }
      }
    } catch {}

    requestAnimationFrame(() => {
      const w = panelW || Math.min(980, Math.max(560, Math.round(vw * 0.56)));
      const h = panelH || Math.min(820, Math.max(460, Math.round(vh * 0.62)));
      const startX = Math.max(PAD, Math.round((vw - w) / 2));
      const startY = Math.max(PAD, Math.round((vh - h) / 2));
      setPos(startX, startY);
      setPosReady(true);
    });
  }, [canRender, visible, panelW, panelH, setPos]);

  // Persist pos
  useEffect(() => {
    if (!posReady || isMobile) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile]);

  // -------------------------------------------------------
  // DRAGGING
  // -------------------------------------------------------
  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    setOffset({
      dx: e.clientX - (rect?.left ?? 0),
      dy: e.clientY - (rect?.top ?? 0),
    });
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) =>
      setPos(e.clientX - offset.dx, e.clientY - offset.dy);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, offset, setPos]);

  // -------------------------------------------------------
  // AUTOSIZE TEXTAREA
  // -------------------------------------------------------
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  // -------------------------------------------------------
  // MINISTRY DEFAULT
  // -------------------------------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MINISTRY_KEY);
      if (saved === "0") return;
    } catch {}
    if (!filters.has("abrahamic") || !filters.has("ministry")) {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
      try {
        localStorage.setItem(MINISTRY_KEY, "1");
      } catch {}
    }
  }, []);  // run once

  // -------------------------------------------------------
  // SEND TO CHAT
  // -------------------------------------------------------
  async function sendToChat(userMsg: string, nextMsgs: Message[]) {
    const activeFilters: string[] = Array.from(filters);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Last-Mode": modeHint,
        "X-User-Key": userKey,
      },
      body: JSON.stringify({
        messages: nextMsgs,
        filters: activeFilters,
        stream: false,
        attachments: pendingFiles,
        ministry: activeFilters.includes("ministry"),
        workspace_id: MCA_WORKSPACE_ID,
        user_key: userKey,
        memory_preview: memReady ? memoryCacheRef.current.slice(0, 50) : [],
      }),
    });

    clearPending();

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${t || res.status}` },
      ]);
      return;
    }

    const data = await res.json();
    setMessages((m) => [
      ...m,
      { role: "assistant", content: String(data.text ?? "[No reply]") },
    ]);
  }

  // -------------------------------------------------------
  // SEND TO VISION (FIXED TS)
  // -------------------------------------------------------
  async function sendToVision(userMsg: string, nextMsgs: Message[]) {
    const imageAttachment = pendingFiles.find((f: any) => {
      const mime = (f?.mime || f?.type || "") as string;
      return mime.startsWith("image/");
    });

    const imageUrl = (() => {
      const f = imageAttachment as any;
      if (!f) return null;
      return f.url || f.publicUrl || f.path || null;
    })();

    if (!imageUrl) {
      appendInfo("I see an image attachment but no usable URL. Try re-attaching.");
      clearPending();
      return;
    }

    const prompt =
      userMsg.trim() ||
      "Look at this image and describe what you see, then help.";

    const res = await fetch("/api/solace/vision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Key": userKey,
      },
      body: JSON.stringify({ prompt, imageUrl }),
    });

    clearPending();

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      appendInfo(`Vision error: ${t || res.status}`);
      return;
    }

    const data = await res.json();
    setMessages((m) => [
      ...m,
      { role: "assistant", content: String(data.answer ?? "[No reply]") },
    ]);
  }

  // -------------------------------------------------------
  // SEND DISPATCHER
  // -------------------------------------------------------
  async function send() {
    if (streaming) return;
    const text = input.trim();
    const hasAttachments = pendingFiles.length > 0;
    const hasImage = pendingFiles.some((f: any) => {
      const mime = (f?.mime || f?.type || "") as string;
      return mime.startsWith("image/");
    });

    if (!text && !hasAttachments) return;

    setInput("");

    const userMsg = text || "Attachments:";
    const nextUser: Message = { role: "user", content: userMsg };
    const nextMsgs = [...messages, nextUser];
    setMessages(nextMsgs);
    setStreaming(true);

    try {
      if (hasImage) await sendToVision(userMsg, nextMsgs);
      else await sendToChat(userMsg, nextMsgs);
    } catch (e: any) {
      appendInfo(`⚠️ ${e?.message ?? "Error"}`);
    } finally {
      setStreaming(false);
    }
  }

  // -------------------------------------------------------
  // MINIMIZE → CORNER BUBBLE (ORB + LABEL)
  // -------------------------------------------------------
  if (minimized) {
    return createPortal(
      <button
        onClick={() => setMinimizedSafe(false)}
        className="
          fixed bottom-6 right-6 z-[80]
          flex items-center gap-2
          px-4 py-2 rounded-full
          bg-[rgba(6,12,20,0.96)] backdrop-blur-md
          border border-[--mc-border]
          shadow-xl
          text-[--mc-text]
        "
      >
        <div
          className="
            w-[20px] h-[20px] rounded-full
            bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200
            shadow-[0_0_20px_rgba(251,191,36,0.55)]
          "
        />
        <span className="text-sm font-semibold">Solace</span>
      </button>,
      document.body
    );
  }

  // -------------------------------------------------------
  // INVISIBLE / NOT RENDERED
  // -------------------------------------------------------
  if (!canRender || !visible) return null;

  // -------------------------------------------------------
  // CLAMPED POSITION (DESKTOP)
  // -------------------------------------------------------
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);
  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);
  const invisible = !posReady;

  // -------------------------------------------------------
  // RENDER PANEL
  // -------------------------------------------------------
  return createPortal(
    <SolaceDockPanel
      // state
      messages={messages}
      input={input}
      streaming={streaming}
      pendingFiles={pendingFiles}
      ministryOn={ministryOn}
      modeHint={modeHint}
      listening={listening}
      isMobile={isMobile}
      collapsed={collapsed}
      invisible={invisible}

      // refs
      transcriptRef={transcriptRef}
      taRef={taRef}
      containerRef={containerRef}

      // layout
      tx={tx}
      ty={ty}
      panelW={panelW}
      panelH={panelH}

      // actions & logic
      setInput={setInput}
      setModeHint={setModeHint}
      send={send}
      toggleMinistry={() => {
        const next = new Set(filters);
        if (ministryOn) {
          next.delete("abrahamic");
          next.delete("ministry");
          setFilters(next);
          try {
            localStorage.setItem(MINISTRY_KEY, "0");
          } catch {}
        } else {
          next.add("abrahamic");
          next.add("ministry");
          setFilters(next);
          try {
            localStorage.setItem(MINISTRY_KEY, "1");
          } catch {}
        }
      }}
      toggleMic={() => {
        const SR =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
        if (!SR) {
          appendInfo("🎤 Microphone is not supported in this browser.");
          return;
        }
        if (listening) {
          try {
            recogRef.current?.stop();
          } catch {}
          setListening(false);
          return;
        }
        const sr = new SR();
        sr.lang = "en-US";
        sr.interimResults = false;
        sr.maxAlternatives = 1;
        sr.onresult = (e: any) => {
          const t = Array.from(e.results)
            .map((r: any) => r[0].transcript)
            .join(" ");
          setInput((prev) => (prev ? prev + " " : "") + t);
        };
        sr.onend = () => setListening(false);
        sr.onerror = () => setListening(false);
        recogRef.current = sr;
        sr.start();
        setListening(true);
      }}
      handlePaste={handlePaste}
      handleFiles={handleFiles}
      setCollapsed={setCollapsed}
      onHeaderMouseDown={onHeaderMouseDown}
      minimize={() => setMinimizedSafe(true)}
      setPos={setPos}

      // NEW: pass filters safely
      filters={filters}
    />,
    document.body
  );
}


