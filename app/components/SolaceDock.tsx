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

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
type Message = {
  role: "user" | "assistant";
  content: string;
};

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

// ------------------------------------------------------------
export default function SolaceDock() {
  const [canRender, setCanRender] = useState(false);

  // ----------------------------------------------------------
  // One-time mount protection
  // ----------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;

    window.__solaceDockMounted = true;
    setCanRender(true);

    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  // ----------------------------------------------------------
  // Store
  // ----------------------------------------------------------
  const { visible, setVisible, x, y, setPos, filters, setFilters } =
    useSolaceStore();

  const modeHint = "Neutral" as const;

  // ----------------------------------------------------------
  // Mobile
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // Minimized
  // ----------------------------------------------------------
  const [minimized, setMinimized] = useState(false);

  // ----------------------------------------------------------
  // Chat state
  // ----------------------------------------------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    transcriptRef.current?.scrollTo(0, transcriptRef.current.scrollHeight);
  }, [messages]);

  // ----------------------------------------------------------
  // Memory + attachments
  // ----------------------------------------------------------
  const { userKey, memReady } = useSolaceMemory();

  const { pendingFiles, handleFiles, handlePaste, clearPending } =
    useSolaceAttachments({
      onInfoMessage: (msg) =>
        setMessages((m) => [...m, { role: "assistant", content: msg }]),
    });

  // ----------------------------------------------------------
  // Mic
  // ----------------------------------------------------------
  const { listening, toggleMic } = useSpeechInput({
    onText: (text) =>
      setInput((p) => (p ? p + " " : "") + text),
    onError: (msg) =>
      setMessages((m) => [...m, { role: "assistant", content: msg }]),
  });

  // ----------------------------------------------------------
  // Ministry
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // Initial message
  // ----------------------------------------------------------
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  // ----------------------------------------------------------
  // Panel measurement
  // ----------------------------------------------------------
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  // ----------------------------------------------------------
  // Resize
  // ----------------------------------------------------------
  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(
    dockW,
    dockH,
    setDockW,
    setDockH
  );

  // ----------------------------------------------------------
  // Styles
  // ----------------------------------------------------------
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const tx = Math.min(Math.max(0, x - PAD), vw - panelW - PAD);
  const ty = Math.min(Math.max(0, y - PAD), vh - panelH - PAD);

  const { panelStyle, transcriptStyle, textareaStyle, composerWrapStyle } =
    useDockStyles({
      dockW,
      dockH,
      tx,
      ty,
      invisible: false,
      ministryOn,
      PAD,
    });

  if (!canRender || !visible) return null;

  // ----------------------------------------------------------
  // SEND (FIXED PAYLOAD)
  // ----------------------------------------------------------
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
          canonicalUserKey: userKey, // ✅ FIX
          workspaceId: MCA_WORKSPACE_ID,
          ministryMode: ministryOn,
          modeHint,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data?.ok || typeof data.response !== "string") {
        throw new Error("Invalid response payload");
      }

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.response },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e.message}` },
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

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return createPortal(
    <section ref={containerRef} style={panelStyle}>
      <SolaceDockHeaderLite
        ministryOn={ministryOn}
        memReady={memReady}
        onToggleMinistry={() => {}}
        onMinimize={() => setMinimized(true)}
        onDragStart={() => {}}
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
          {/* PAPERCLIP */}
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

          {/* MIC */}
          <button
            onClick={toggleMic}
            title="Voice input"
            style={{
              width: 38,
              height: 38,
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: listening
                ? "rgba(255,0,0,.45)"
                : UI.surface2,
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
            }}
          >
            Ask
          </button>
        </div>
      </div>

      <ResizeHandle onResizeStart={startResize} />
    </section>,
    document.body
  );
}
