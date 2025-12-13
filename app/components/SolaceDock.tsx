"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
  }
}

import { useDockStyles } from "./useDockStyles";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";
import { useSpeechInput } from "./useSpeechInput";
import { useSolaceChat } from "./useSolaceChat";

import { UI } from "./dock-ui";
import SolaceDockHeaderLite from "./dock-header-lite";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);

  // --------------------------------------------------
  // One-time mount protection
  // --------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;

    window.__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  // --------------------------------------------------
  // Store
  // --------------------------------------------------
  const { visible, setVisible, x, y, setPos, filters, setFilters } =
    useSolaceStore();

  const modeHint = "Neutral";

  // --------------------------------------------------
  // Mobile detection
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Minimized
  // --------------------------------------------------
  const [minimized, setMinimized] = useState(false);

  // --------------------------------------------------
  // Dragging
  // --------------------------------------------------
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);

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

  // --------------------------------------------------
  // Memory + attachments
  // --------------------------------------------------
  const { userKey, memReady } = useSolaceMemory();
  const { pendingFiles, handleFiles, handlePaste, clearPending } =
    useSolaceAttachments({});

  // --------------------------------------------------
  // Ministry
  // --------------------------------------------------
  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  useEffect(() => {
    if (localStorage.getItem(MINISTRY_KEY) === "1") {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
    }
  }, []);

  // --------------------------------------------------
  // Chat (EXTRACTED)
  // --------------------------------------------------
  const { messages, streaming, send } = useSolaceChat({
    ministryOn,
    modeHint,
    userKey,
    clearPending,
  });

  const [input, setInput] = useState("");

  // --------------------------------------------------
  // Microphone (RESTORED)
  // --------------------------------------------------
  const { listening, toggleMic } = useSpeechInput({
    onText: (text) =>
      setInput((p) => (p ? p + " " : "") + text),
    onError: (msg) =>
      alert(msg),
  });

  // --------------------------------------------------
  // Size + styles
  // --------------------------------------------------
  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(
    dockW,
    dockH,
    setDockW,
    setDockH
  );

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const tx = Math.min(Math.max(0, x - PAD), vw - dockW - PAD);
  const ty = Math.min(Math.max(0, y - PAD), vh - dockH - PAD);

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

  // --------------------------------------------------
  // Early exits
  // --------------------------------------------------
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

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  const panel = (
    <section ref={containerRef} style={panelStyle}>
      <SolaceDockHeaderLite
        ministryOn={ministryOn}
        memReady={memReady}
        onToggleMinistry={() => {}}
        onMinimize={() => setMinimized(true)}
        onDragStart={onHeaderMouseDown}
      />

      <div style={transcriptStyle}>
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
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div
        style={composerWrapStyle}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Paperclip */}
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
            }}
          >
            📎
            <input
              type="file"
              multiple
              hidden
              onChange={(e) =>
                handleFiles(e.target.files, { prefix: "solace" })
              }
            />
          </label>

          {/* Mic */}
          <button
            onClick={toggleMic}
            style={{
              width: 38,
              height: 38,
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: listening
                ? "rgba(255,0,0,.45)"
                : UI.surface2,
              cursor: "pointer",
            }}
          >
            🎤
          </button>

          <textarea
            style={textareaStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Solace..."
          />

          <button
            onClick={() => {
              send(input);
              setInput("");
            }}
            disabled={streaming}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: UI.radiusMd,
              background: "#fbbf24",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
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
