"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import MessageRenderer from "./solace/MessageRenderer";

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

type EvidenceBlock = {
  id?: string;
  source?: string;
  summary?: string;
  text?: string;
};

type PendingFile = {
  name: string;
  mime: string;
  url: string;
  size?: number;
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
  // Conversation ID (STABLE PER CONVERSATION)
  // --------------------------------------------------------------------
  const conversationIdRef = useRef<string | null>(null);
  if (!conversationIdRef.current) {
    conversationIdRef.current = crypto.randomUUID();
  }
  const conversationId = conversationIdRef.current;

  // --------------------------------------------------------------------
  // Store state
  // --------------------------------------------------------------------
  const { visible, setVisible, x, y, setPos, filters, setFilters } =
    useSolaceStore();

  const modeHint = "Neutral" as const;

  // --------------------------------------------------------------------
  // Viewport
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
  }, [setFilters]);

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
            Math.max(PAD, Math.min(vw - panelW - PAD, saved.x)),
            Math.max(PAD, Math.min(vh - panelH - PAD, saved.y))
          );
          setPosReady(true);
          return;
        }
      }
    } catch {}

    setPos(Math.round((vw - 760) / 2), Math.round((vh - 560) / 2));
    setPosReady(true);
  }, [canRender, visible, viewport.w, viewport.h, setPos, panelW, panelH]);

  // --------------------------------------------------------------------
  // Persist position
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
        aria-label="Open Solace Dock"
      >
        S
      </button>,
      document.body
    );
  }

  // ====================================================================
  // SEND (VISION-AWARE)
  // ====================================================================
  async function send() {
    if (!input.trim() && pendingFiles.length === 0) return;
    if (streaming) return;

    const userMsg = input.trim() || "Attachments:";
    setInput("");
    setStreaming(true);

    setMessages((m) => [...m, { role: "user", content: userMsg }]);

    try {
      const imageFiles = (pendingFiles as PendingFile[]).filter((f) =>
        f.mime.startsWith("image/")
      );

      if (imageFiles.length > 0) {
        for (const img of imageFiles) {
          const visionRes = await fetch("/api/solace/vision", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl: img.url,
              prompt: userMsg,
            }),
          });

          const visionData = await visionRes.json();

          if (visionData?.answer) {
            setMessages((m) => [
              ...m,
              {
                role: "assistant",
                content: visionData.answer,
                imageUrl: img.url,
              },
            ]);
          }
        }
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          canonicalUserKey: userKey || undefined,
          workspaceId: MCA_WORKSPACE_ID,
          conversationId,
          ministryMode: ministryOn,
          modeHint,
          attachments: pendingFiles,
        }),
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      const data = await res.json();
      ingestPayload(data);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `?? ${e?.message ?? "Request failed"}` },
      ]);
    } finally {
      setStreaming(false);
      clearPending();
    }
  }
  // --------------------------------------------------------------------
  // Enter-to-send handler
  // --------------------------------------------------------------------
  const onEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // --------------------------------------------------------------------
  // Payload ingestion (unchanged)
  // --------------------------------------------------------------------
  function ingestPayload(data: any) {
  if (!data) throw new Error("Empty response payload");
// --------------------------------------------------
// IMAGE RESPONSE — BASE64 (AUTHORITATIVE)
// --------------------------------------------------
if (
  Array.isArray(data.data) &&
  data.data[0] &&
  typeof data.data[0].b64_json === "string"
) {
  const base64 = data.data[0].b64_json;
const imageUrl = `data:image/png;base64,${base64}`;

  setMessages((m) => [
    ...m,
    {
      role: "assistant",
      content: "",
      imageUrl,
    },
  ]);
  return;
}

  // --------------------------------------------------
// IMAGE RESPONSE (AUTHORITATIVE)
// --------------------------------------------------
const image =
  typeof data.image === "string"
    ? data.image
    : typeof data.imageUrl === "string"
    ? data.imageUrl
    : null;

if (image) {
  setMessages((m) => [
    ...m,
    {
      role: "assistant",
      content: "", // image-only bubble
      imageUrl: image,
    },
  ]);
  return;
}

  // --------------------------------------------------
  // STANDARD STRING RESPONSE
  // --------------------------------------------------
  if (data.ok === true && typeof data.response === "string") {
    setMessages((m) => [...m, { role: "assistant", content: data.response }]);
    return;
  }

  // --------------------------------------------------
  // MULTI-MESSAGE RESPONSE
  // --------------------------------------------------
  if (Array.isArray(data.messages)) {
    const normalized = data.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content ?? "",
      imageUrl: msg.imageUrl ?? null,
    }));
    setMessages((m) => [...m, ...normalized]);
    return;
  }

  // --------------------------------------------------
  // LEGACY SINGLE MESSAGE
  // --------------------------------------------------
  if (data.message?.content) {
    setMessages((m) => [
      ...m,
      { role: "assistant", content: data.message.content },
    ]);
    return;
  }

  // --------------------------------------------------
  // EVIDENCE BLOCKS
  // --------------------------------------------------
  if (Array.isArray(data.evidence)) {
    const evMsgs: Message[] = data.evidence.map((e: EvidenceBlock) => ({
      role: "assistant",
      content:
        `📎 Evidence` +
        (e.source ? ` (${e.source})` : "") +
        `\n\n${e.summary || e.text || "[no content]"}`,
    }));
    setMessages((m) => [...m, ...evMsgs]);
    return;
  }

  throw new Error("Unrecognized response payload");
}

  // --------------------------------------------------------------------
// RENDER
// --------------------------------------------------------------------
const panel = (
  <section ref={containerRef} style={panelStyle}>
    <SolaceDockHeaderLite
      ministryOn={ministryOn}
      memReady={memReady}
      onToggleMinistry={() => {
        const next = new Set(filters);
        if (ministryOn) {
          next.delete("abrahamic");
          next.delete("ministry");
          try {
            localStorage.setItem(MINISTRY_KEY, "0");
          } catch {}
        } else {
          next.add("abrahamic");
          next.add("ministry");
          try {
            localStorage.setItem(MINISTRY_KEY, "1");
          } catch {}
        }
        setFilters(next);
      }}
      onMinimize={() => setMinimized(true)}
      onDragStart={onHeaderMouseDown}
    />

    {/* ---------------- Transcript ---------------- */}
    <div
      ref={transcriptRef}
      style={transcriptStyle}
      tabIndex={-1}
      aria-live="polite"
    >
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
            color: "white",
          }}
        >
          {m.imageUrl && (
            <img
              src={m.imageUrl}
              alt="Solace visual"
              style={{
                maxWidth: "100%",
                borderRadius: 12,
                marginBottom: m.content ? 6 : 0,
                display: "block",
              }}
            />
          )}

         
    {/* ---------------- Composer ---------------- */}
    <div
      style={composerWrapStyle}
      onPaste={(e) => handlePaste(e, { prefix: "solace" })}
    >
      {pendingFiles.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            paddingBottom: 8,
            overflowX: "auto",
          }}
        >
          {pendingFiles.map((f: PendingFile, i: number) => (
            <div
              key={i}
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                border: UI.border,
                background: UI.surface2,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title={f.name}
            >
              {f.mime.startsWith("image/") ? (
                <img
                  src={f.url}
                  alt={f.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    borderRadius: 6,
                  }}
                />
              ) : (
                <span style={{ fontSize: 18 }}>??</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* composer input continues below */}

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
            aria-label="Attach files"
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

          <button
            onClick={toggleMic}
            style={{
              width: 38,
              height: 38,
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: listening ? "rgba(255,0,0,.45)" : UI.surface2,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-pressed={listening}
            aria-label={listening ? "Stop recording" : "Start recording"}
            type="button"
          >
            🎤
          </button>

          <textarea
            style={textareaStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnterSend}
            placeholder="Ask Solace..."
            aria-label="Message input"
            rows={1}
            spellCheck={false}
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
              cursor: streaming ? "not-allowed" : "pointer",
            }}
            type="button"
            aria-disabled={streaming}
          >
            Ask
          </button>
        </div>
      </div>
</div>

      <ResizeHandle onResizeStart={startResize} />
    </section>
  );

  return createPortal(panel, document.body);
}
