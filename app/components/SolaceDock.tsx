// app/components/SolaceDock.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";

/* ============================================================
   GLOBAL DECLARATIONS
   ============================================================ */
declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

/* ============================================================
   TYPES
   ============================================================ */
type Message = { role: "user" | "assistant"; content: string };
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";

const POS_KEY = "solace:pos:v3";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

/* ============================================================
   THEME
   ============================================================ */
const ui = {
  panelBg:
    "radial-gradient(140% 160% at 50% -60%, rgba(26,35,53,0.85) 0%, rgba(14,21,34,0.88) 60%)",
  border: "1px solid var(--mc-border)",
  edge: "1px solid rgba(255,255,255,.06)",
  text: "var(--mc-text)",
  sub: "var(--mc-muted)",
  surface2: "rgba(12,19,30,.85)",
  glowOn:
    "0 0 0 1px rgba(251,191,36,.25) inset, 0 0 90px rgba(251,191,36,.14), 0 22px 70px rgba(0,0,0,.55)",
  shadow: "0 14px 44px rgba(0,0,0,.45)",
};

/* ============================================================
   HELPERS
   ============================================================ */
function isImageAttachment(f: any): boolean {
  if (!f) return false;
  const mime = (f.mime || f.type || "") as string;
  if (mime?.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(f?.name || "");
}

function getAttachmentUrl(f: any): string | null {
  if (!f) return null;
  return f.url || f.publicUrl || f.path || null;
}

/**
 * Strip huge / unsafe content before sending to the API.
 * - Remove any data:image;base64 blobs from messages.
 * - Hard-cap message length so we never send absurdly long strings.
 */
function sanitizeMessagesForSend(msgs: Message[]): Message[] {
  const MAX_CHARS = 8000;
  const DATA_IMAGE_REGEX = /data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g;

  return msgs.map((m) => {
    let content = m.content || "";

    if (content.includes("data:image/")) {
      content = content.replace(
        DATA_IMAGE_REGEX,
        "[image omitted for context]"
      );
    }

    if (content.length > MAX_CHARS) {
      content = content.slice(0, MAX_CHARS) + "…";
    }

    return { ...m, content };
  });
}

/* ============================================================
   COMPONENT
   ============================================================ */
export default function SolaceDock() {
  /* ------------------ Mount protection ------------------ */
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

  /* ------------------ Local state ------------------ */
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);

  const [panelH, setPanelH] = useState(0);
  const [panelW, setPanelW] = useState(0);

  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ready when you are." },
  ]);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  /* ------------------ Memory hook ------------------ */
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();

  /* ------------------ Attachment hook ------------------ */
  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: (c) =>
      setMessages((m) => [...m, { role: "assistant", content: c }]),
  });

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  /* ============================================================
     EFFECTS — RESIZE, MOBILE, AUTO-SCROLL
     ============================================================ */
  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!canRender) return;
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [canRender]);

  useEffect(() => {
    // On mobile, start collapsed by default
    setCollapsed(isMobile);
  }, [isMobile]);

  /* ------------------ Measure panel ------------------ */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setPanelH(r.height);
      setPanelW(r.width);
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

  /* ------------------ Desktop position restore ------------------ */
  useEffect(() => {
    if (!canRender || !visible) return;

    if (window.innerWidth <= 768) {
      setPosReady(true);
      return;
    }

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { x: number; y: number } | null;
        if (saved) {
          setPos(saved.x, saved.y);
          setPosReady(true);
          return;
        }
      }
    } catch {}

    requestAnimationFrame(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = panelW || 760;
      const h = panelH || 560;
      const startX = Math.max(PAD, Math.round((vw - w) / 2));
      const startY = Math.max(PAD, Math.round((vh - h) / 2));
      setPos(startX, startY);
      setPosReady(true);
    });
  }, [canRender, visible, panelW, panelH, setPos]);

  /* ------------------ Save desktop position ------------------ */
  useEffect(() => {
    if (!posReady) return;
    if (isMobile) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile]);

  /* ------------------ Dragging ------------------ */
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

  /* ------------------ Autosize textarea ------------------ */
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  /* ------------------ Default ministry ON ------------------ */
  useEffect(() => {
    const saved = localStorage.getItem(MINISTRY_KEY);
    if (saved === "0") return;

    const next = new Set(filters);
    next.add("abrahamic");
    next.add("ministry");
    setFilters(next);
    localStorage.setItem(MINISTRY_KEY, "1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================================================
     SEND — CHAT + VISION
     ============================================================ */
  async function sendToChat(userMsg: string, msgs: Message[]) {
    const activeFilters = Array.from(filters);
    const safeMessages = sanitizeMessagesForSend(msgs);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Last-Mode": modeHint,
        "X-User-Key": userKey,
      },
      body: JSON.stringify({
        messages: safeMessages,
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
    const data = await res.json().catch(() => ({} as any));
    const reply = String(data.text ?? "[No reply]");
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  async function sendToVision(userMsg: string, msgs: Message[]) {
    const f = pendingFiles.find(isImageAttachment);
    const imageUrl = getAttachmentUrl(f);
    clearPending();

    if (!imageUrl) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Image missing — reattach and try again." },
      ]);
      return;
    }

    const prompt =
      userMsg ||
      "Look at this image, describe it, then provide helpful steps.";

    const res = await fetch("/api/solace/vision", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-User-Key": userKey },
      body: JSON.stringify({ prompt, imageUrl }),
    });

    const data = await res.json().catch(() => ({} as any));
    const reply = String(data.answer ?? "[No reply]");
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  async function send() {
    const text = input.trim();
    const hasAttachments = pendingFiles.length > 0;
    const hasImage = pendingFiles.some(isImageAttachment);

    if (!text && !hasAttachments) return;
    if (streaming) return;

    setInput("");

    const userMsg = text || (hasAttachments ? "Attachments:" : "");
    const nextUser: Message = { role: "user", content: userMsg };
    const nextMessages = [...messages, nextUser];
    setMessages(nextMessages);
    setStreaming(true);

    try {
      if (hasImage) await sendToVision(userMsg, nextMessages);
      else await sendToChat(userMsg, nextMessages);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e?.message || "Error"}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  /* ============================================================
     TOGGLES — MIC, MINISTRY
     ============================================================ */
  function toggleMinistry() {
    if (ministryOn) {
      const next = Array.from(filters).filter(
        (f) => f !== "abrahamic" && f !== "ministry"
      );
      setFilters(next);
      localStorage.setItem(MINISTRY_KEY, "0");
      return;
    }
    const next = new Set(filters);
    next.add("abrahamic");
    next.add("ministry");
    setFilters(next);
    localStorage.setItem(MINISTRY_KEY, "1");
  }

  function toggleMic() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "🎤 Microphone not supported." },
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
  }

  /* ============================================================
     VISIBILITY
     ============================================================ */
  if (!canRender || !visible) return null;

  /* ============================================================
     COLLAPSED STATES
     ============================================================ */

  // Mobile: collapsed = pill bar at bottom
  if (isMobile && collapsed) {
    return createPortal(
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        style={{
          position: "fixed",
          left: 16,
          right: 16,
          bottom: 20,
          padding: "10px 14px",
          borderRadius: 9999,
          border: ui.border,
          background: "rgba(6,12,20,0.96)",
          color: ui.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: ui.shadow,
          backdropFilter: "blur(10px)",
          zIndex: 60,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background:
                "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1) 0%, rgba(251,191,36,.65) 38%, rgba(251,191,36,.22) 72%, rgba(251,191,36,.12) 100%)",
              boxShadow: "0 0 38px rgba(251,191,36,.55)",
            }}
          />
          <span style={{ font: "600 13px system-ui" }}>Solace</span>
        </span>
        <span style={{ font: "12px system-ui", color: ui.sub }}>Tap to open</span>
      </button>,
      document.body
    );
  }

  // Desktop: collapsed = golden orb in bottom-right
  if (!isMobile && collapsed) {
    return createPortal(
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="Open Solace"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "1px solid rgba(251,191,36,.8)",
          background:
            "radial-gradient(65% 65% at 50% 35%, #fde68a 0%, #fbbf24 40%, #92400e 100%)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,.35) inset, 0 0 40px rgba(251,191,36,.75), 0 16px 40px rgba(0,0,0,.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 70,
        }}
      >
        <span
          style={{
            font: "700 18px system-ui",
            color: "#111827",
            textShadow: "0 1px 2px rgba(255,255,255,.6)",
          }}
        >
          S
        </span>
      </button>,
      document.body
    );
  }

  /* ============================================================
     PANEL POSITION — DESKTOP
     ============================================================ */
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const tx = Math.min(Math.max(0, x - PAD), Math.max(0, vw - panelW - PAD));
  const ty = Math.min(Math.max(0, y - PAD), Math.max(0, vh - panelH - PAD));

  const panelStyle: CSSProperties = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "70vh",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: ui.panelBg,
        borderRadius: "20px 20px 0 0",
        border: ui.border,
        boxShadow: ministryOn ? ui.glowOn : ui.shadow,
        backdropFilter: "blur(8px)",
        opacity: posReady ? 1 : 0,
        pointerEvents: posReady ? "auto" : "none",
        transition: "opacity 120ms ease",
        zIndex: 60,
      }
    : {
        position: "fixed",
        left: PAD,
        top: PAD,
        width: "clamp(560px, 56vw, 980px)",
        height: "clamp(460px, 62vh, 820px)",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: ui.panelBg,
        borderRadius: 20,
        border: ui.border,
        boxShadow: ministryOn ? ui.glowOn : ui.shadow,
        backdropFilter: "blur(8px)",
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        opacity: posReady ? 1 : 0,
        pointerEvents: posReady ? "auto" : "none",
        transition: "opacity 120ms ease",
        resize: "both",
        zIndex: 60,
      };

  /* ============================================================
     FINAL RENDER
     ============================================================ */
  const panel = (
    <section ref={containerRef} style={panelStyle} role="dialog" aria-label="Solace">
      {/* HEADER */}
      <header
        onMouseDown={onHeaderMouseDown}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          borderBottom: ui.edge,
          color: ui.text,
          userSelect: "none",
          cursor: isMobile ? "default" : "move",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.00))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background:
                "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1) 0%, rgba(251,191,36,.65) 38%, rgba(251,191,36,.22) 72%, rgba(251,191,36,.12) 100%)",
              boxShadow: "0 0 38px rgba(251,191,36,.55)",
            }}
          />
          <span style={{ font: "600 13px system-ui" }}>Solace</span>
          <span style={{ font: "12px system-ui", color: ui.sub }}>
            Create with moral clarity
          </span>

          <span
            title={memReady ? "Memory ready" : "Loading memory…"}
            style={{
              marginLeft: 8,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: memReady ? "#34d399" : "#f59e0b",
              boxShadow: memReady ? "0 0 8px #34d399aa" : "none",
            }}
          />
        </div>

        {/* Lenses */}
        <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
          {["Create", "Next Steps", "Red Team"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setModeHint(label as ModeHint)}
              style={{
                borderRadius: 8,
                padding: "7px 10px",
                font: "600 12px/1 system-ui",
                color: modeHint === label ? "#0b0f16" : ui.text,
                background: modeHint === label ? ui.text : "#0e1726",
                border: `1px solid var(--mc-border)`,
                cursor: "pointer",
              }}
            >
              {label.replace(" ", "")}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={toggleMinistry}
            style={{
              padding: "7px 10px",
              borderRadius: 8,
              font: "700 12px/1 system-ui",
              color: ministryOn ? "#000" : ui.text,
              background: ministryOn ? "#f6c453" : "#0e1726",
              border: ministryOn
                ? "1px solid #f4cf72"
                : "1px solid var(--mc-border)",
              boxShadow: ministryOn ? "0 0 22px rgba(251,191,36,.65)" : "none",
            }}
          >
            Ministry
          </button>

          {/* Collapse button */}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,.6)",
              background: "rgba(15,23,42,.9)",
              color: ui.sub,
              font: "700 14px system-ui",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Minimize Solace"
          >
            –
          </button>
        </div>
      </header>

      {/* TRANSCRIPT */}
      <div
        ref={transcriptRef}
        style={{
          flex: "1 1 auto",
          overflow: "auto",
          padding: "14px 16px",
          background:
            "linear-gradient(180deg, rgba(12,19,30,.9), rgba(10,17,28,.92))",
          color: ui.text,
        }}
      >
        {messages.map((m, i) => {
          const html = m.content
            .replace(
              /<img([^>]+)>/g,
              `<img $1 style="max-width:100%;height:auto;border-radius:12px;display:block;margin:8px auto;box-shadow:0 0 18px rgba(0,0,0,.35);" />`
            )
            .replace(/\n/g, "<br />");

          return (
            <div
              key={i}
              style={{
                margin: "6px 0",
                padding: "10px 12px",
                borderRadius: 12,
                whiteSpace: "normal",
                color: m.role === "user" ? ui.text : "rgba(233,240,250,.95)",
                background:
                  m.role === "user"
                    ? "rgba(39,52,74,.6)"
                    : "rgba(28,38,54,.6)",
              }}
            >
              <div style={{ width: "100%" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: html,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPOSER */}
      <div
        style={{
          padding: 10,
          borderTop: ui.edge,
          background: ui.surface2,
        }}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        {/* Attachments */}
        {pendingFiles.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 8,
              font: "12px system-ui",
              color: ui.text,
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
                  borderRadius: 8,
                  border: "1px solid var(--mc-border)",
                  background: "#0e1726",
                  textDecoration: "none",
                }}
              >
                📎 {f.name}
              </a>
            ))}
          </div>
        )}

        {/* Row */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          {/* Attach + Mic */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              style={iconBtn}
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>("#solace-file-input")
                  ?.click()
              }
            >
              📎
            </button>
            <input
              id="solace-file-input"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
            />

            <button
              type="button"
              style={{
                ...iconBtn,
                background: listening ? "#244a1f" : "#0e1726",
              }}
              onClick={toggleMic}
            >
              {listening ? "■" : "🎤"}
            </button>
          </div>

          {/* TEXTAREA */}
          <textarea
            ref={taRef}
            value={input}
            placeholder="Speak or type…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            style={{
              flex: "1 1 auto",
              minWidth: 0,
              width: "100%",
              flexShrink: 1,
              minHeight: 60,
              maxHeight: 240,
              overflow: "auto",
              border: `1px solid var(--mc-border)`,
              background: "#0e1726",
              color: ui.text,
              borderRadius: 12,
              padding: "10px 12px",
              font:
                "14px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
              resize: "none",
              outline: "none",
            }}
          />

          {/* BUTTON */}
          <button
            type="button"
            onClick={send}
            disabled={streaming || (!input.trim() && pendingFiles.length === 0)}
            style={{
              minWidth: 80,
              height: 40,
              borderRadius: 12,
              border: "0",
              background: "#6e8aff",
              color: "#fff",
              font: "600 13px system-ui",
              opacity:
                streaming || (!input.trim() && pendingFiles.length === 0)
                  ? 0.55
                  : 1,
              cursor:
                streaming || (!input.trim() && pendingFiles.length === 0)
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {streaming ? "…" : "Ask"}
          </button>
        </div>

        {/* Footer mode display */}
        <div
          style={{
            marginTop: 6,
            display: "flex",
            justifyContent: "space-between",
            font: "12px system-ui",
            color: ui.sub,
          }}
        >
          <span>
            {ministryOn ? "Create • Ministry overlay" : modeHint || "Neutral"}
          </span>
          {!!filters.size && (
            <span
              style={{
                maxWidth: "60%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Filters: {Array.from(filters).join(", ")}
            </span>
          )}
        </div>
      </div>
    </section>
  );

  return createPortal(panel, document.body);
}

/* ============================================================
   STYLES
   ============================================================ */
const iconBtn: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  border: "1px solid var(--mc-border)",
  background: "#0e1726",
  color: "var(--mc-text)",
  cursor: "pointer",
};

