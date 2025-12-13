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
  }
}

import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useDockStyles } from "./useDockStyles";
import { useSpeechInput } from "./useSpeechInput";

import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";

import { UI } from "./dock-ui";
import SolaceDockHeaderLite from "./dock-header-lite";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
};

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function getAttachmentUrl(f: any): string | null {
  return f?.url || f?.publicUrl || f?.path || null;
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------
export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);

  // ---------------------------------------------------------------------------
  // One-time mount guard
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;

    window.__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Store
  // ---------------------------------------------------------------------------
  const {
    visible,
    setVisible,
    x,
    y,
    setPos,
    filters,
    setFilters,
  } = useSolaceStore();

  const modeHint = "Neutral" as const;

  // ---------------------------------------------------------------------------
  // Mobile detection
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Minimize
  // ---------------------------------------------------------------------------
  const [minimized, setMinimized] = useState(false);

  // ---------------------------------------------------------------------------
  // Dragging
  // ---------------------------------------------------------------------------
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ---------------------------------------------------------------------------
  // Messages
  // ---------------------------------------------------------------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // ---------------------------------------------------------------------------
  // Memory + Attachments
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Ministry
  // ---------------------------------------------------------------------------
  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  useEffect(() => {
    try {
      if (localStorage.getItem(MINISTRY_KEY) === "1") {
        const next = new Set(filters);
        next.add("abrahamic");
        next.add("ministry");
        setFilters(next);
      }
    } catch {}
  }, []);

  // ---------------------------------------------------------------------------
  // Initial message
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  // ---------------------------------------------------------------------------
  // Measure panel
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Position persistence
  // ---------------------------------------------------------------------------
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
        if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) {
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

  useEffect(() => {
    if (!posReady || isMobile) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile]);

  // ---------------------------------------------------------------------------
  // Drag handlers
  // ---------------------------------------------------------------------------
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

    const onMove = (e: MouseEvent) => {
      setPos(e.clientX - offset.dx, e.clientY - offset.dy);
    };
    const onUp = () => setDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, offset, setPos]);

  // ---------------------------------------------------------------------------
  // Resize
  // ---------------------------------------------------------------------------
  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(
    dockW,
    dockH,
    setDockW,
    setDockH
  );

  // ---------------------------------------------------------------------------
  // Speech input
  // ---------------------------------------------------------------------------
  const { listening, toggleMic } = useSpeechInput({
    onText: (text) =>
      setInput((p) => (p ? p + " " : "") + text),
    onError: (msg) =>
      setMessages((m) => [...m, { role: "assistant", content: msg }]),
  });

  // ---------------------------------------------------------------------------
  // Dock styles (MUST RUN BEFORE RETURNS)
  // ---------------------------------------------------------------------------
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);

  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);

  const {
    panelStyle,
    transcriptStyle,
    textareaStyle,
    composerWrapStyle,
  } = useDockStyles({
    dockW,
    dockH,
    tx,
    ty,
    invisible: !posReady,
    ministryOn,
    PAD,
  });

  // ---------------------------------------------------------------------------
  // Chat senders
  // ---------------------------------------------------------------------------
  async function sendToChat(userMsg: string, prev: Message[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        history: prev,
        workspaceId: MCA_WORKSPACE_ID,
        ministryMode: ministryOn,
        modeHint,
        userKey,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return { text: data.text ?? "", imageUrl: data.imageUrl ?? null };
  }

  async function sendToVision(userMsg: string, prev: Message[]) {
    const img = pendingFiles.find((f) =>
      (f.mime || f.type || "").startsWith("image/")
    );
    const imageUrl = getAttachmentUrl(img);
    clearPending();

    const res = await fetch("/api/solace/vision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Key": userKey,
      },
      body: JSON.stringify({
        prompt: userMsg || "Describe this image",
        imageUrl,
      }),
    });

    const data = await res.json();
    return { text: data.answer ?? "", imageUrl: null };
  }

  async function send() {
    const text = input.trim();
    if (!text && pendingFiles.length === 0) return;
    if (streaming) return;

    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "user", content: text }]);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = pendingFiles.some((f) =>
        (f.mime || f.type || "").startsWith("image/")
      )
        ? await sendToVision(text, history)
        : await sendToChat(text, history);

      setMessages((m) => [
        ...m,
        { role: "assistant", content: reply.text, imageUrl: reply.imageUrl },
      ]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${err.message}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  function onEnterSend(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // ---------------------------------------------------------------------------
  // Minimized bubble
  // ---------------------------------------------------------------------------
  if (!canRender || !visible) return null;

  if (minimized) {
    return createPortal(
      <button
        onClick={() => setMinimized(false)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background:
            "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1) 0%, rgba(251,191,36,.65) 38%, rgba(251,191,36,.22) 72%, rgba(251,191,36,.12) 100%)",
          boxShadow: "0 0 26px rgba(251,191,36,.55)",
          fontWeight: 700,
          cursor: "pointer",
          zIndex: 999999,
        }}
      >
        S
      </button>,
      document.body
    );
  }

  // ---------------------------------------------------------------------------
  // Main UI
  // ---------------------------------------------------------------------------
  return createPortal(
    <section ref={containerRef} style={panelStyle}>
      <SolaceDockHeaderLite
        ministryOn={ministryOn}
        memReady={memReady}
        onToggleMinistry={() => {
          const next = new Set(filters);
          ministryOn
            ? (next.delete("abrahamic"), next.delete("ministry"))
            : (next.add("abrahamic"), next.add("ministry"));
          localStorage.setItem(MINISTRY_KEY, ministryOn ? "0" : "1");
          setFilters(next);
        }}
        onMinimize={() => setMinimized(true)}
        onDragStart={onHeaderMouseDown}
      />

      <div ref={transcriptRef} style={transcriptStyle}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              borderRadius: UI.radiusLg,
              padding: "10px 12px",
              margin: "6px 0",
              background:
                m.role === "user"
                  ? "rgba(39,52,74,.6)"
                  : "rgba(28,38,54,.6)",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
            {m.imageUrl && (
              <img
                src={m.imageUrl}
                alt=""
                style={{
                  display: "block",
                  marginTop: 10,
                  maxWidth: "100%",
                  borderRadius: 10,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        style={composerWrapStyle}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button onClick={toggleMic}>
            {listening ? "🎙️" : "🎤"}
          </button>
          <textarea
            style={textareaStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnterSend}
            placeholder="Ask Solace..."
          />
          <button onClick={send} disabled={streaming}>
            Ask
          </button>
        </div>
      </div>

      <ResizeHandle onResizeStart={startResize} />
    </section>,
    document.body
  );
}
