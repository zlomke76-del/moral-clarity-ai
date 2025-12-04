// app/components/SolaceDock.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// STORE + HOOKS
import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";

// CHILD UI PANEL
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
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

export default function SolaceDock() {
  // Prevent duplicate mounts
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

  // ------------------------------------------
  // CORE STATE
  // ------------------------------------------
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);

  const [panelW, setPanelW] = useState(0);
  const [panelH, setPanelH] = useState(0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");

  // Speech
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  // Mobile
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Transcript
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!transcriptRef.current) return;
    const el = transcriptRef.current;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Memory hook
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();

  const appendInfo = (content: string) =>
    setMessages((m) => [...m, { role: "assistant", content }]);

  // Attachments
  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: appendInfo,
  });

  // Ministry toggle state
  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Measure panel size
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

  // Mobile breakpoint
  useEffect(() => {
    if (!canRender) return;
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [canRender]);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
    else setCollapsed(false);
  }, [isMobile]);

  // Restore panel position
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

  // Persist panel position
  useEffect(() => {
    if (!posReady || isMobile) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile]);

  // Dragging desktop
  function onHeaderMouseDown(e: React.MouseEvent) {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    setOffset({
      dx: e.clientX - (rect?.left ?? 0),
      dy: e.clientY - (rect?.top ?? 0),
    });
    setDragging(true);
  }

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

  // Resize textarea
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  // Default ministry ON
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
  }, []);

  // ------------------------------------------
  // BACKEND CALLS
  // ------------------------------------------
  async function sendToChat(userMsg: string, nextMsgs: Message[]) {
    const activeFilters = Array.from(filters);

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
        memory_preview: memReady
          ? memoryCacheRef.current.slice(0, 50)
          : [],
      }),
    });

    clearPending();

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${t}`);
    }

    const data = await res.json();
    const reply = String(data.text ?? "[No reply]");

    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  async function sendToVision(userMsg: string, nextMsgs: Message[]) {
    const imageAttachment = pendingFiles.find(
      (f) => f?.mime?.startsWith("image/") || f?.type?.startsWith("image/")
    );
    const imageUrl =
      imageAttachment?.url ||
      imageAttachment?.publicUrl ||
      imageAttachment?.path ||
      null;

    if (!imageUrl) {
      appendInfo(
        "I see an image attachment but no usable URL. Try re-attaching."
      );
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
      body: JSON.stringify({
        prompt,
        imageUrl,
      }),
    });

    clearPending();

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Vision HTTP ${res.status}: ${t}`);
    }

    const data = await res.json();
    const reply = String(data.answer ?? "[No reply]");

    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  // ------------------------------------------
  // SEND MESSAGE
  // ------------------------------------------
  async function send() {
    const text = input.trim();
    const hasAny = pendingFiles.length > 0;
    const hasImage = pendingFiles.some((f) =>
      (f?.mime || f?.type || "").startsWith("image/")
    );

    if (!text && !hasAny) return;
    if (streaming) return;

    setInput("");

    const userMsg = text || (hasAny ? "Attachments:" : "");
    const nextUser: Message = { role: "user", content: userMsg };
    const nextMsgs = [...messages, nextUser];

    setMessages(nextMsgs);
    setStreaming(true);

    try {
      if (hasImage) {
        await sendToVision(userMsg, nextMsgs);
      } else {
        await sendToChat(userMsg, nextMsgs);
      }
    } catch (e: any) {
      appendInfo(`⚠️ ${e?.message ?? "Error"}`);
    } finally {
      setStreaming(false);
    }
  }

  // ------------------------------------------
  // MINISTRY TOGGLE
  // ------------------------------------------
  function toggleMinistry() {
    if (ministryOn) {
      const next = Array.from(filters).filter(
        (f) => f !== "abrahamic" && f !== "ministry"
      );
      setFilters(next);
      try {
        localStorage.setItem(MINISTRY_KEY, "0");
      } catch {}
    } else {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
      try {
        localStorage.setItem(MINISTRY_KEY, "1");
      } catch {}
    }
  }

  // ------------------------------------------
  // MIC
  // ------------------------------------------
  function toggleMic() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      appendInfo("🎤 Microphone not supported in this browser.");
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
        .map((r: any) => r[0]?.transcript)
        .join(" ");
      setInput((prev) => (prev ? prev + " " : "") + t);
    };

    sr.onend = () => setListening(false);
    sr.onerror = () => setListening(false);

    recogRef.current = sr;
    sr.start();
    setListening(true);
  }

  // ------------------------------------------
  // MINIMIZE (desktop)
  // ------------------------------------------
  function minimize() {
    setCollapsed(true);
  }

  // ------------------------------------------
  // READY CHECK
  // ------------------------------------------
  if (!canRender || !visible) return null;

  // CLAMP PANEL POSITION
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);

  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);

  const invisible = !posReady;

  // ------------------------------------------
  // RENDER PANEL (Portal)
  // ------------------------------------------
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

      // handlers
      setInput={setInput}
      setModeHint={setModeHint}
      send={send}
      toggleMinistry={toggleMinistry}
      toggleMic={toggleMic}
      handlePaste={handlePaste}
      handleFiles={handleFiles}
      setCollapsed={setCollapsed}
      onHeaderMouseDown={onHeaderMouseDown}
      minimize={minimize}
      setPos={setPos}

      // filters
      filters={filters}
    />,
    document.body
  );
}

