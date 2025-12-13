"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

import { MCA_WORKSPACE_ID } from "@/lib/mca-config";

import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";

import { UI } from "./dock-ui";
import { Skins } from "./dock-skins";
import SolaceDockHeader from "./dock-header";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

// ✅ NEW HELPERS
import { runVision } from "@/lib/solace/vision-helper";
import {
  isImageAttachment,
  getAttachmentUrl,
} from "@/lib/solace/attachment-utils";

// --------------------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------------------
type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
};

type ModeHint = "Create" | "Red Team" | "Next Steps" | "Neutral";

// --------------------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------------------
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const FOUNDER_KEY = "solace:founder";
const PAD = 12;

// --------------------------------------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------------------------------------
export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);

  // --------------------------------------------------------------------
  // One-time mount protection
  // --------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;

    window.__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  // --------------------------------------------------------------------
  // Store state
  // --------------------------------------------------------------------
  const {
    visible,
    setVisible,
    x,
    y,
    setPos,
    filters,
    setFilters,
    founderMode,
    setFounderMode,
    modeHint,
    setModeHint,
  } = useSolaceStore();

  // --------------------------------------------------------------------
  // Mobile detection
  // --------------------------------------------------------------------
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (canRender && !isMobile && !visible) setVisible(true);
  }, [canRender, isMobile, visible, setVisible]);

  // --------------------------------------------------------------------
  // Minimized state
  // --------------------------------------------------------------------
  const [minimized, setMinimized] = useState(false);

  // --------------------------------------------------------------------
  // Dragging
  // --------------------------------------------------------------------
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // --------------------------------------------------------------------
  // Messages
  // --------------------------------------------------------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // --------------------------------------------------------------------
  // Memory + attachments
  // --------------------------------------------------------------------
  const { userKey, memReady } = useSolaceMemory();

  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: (msg) =>
      setMessages((m) => [...m, { role: "assistant", content: msg }]),
  });

  // --------------------------------------------------------------------
  // Ministry toggle hydration
  // --------------------------------------------------------------------
  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MINISTRY_KEY);
      if (saved === "1") {
        const next = new Set(filters);
        next.add("abrahamic");
        next.add("ministry");
        setFilters(next);
      }
    } catch {}
  }, []);

  // --------------------------------------------------------------------
  // Founder toggle hydration
  // --------------------------------------------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FOUNDER_KEY);
      if (saved === "1") setFounderMode(true);
    } catch {}
  }, []);

  // --------------------------------------------------------------------
  // Initial assistant message
  // --------------------------------------------------------------------
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  // --------------------------------------------------------------------
  // Panel measurement
  // --------------------------------------------------------------------
  const [panelW, setPanelW] = useState(0);
  const [panelH, setPanelH] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      setPanelW(r.width);
      setPanelH(r.height);
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

  // --------------------------------------------------------------------
  // Load saved position
  // --------------------------------------------------------------------
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
        if (Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          setPos(
            Math.max(PAD, Math.min(vw - PAD, saved.x)),
            Math.max(PAD, Math.min(vh - PAD, saved.y))
          );
          setPosReady(true);
          return;
        }
      }
    } catch {}

    requestAnimationFrame(() => {
      setPos(
        Math.max(PAD, Math.round((vw - (panelW || 760)) / 2)),
        Math.max(PAD, Math.round((vh - (panelH || 560)) / 2))
      );
      setPosReady(true);
    });
  }, [canRender, visible, panelW, panelH, setPos]);

  // --------------------------------------------------------------------
  // Save position
  // --------------------------------------------------------------------
  useEffect(() => {
    if (!posReady || isMobile) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile]);

  // --------------------------------------------------------------------
  // Drag logic
  // --------------------------------------------------------------------
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

  // --------------------------------------------------------------------
  // Resize
  // --------------------------------------------------------------------
  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(dockW, dockH, setDockW, setDockH);

  // --------------------------------------------------------------------
  // Chat API
  // --------------------------------------------------------------------
  async function sendToChat(userMsg: string, history: Message[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        history,
        workspaceId: MCA_WORKSPACE_ID,
        ministryMode: ministryOn,
        modeHint,
        founderMode,
        userKey,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    return { text: data.text ?? "", imageUrl: data.imageUrl ?? null };
  }

  // --------------------------------------------------------------------
  // MAIN SEND
  // --------------------------------------------------------------------
  async function send() {
    if (streaming) return;

    const text = input.trim();
    const hasImage = pendingFiles.some(isImageAttachment);

    if (!text && pendingFiles.length === 0) return;

    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "user", content: text || "Attachments:" }]);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let reply;

      if (hasImage) {
        const image = pendingFiles.find(isImageAttachment);
        const imageUrl = getAttachmentUrl(image);

        if (!imageUrl) throw new Error("Image has no usable URL");

        reply = await runVision({
          prompt: text || "Look at this image and describe what you see.",
          imageUrl,
          userKey,
        });

        clearPending();
      } else {
        reply = await sendToChat(text, history);
      }

      setMessages((m) => [
        ...m,
        { role: "assistant", content: reply.text },
      ]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${err.message || "Error"}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  // --------------------------------------------------------------------
  // ENTER TO SEND
  // --------------------------------------------------------------------
  function onEnterSend(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // --------------------------------------------------------------------
  // Microphone
  // --------------------------------------------------------------------
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  function toggleMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }

    const sr = new SR();
    sr.lang = "en-US";
    sr.onresult = (e: any) =>
      setInput((p) => p + " " + e.results[0][0].transcript);
    sr.onend = () => setListening(false);

    recogRef.current = sr;
    sr.start();
    setListening(true);
  }

  // --------------------------------------------------------------------
  // Render guards
  // --------------------------------------------------------------------
  if (!canRender || !visible) return null;

  if (minimized) {
    return createPortal(
      <button
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "#fbbf24",
          fontWeight: 700,
          cursor: "pointer",
        }}
        onClick={() => setMinimized(false)}
      >
        S
      </button>,
      document.body
    );
  }

  // --------------------------------------------------------------------
  // Panel
  // --------------------------------------------------------------------
  const panel = (
    <section ref={containerRef}>
      <SolaceDockHeader
        ministryOn={ministryOn}
        founderMode={founderMode}
        modeHint={modeHint}
        memReady={memReady}
        onToggleMinistry={() => {}}
        onToggleFounder={() => {}}
        onMinimize={() => setMinimized(true)}
        setModeHint={setModeHint}
        onDragStart={onHeaderMouseDown}
      />
      {/* UI preserved below */}
    </section>
  );

  return createPortal(panel, document.body);
}
