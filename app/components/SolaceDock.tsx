"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import MessageRenderer from "./MessageRenderer";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useDockStyles } from "./useDockStyles";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";
import { useSpeechInput } from "./useSpeechInput";

import { UI } from "./dock-ui";
import SolaceDockHeaderLite from "./dock-header-lite";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

// --------------------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------------------
type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
};

// --------------------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------------------
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
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
  const { visible, setVisible, x, y, setPos, filters, setFilters } =
    useSolaceStore();

  const modeHint = "Neutral" as const;

  // --------------------------------------------------------------------
  // Viewport (NO window usage during render)
  // --------------------------------------------------------------------
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // --------------------------------------------------------------------
  // Mobile detection
  // --------------------------------------------------------------------
  const isMobile = viewport.w > 0 ? viewport.w <= 768 : false;

  useEffect(() => {
    if (canRender && !isMobile && !visible) setVisible(true);
  }, [canRender, isMobile, visible, setVisible]);

  // --------------------------------------------------------------------
  // Minimized
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
  // Chat
  // --------------------------------------------------------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    transcriptRef.current?.scrollTo(0, transcriptRef.current.scrollHeight);
  }, [messages]);

  // --------------------------------------------------------------------
  // Memory + attachments
  // --------------------------------------------------------------------
  const { userKey, memReady } = useSolaceMemory();

  const { pendingFiles, handleFiles, handlePaste, clearPending } =
    useSolaceAttachments({
      onInfoMessage: (msg) =>
        setMessages((m) => [...m, { role: "assistant", content: msg }]),
    });

  // --------------------------------------------------------------------
  // Microphone
  // --------------------------------------------------------------------
  const { listening, toggleMic } = useSpeechInput({
    onText: (text) => setInput((p) => (p ? p + " " : "") + text),
    onError: (msg) =>
      setMessages((m) => [...m, { role: "assistant", content: msg }]),
  });

  // --------------------------------------------------------------------
  // Ministry
  // --------------------------------------------------------------------
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------------------
  // Initial message
  // --------------------------------------------------------------------
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  // --------------------------------------------------------------------
  // Measure panel
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
    if (viewport.w === 0 || viewport.h === 0) return;

    const vw = viewport.w;
    const vh = viewport.h;

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

    setPos(Math.round((vw - 760) / 2), Math.round((vh - 560) / 2));
    setPosReady(true);
  }, [canRender, visible, viewport.w, viewport.h, setPos]);

  // --------------------------------------------------------------------
  // Persist position on mouse-up (ONLY when dragging ends)
  // --------------------------------------------------------------------
  useEffect(() => {
    if (dragging) return;
    if (!posReady) return;
    if (viewport.w === 0 || viewport.h === 0) return;
    if (viewport.w <= 768) return;

    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [dragging, posReady, x, y, viewport.w, viewport.h]);

  // --------------------------------------------------------------------
  // Drag handlers
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
  }, [dragging, offset.dx, offset.dy, setPos]);

  // --------------------------------------------------------------------
  // Resize
  // --------------------------------------------------------------------
  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(dockW, dockH, setDockW, setDockH);

  // --------------------------------------------------------------------
  // Styles
  // --------------------------------------------------------------------
  const vw = viewport.w || 1;
  const vh = viewport.h || 1;

  const tx = Math.min(Math.max(0, x - PAD), vw - panelW - PAD);
  const ty = Math.min(Math.max(0, y - PAD), vh - panelH - PAD);

  const { panelStyle, transcriptStyle, textareaStyle, composerWrapStyle } =
    useDockStyles({
      dockW,
      dockH,
      tx,
      ty,
      invisible: !posReady,
      ministryOn,
      PAD,
    });

  // --------------------------------------------------------------------
  // Early returns
  // --------------------------------------------------------------------
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
        }}
      >
        S
      </button>,
      document.body
    );
  }

  // --------------------------------------------------------------------
  // SEND
  // --------------------------------------------------------------------
  async function send() {
    if (!input.trim() && pendingFiles.length === 0) return;
    if (streaming) return;

    const userMsg = input || "Attachments:";
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "user", content: userMsg }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          // NOTE: do NOT hardcode any name here. If userKey is not ready,
          // omit canonicalUserKey entirely so server can use auth identity.
          canonicalUserKey: userKey || undefined,
          workspaceId: MCA_WORKSPACE_ID,
          ministryMode: ministryOn,
          modeHint,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response payload");
      }

      // Strict contract: { ok: true, response: string }
      if (!data || data.ok !== true || typeof data.response !== "string") {
        throw new Error("Invalid response payload");
      }

      setMessages((m) => [...m, { role: "assistant", content: data.response }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e?.message ?? "Request failed"}` },
      ]);
    } finally {
      setStreaming(false);
      clearPending();
    }
  }

  function onEnterSend(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // --------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------
  const panel = (
    <section ref={containerRef} style={panelStyle}>
      <SolaceDockHeaderLite
        ministryOn={ministryOn}
        memReady={memReady}
        onToggleMinistry={() => {}}
        onMinimize={() => setMinimized(true)}
        onDragStart={onHeaderMouseDown} // ✅ RESTORED DRAG WIRING
      />

      <div ref={transcriptRef} style={transcriptStyle}>
        {messages.map((m, i) => (
  <div
    key={i}
    style={{
      margin: "6px 0",
      padding: "10px 12px",
      borderRadius: UI.radiusLg,
      background:
        m.role === "user"
          ? "rgba(39,52,74,.6)"
          : "rgba(28,38,54,.6)",
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      wordBreak: "break-word",
      lineHeight: 1.35,
    }}
  >
    <MessageRenderer content={m.content} />
  </div>
))}
      </div>

      <div
        style={composerWrapStyle}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* PAPERCLIP (PRESENT) */}
          <label
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: UI.surface2,
              cursor: "pointer",
              flexShrink: 0,
            }}
            title="Attach files"
          >
            📎
            <input
              type="file"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
            />
          </label>

          {/* MIC (PRESENT) */}
          <button
            onClick={toggleMic}
            title="Voice input"
            style={{
              width: 38,
              height: 38,
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: listening ? "rgba(255,0,0,.45)" : UI.surface2,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            🎤
          </button>

          <textarea
            style={textareaStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnterSend}
            placeholder="Ask Solace..."
          />

          <button
            onClick={send}
            disabled={streaming}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: UI.radiusMd,
              background: "#fbbf24",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Ask
          </button>
        </div>
      </div>

      <ResizeHandle onResizeStart={startResize} />
    </section>
  );

  return createPortal(panel, document.body);
}
