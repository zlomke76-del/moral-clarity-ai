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
import SolaceDockHeaderLite from "./dock-header-lite";
import {
  useDockSize,
  ResizeHandle,
  createResizeController,
} from "./dock-resize";

// --------------------------------------------------------------------------------------
// Message type (extended to support imageUrl)
// --------------------------------------------------------------------------------------
type Message = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string | null;
};

type ModeHint = "Neutral";
const DEFAULT_MODE: ModeHint = "Neutral";

// --------------------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------------------
const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

// --------------------------------------------------------------------------------------
// Extract URL from pending attachments
// --------------------------------------------------------------------------------------
function getAttachmentUrl(f: any): string | null {
  return f?.url || f?.publicUrl || f?.path || null;
}

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
} = useSolaceStore();

const modeHint: ModeHint = "Neutral";

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
  // Chat messages
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
  // Ministry toggle state hydration
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
        if (
          saved &&
          Number.isFinite(saved.x) &&
          Number.isFinite(saved.y)
        ) {
          const sx = Math.max(PAD, Math.min(vw - PAD, saved.x));
          const sy = Math.max(PAD, Math.min(vh - PAD, saved.y));
          setPos(sx, sy);
          setPosReady(true);
          return;
        }
      }
    } catch {}

    requestAnimationFrame(() => {
      const w = panelW || 760;
      const h = panelH || 560;
      const startX = Math.max(PAD, Math.round((vw - w) / 2));
      const startY = Math.max(PAD, Math.round((vh - h) / 2));
      setPos(startX, startY);
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

  // --------------------------------------------------------------------
  // Resize
  // --------------------------------------------------------------------
  const { dockW, dockH, setDockW, setDockH } = useDockSize();
  const startResize = createResizeController(
    dockW,
    dockH,
    setDockW,
    setDockH
  );

  // ------------------------------------------------------------------------------------
  // SEND CHAT TEXT TO /api/chat (now returns { text, imageUrl })
  // ------------------------------------------------------------------------------------
  async function sendToChat(userMsg: string, prevHistory: Message[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        history: prevHistory,
        workspaceId: MCA_WORKSPACE_ID,
        ministryMode: ministryOn,
        modeHint,
        userKey,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${t}`);
    }

    const data = await res.json();

    return {
      text: data.text ?? "",
      imageUrl: data.imageUrl ?? null,
    };
  }

  // ------------------------------------------------------------------------------------
  // SEND TO VISION
  // ------------------------------------------------------------------------------------
  async function sendToVision(userMsg: string, prevHistory: Message[]) {
    const imageAttachment = pendingFiles.find((f) => {
      const mime = f.mime || f.type || "";
      return (
        mime.startsWith("image/") ||
        /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(f.name || "")
      );
    });

    const imageUrl = getAttachmentUrl(imageAttachment);

    if (!imageUrl) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I see an image attachment, but I don’t have a usable link.",
        },
      ]);
      clearPending();
      return { text: "", imageUrl: null };
    }

    const prompt =
      userMsg.trim() ||
      "Look at this image and describe what you see.";

    const res = await fetch("/api/solace/vision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Key": userKey,
      },
      body: JSON.stringify({ prompt, imageUrl }),
    });

    clearPending();

    const data = await res.json();
    return { text: data.answer ?? "", imageUrl: null };
  }

  // ------------------------------------------------------------------------------------
  // MAIN SEND FUNCTION
  // ------------------------------------------------------------------------------------
  async function send() {
    const text = input.trim();
    const hasAttachments = pendingFiles.length > 0;

    const hasImage =
      hasAttachments &&
      pendingFiles.some((f) => {
        const mime = f.mime || f.type || "";
        return (
          mime.startsWith("image/") ||
          /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(f.name || "")
        );
      });

    if (!text && !hasAttachments) return;
    if (streaming) return;

    const userMsg = text || "Attachments:";

    setInput("");
    setStreaming(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg },
    ]);

    
    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let reply;

      if (hasImage) {
        reply = await sendToVision(userMsg, history);
      } else {
        reply = await sendToChat(userMsg, history);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply.text,
          imageUrl: reply.imageUrl ?? null,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${err.message || "Error"}`,
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  // ------------------------------------------------------------------------------------
  // ENTER TO SEND
  // ------------------------------------------------------------------------------------
  function onEnterSend(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // ------------------------------------------------------------------------------------
  // Toggle Ministry
  // ------------------------------------------------------------------------------------
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

   // ------------------------------------------------------------------------------------
  // Microphone
  // ------------------------------------------------------------------------------------
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  function toggleMic() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "🎤 Microphone not supported in this browser.",
        },
      ]);
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

    sr.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setInput((p) => (p ? p + " " : "") + text);
    };

    sr.onend = () => setListening(false);

    recogRef.current = sr;
    sr.start();
    setListening(true);
  }

  // ------------------------------------------------------------------------------------
  // Minimized bubble
  // ------------------------------------------------------------------------------------
  if (!canRender || !visible) return null;

  if (minimized) {
    const bubbleStyle: React.CSSProperties = {
      position: "fixed",
      bottom: 20,
      right: 20,
      width: 58,
      height: 58,
      borderRadius: "50%",
      background:
        "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1) 0%, rgba(251,191,36,.65) 38%, rgba(251,191,36,.22) 72%, rgba(251,191,36,.12) 100%)",
      boxShadow: "0 0 26px rgba(251,191,36,.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 999999,
      color: "#000",
      fontWeight: 700,
    };
    return createPortal(
      <button style={bubbleStyle} onClick={() => setMinimized(false)}>
        S
      </button>,
      document.body
    );
  }

  // ------------------------------------------------------------------------------------
  // Positioning
  // ------------------------------------------------------------------------------------
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);

  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);

  const invisible = !posReady;
  const skin = Skins.default;

  // ------------------------------------------------------------------------------------
  // Styles
  // ------------------------------------------------------------------------------------
  const panelStyle: React.CSSProperties = {
    position: "fixed",
    left: PAD,
    top: PAD,
    width: dockW,
    height: dockH,
    background: skin.panelBg,
    borderRadius: UI.radiusLg,
    border: skin.border,
    boxShadow: ministryOn ? UI.glowOn : UI.shadow,
    backdropFilter: "blur(8px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    pointerEvents: invisible ? "none" : "auto",
    transform: `translate3d(${tx}px, ${ty}px, 0)`,
    opacity: invisible ? 0 : 1,
    transition: "opacity 120ms ease",
    zIndex: 60,
  };

  const transcriptStyle: React.CSSProperties = {
    flex: "1 1 auto",
    overflow: "auto",
    padding: "14px 16px",
    color: UI.text,
    background:
      "linear-gradient(180deg, rgba(12,19,30,.9), rgba(10,17,28,.92))",
  };

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 70,
    maxHeight: 180,
    resize: "none",
    padding: "10px 12px",
    borderRadius: UI.radiusMd,
    border: UI.border,
    background: UI.surface2,
    color: UI.text,
    fontSize: "15px",
    lineHeight: "1.4",
    outline: "none",
  };

  const composerWrapStyle: React.CSSProperties = {
    borderTop: UI.edge,
    background: UI.surface1,
    padding: 10,
  };

  // ------------------------------------------------------------------------------------
  // Main UI
  // ------------------------------------------------------------------------------------
  const panel = (
    <section ref={containerRef} style={panelStyle}>
      <SolaceDockHeaderLite
  ministryOn={ministryOn}
  memReady={memReady}
  onToggleMinistry={toggleMinistry}
  onMinimize={() => setMinimized(true)}
  onDragStart={onHeaderMouseDown}
/>

      {/* TRANSCRIPT */}
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
            {/* TEXT */}
            {m.content}

            {/* IMAGE (Option C behavior) */}
            {m.imageUrl && (
              <img
                src={m.imageUrl}
                alt="Generated"
                style={{
                  display: "block",
                  marginTop: 10,
                  maxWidth: "100%",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* COMPOSER */}
      <div
        style={composerWrapStyle}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        {/* Pending attachments */}
        {pendingFiles.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 8,
              font: "12px system-ui",
            }}
          >
            {pendingFiles.map((f, idx) => (
              <a
                key={idx}
                href={getAttachmentUrl(f) || "#"}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "4px 8px",
                  borderRadius: UI.radiusMd,
                  border: UI.border,
                  background: "#0e1726",
                }}
              >
                📎 {f.name}
              </a>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          {/* PAPERCLIP */}
          <label
            style={{
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: UI.radiusMd,
              border: UI.border,
              background: UI.surface2,
              color: UI.text,
              userSelect: "none",
            }}
          >
            📎
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) =>
                handleFiles(e.target.files, { prefix: "solace" })
              }
            />
          </label>

          {/* MIC */}
          <button
            onClick={toggleMic}
            style={{
              padding: "6px 10px",
              borderRadius: UI.radiusMd,
              border: UI.edge,
              background: listening
                ? "rgba(255,0,0,.45)"
                : UI.surface2,
              color: listening ? "#fff" : UI.text,
            }}
          >
            🎤
          </button>

          {/* TEXT AREA */}
          <textarea
            style={textareaStyle}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnterSend}
            placeholder="Ask Solace..."
          />

          {/* ASK BUTTON */}
          <button
            onClick={send}
            disabled={streaming}
            style={{
              padding: "10px 14px",
              borderRadius: UI.radiusMd,
              background: "#fbbf24",
              border: "none",
              color: "#000",
              fontWeight: 600,
              cursor: "pointer",
              opacity: streaming ? 0.5 : 1,
            }}
          >
            Ask
          </button>
        </div>

        <div
          style={{
            marginTop: 6,
            display: "flex",
            justifyContent: "space-between",
            font: "12px system-ui",
            color: UI.sub,
          }}
        >
          <span>
                {ministryOn ? "Ministry • " : ""}
            {modeHint}
          </span>
        </div>
      </div>

      <ResizeHandle onResizeStart={startResize} />
    </section>
  );

  return createPortal(panel, document.body);
}
