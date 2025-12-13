"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

/* ----------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */
type Message = {
  role: "user" | "assistant";
  content: string;
};

/* ----------------------------------------------------------------------------
 * Constants
 * -------------------------------------------------------------------------- */
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

/* ----------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */
function getAttachmentUrl(f: any): string | null {
  return f?.url || f?.publicUrl || f?.path || null;
}

/* ----------------------------------------------------------------------------
 * MAIN COMPONENT
 * -------------------------------------------------------------------------- */
export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);

  /* ------------------------------------------------------------------------
   * One-time mount protection
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;

    window.__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------
   * Store state (Founder + Mode intentionally unused)
   * ---------------------------------------------------------------------- */
  const { visible, setVisible, x, y, setPos, filters, setFilters } =
    useSolaceStore();

  /* ------------------------------------------------------------------------
   * Mobile detection
   * ---------------------------------------------------------------------- */
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

  /* ------------------------------------------------------------------------
   * Minimized
   * ---------------------------------------------------------------------- */
  const [minimized, setMinimized] = useState(false);

  /* ------------------------------------------------------------------------
   * Dragging
   * ---------------------------------------------------------------------- */
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  /* ------------------------------------------------------------------------
   * Messages
   * ---------------------------------------------------------------------- */
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
    });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  /* ------------------------------------------------------------------------
   * Memory + attachments
   * ---------------------------------------------------------------------- */
  const { userKey, memReady } = useSolaceMemory();

  const { pendingFiles, handleFiles, handlePaste, clearPending } =
    useSolaceAttachments({
      onInfoMessage: (msg) =>
        setMessages((m) => [...m, { role: "assistant", content: msg }]),
    });

  /* ------------------------------------------------------------------------
   * Ministry toggle
   * ---------------------------------------------------------------------- */
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

  function toggleMinistry() {
    const next = new Set(filters);
    if (ministryOn) {
      next.delete("abrahamic");
      next.delete("ministry");
      localStorage.setItem(MINISTRY_KEY, "0");
    } else {
      next.add("abrahamic");
      next.add("ministry");
      localStorage.setItem(MINISTRY_KEY, "1");
    }
    setFilters(next);
  }

  /* ------------------------------------------------------------------------
   * Position restore
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!canRender || !visible) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

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

    setPosReady(true);
  }, [canRender, visible, setPos]);

  /* ------------------------------------------------------------------------
   * Resize
   * ---------------------------------------------------------------------- */
  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(
    dockW,
    dockH,
    setDockW,
    setDockH
  );

  /* ------------------------------------------------------------------------
   * Send
   * ---------------------------------------------------------------------- */
  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          workspaceId: MCA_WORKSPACE_ID,
          ministryMode: ministryOn,
          userKey,
        }),
      });

      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.text ?? "" },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e.message}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  /* ------------------------------------------------------------------------
   * Early exits
   * ---------------------------------------------------------------------- */
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
          zIndex: 999999,
        }}
        onClick={() => setMinimized(false)}
      >
        S
      </button>,
      document.body
    );
  }

  /* ------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------- */
  const skin = Skins.default;

  const panel = (
    <section
      ref={containerRef}
      style={{
        position: "fixed",
        left: PAD,
        top: PAD,
        width: dockW,
        height: dockH,
        background: skin.panelBg,
        borderRadius: UI.radiusLg,
        border: skin.border,
        boxShadow: ministryOn ? UI.glowOn : UI.shadow,
        display: "flex",
        flexDirection: "column",
        transform: `translate3d(${x}px, ${y}px, 0)`,
        zIndex: 60,
      }}
    >
      <SolaceDockHeader
        ministryOn={ministryOn}
        memReady={memReady}
        founderMode={false}
        modeHint="Neutral"
        onToggleFounder={() => {}}
        setModeHint={() => {}}
        onToggleMinistry={toggleMinistry}
        onMinimize={() => setMinimized(true)}
        onDragStart={onHeaderMouseDown}
      />

      <div
        ref={transcriptRef}
        style={{ flex: 1, padding: 16, overflow: "auto" }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            {m.content}
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 10,
          borderTop: UI.edge,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        <label style={{ cursor: "pointer" }}>
          📎
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
          />
        </label>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask Solace..."
          style={{ flex: 1, minHeight: 40 }}
        />

        <button onClick={send} disabled={streaming}>
          Ask
        </button>
      </div>

      <ResizeHandle onResizeStart={startResize} />
    </section>
  );

  return createPortal(panel, document.body);
}
