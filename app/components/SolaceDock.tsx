"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

type Message = { role: "user" | "assistant"; content: string };

const PAD = 12;
const HISTORY_LIMIT = 50;
const POS_KEY = "solace:pos:v3";
const HISTORY_KEY = (ws: string) => `solace:history:${ws}`;
const MINISTRY_KEY = "solace:ministry";

const ui = {
  panelBg:
    "radial-gradient(140% 160% at 50% -60%, rgba(26,35,53,0.85) 0%, rgba(14,21,34,0.88) 60%)",
  border: "1px solid var(--mc-border)",
  edge: "1px solid rgba(255,255,255,.06)",
  surface2: "rgba(12,19,30,.85)",
  text: "var(--mc-text)",
  sub: "var(--mc-muted)",
  glowOn:
    "0 0 0 1px rgba(251,191,36,.25) inset, 0 0 90px rgba(251,191,36,.14), 0 22px 70px rgba(0,0,0,.55)",
  shadow: "0 14px 44px rgba(0,0,0,.45)",
};

function isImageAttachment(file: any): boolean {
  if (!file) return false;
  const mime = file.mime || file.type;
  if (mime && typeof mime === "string" && mime.startsWith("image/")) return true;
  const name = file.name || "";
  return /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(name);
}

function getAttachmentUrl(file: any): string | null {
  if (!file) return null;
  return file.url || file.publicUrl || file.path || null;
}

export default function SolaceDock() {
  // ---------------------------------------------------------------------
  // Single mount guard
  // ---------------------------------------------------------------------
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

  // Minimize state
  const [minimized, setMinimized] = useState(false);

  // Panel layout tracking
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);
  const [panelW, setPanelW] = useState(0);
  const [panelH, setPanelH] = useState(0);

  // Chat logic
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  // Microphone
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  // Mobile
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Transcript auto-scroll
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Memory subsystem
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();

  // Attachments subsystem
  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: (text) =>
      setMessages((m) => [...m, { role: "assistant", content: text }]),
  });

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  // ---------------------------------------------------------------------
  // Load workspace-scoped chat history
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!canRender) return;

    try {
      const raw = localStorage.getItem(HISTORY_KEY(MCA_WORKSPACE_ID));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setMessages(parsed.slice(-HISTORY_LIMIT));
          return;
        }
      }
    } catch {}

    // If empty, greet
    setMessages([{ role: "assistant", content: "Ready when you are." }]);
  }, [canRender]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY(MCA_WORKSPACE_ID), JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // ---------------------------------------------------------------------
  // Panel measurement + reposition
  // ---------------------------------------------------------------------
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      setPanelW(r.width || 0);
      setPanelH(r.height || 0);
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

  // Mobile detection
  useEffect(() => {
    if (!canRender) return;

    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [canRender]);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  // Restore position or center
  useEffect(() => {
    if (!visible || !canRender) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (isMobile) {
      setPosReady(true);
      return;
    }

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          const sx = Math.min(Math.max(PAD, saved.x), vw - PAD);
          const sy = Math.min(Math.max(PAD, saved.y), vh - PAD);
          setPos(sx, sy);
          setPosReady(true);
          return;
        }
      }
    } catch {}

    requestAnimationFrame(() => {
      const w = panelW || 700;
      const h = panelH || 500;
      const startX = Math.max(PAD, Math.round((vw - w) / 2));
      const startY = Math.max(PAD, Math.round((vh - h) / 2));
      setPos(startX, startY);
      setPosReady(true);
    });
  }, [visible, canRender, panelW, panelH, isMobile, setPos]);

  // Persist panel pos
  useEffect(() => {
    if (!posReady || isMobile) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile]);

  // ---------------------------------------------------------------------
  // Dragging
  // ---------------------------------------------------------------------
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

  // ---------------------------------------------------------------------
  // Autosize textarea
  // ---------------------------------------------------------------------
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;

    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  // ---------------------------------------------------------------------
  // Ministry default
  // ---------------------------------------------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MINISTRY_KEY);
      if (saved === "0") return;
    } catch {}

    const next = new Set(filters);
    next.add("abrahamic");
    next.add("ministry");
    setFilters(next);

    try {
      localStorage.setItem(MINISTRY_KEY, "1");
    } catch {}
  }, []);

  // ---------------------------------------------------------------------
  // Send text chat
  // ---------------------------------------------------------------------
  async function sendToChat(userMsg: string, nextMsgs: Message[]) {
    const trimmedHistory = nextMsgs.slice(-HISTORY_LIMIT);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        history: trimmedHistory,
        userKey,
        workspaceId: MCA_WORKSPACE_ID,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${t}`);
    }

    const reader = res.body?.getReader();
    if (!reader) {
      setMessages((m) => [...m, { role: "assistant", content: "[No reply]" }]);
      return;
    }

    let accum = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = new TextDecoder().decode(value);
      accum += text;
      setMessages((m) => [
        ...m.filter((x) => x !== m[m.length - 1]),
        { role: "assistant", content: accum },
      ]);
    }
  }

  // ---------------------------------------------------------------------
  // Vision: one image only
  // ---------------------------------------------------------------------
  async function sendToVision(userMsg: string, nextMsgs: Message[]) {
    const imageFile = pendingFiles.find(isImageAttachment);
    const imageUrl = getAttachmentUrl(imageFile);

    if (!imageUrl) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I see an image attachment, but I don't have a usable link for it.",
        },
      ]);
      clearPending();
      return;
    }

    const prompt = userMsg || "Look at this image and describe what you see.";

    const res = await fetch("/api/solace/vision", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-User-Key": userKey },
      body: JSON.stringify({ prompt, imageUrl }),
    });

    clearPending();

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Vision HTTP ${res.status}: ${t}`);
    }

    const data = await res.json();
    setMessages((m) => [
      ...m,
      { role: "assistant", content: String(data.answer ?? "[No reply]") },
    ]);
  }

  // ---------------------------------------------------------------------
  // Unified send
  // ---------------------------------------------------------------------
  async function send() {
    const text = input.trim();
    const hasFiles = pendingFiles.length > 0;
    const hasImage = pendingFiles.some(isImageAttachment);

    if (!text && !hasFiles) return;
    if (streaming) return;

    setInput("");

    const userMsg = text || (hasFiles ? "Attachments:" : "");
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
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${err?.message ?? "Error"}` },
      ]);
    } finally {
      clearPending();
      setStreaming(false);
    }
  }

  // ---------------------------------------------------------------------
  // Speech recognition
  // ---------------------------------------------------------------------
  function toggleMic() {
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "🎤 Speech recognition not supported." },
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
    sr.interimResults = false;
    sr.maxAlternatives = 1;

    sr.onresult = (e: any) => {
      const t = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setInput((prev) => (prev ? prev + " " : t));
    };

    sr.onend = () => setListening(false);
    sr.onerror = () => setListening(false);

    recogRef.current = sr;
    sr.start();
    setListening(true);
  }

  // ---------------------------------------------------------------------
  // Early return for invisible or minimized mode
  // ---------------------------------------------------------------------
  if (!canRender || !visible) return null;

  if (minimized) {
    return createPortal(
      <button
        onClick={() => setMinimized(false)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background:
            "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1), rgba(251,191,36,.32))",
          boxShadow: "0 0 26px rgba(251,191,36,.55)",
          border: "1px solid rgba(255,255,255,.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

  // ---------------------------------------------------------------------
  // Mobile pill
  // ---------------------------------------------------------------------
  if (isMobile && collapsed) {
    return createPortal(
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        style={{
          position: "fixed",
          left: 16,
          right: 16,
          bottom: 22,
          padding: "10px 14px",
          borderRadius: 9999,
          background: "rgba(6,12,20,0.96)",
          border: ui.border,
          color: ui.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: ui.shadow,
          backdropFilter: "blur(10px)",
          zIndex: 99999,
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
                "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1), rgba(251,191,36,.32))",
              boxShadow: "0 0 28px rgba(251,191,36,.55)",
            }}
          />
          <span style={{ font: "600 13px system-ui" }}>Solace</span>
        </span>
        <span style={{ font: "12px system-ui", color: ui.sub }}>Tap to open</span>
      </button>,
      document.body
    );
  }

  // ---------------------------------------------------------------------
  // Desktop panel
  // ---------------------------------------------------------------------
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = vw - panelW - PAD;
  const maxY = vh - panelH - PAD;

  const tx = Math.min(Math.max(PAD, x), maxX);
  const ty = Math.min(Math.max(PAD, y), maxY);

  const invisible = !posReady;

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "70vh",
        background: ui.panelBg,
        borderRadius: "20px 20px 0 0",
        border: ui.border,
        boxShadow: ministryOn ? ui.glowOn : ui.shadow,
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pointerEvents: invisible ? "none" : "auto",
        opacity: invisible ? 0 : 1,
        transition: "opacity 120ms ease",
        zIndex: 99999,
      }
    : {
        position: "fixed",
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        width: "clamp(560px, 56vw, 980px)",
        height: "clamp(460px, 62vh, 820px)",
        background: ui.panelBg,
        borderRadius: 20,
        border: ui.border,
        boxShadow: ministryOn ? ui.glowOn : ui.shadow,
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pointerEvents: invisible ? "none" : "auto",
        opacity: invisible ? 0 : 1,
        transition: "opacity 120ms ease",
        resize: "both",
        zIndex: 99999,
      };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderBottom: ui.edge,
    background:
      "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0))",
    color: ui.text,
    cursor: isMobile ? "default" : "move",
    userSelect: "none",
  };

  const transcriptStyle: React.CSSProperties = {
    flex: "1 1 auto",
    overflow: "auto",
    padding: "14px 16px 10px 16px",
    background:
      "linear-gradient(180deg, rgba(12,19,30,.9), rgba(10,17,28,.92))",
    color: ui.text,
  };

  const textFieldBorderColor =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(
          "--mc-border"
        ) || "rgba(34,48,71,.9)"
      : "rgba(34,48,71,.9)";

  const fieldStyle: React.CSSProperties = {
    flex: "1 1 auto",
    minHeight: 60,
    maxHeight: 240,
    overflow: "auto",
    borderRadius: 12,
    padding: "10px 12px",
    resize: "none",
    outline: "none",
    border: `1px solid ${textFieldBorderColor}`,
    background: "#0e1726",
    color: ui.text,
    font:
      "14px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  };

  const askBtnStyle: React.CSSProperties = {
    minWidth: 80,
    height: 40,
    borderRadius: 12,
    background: "#6e8aff",
    color: "#fff",
    border: 0,
    font: "600 13px system-ui",
    cursor:
      streaming || (!input.trim() && pendingFiles.length === 0)
        ? "not-allowed"
        : "pointer",
    opacity:
      streaming || (!input.trim() && pendingFiles.length === 0)
        ? 0.55
        : 1,
  };

  // ---------------------------------------------------------------------
  // Panel JSX
  // ---------------------------------------------------------------------
  const panel = (
    <section
      ref={containerRef}
      role="dialog"
      aria-label="Solace"
      style={panelStyle}
    >
      {/* Header */}
      <header style={headerStyle} onMouseDown={onHeaderMouseDown}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Orb */}
          <span
            aria-hidden
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background:
                "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1), rgba(251,191,36,.25))",
              boxShadow: "0 0 38px rgba(251,191,36,.55)",
            }}
          />
          <span style={{ font: "600 13px system-ui" }}>Solace</span>
          <span style={{ font: "12px system-ui", color: ui.sub }}>
            Create with moral clarity
          </span>
          {/* Memory indicator */}
          <span
            title={memReady ? "Memory ready" : "Loading memory"}
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

        {/* Right side */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {/* Ministry toggle */}
          <button
            type="button"
            onClick={() => {
              const next = new Set(filters);
              if (ministryOn) {
                next.delete("abrahamic");
                next.delete("ministry");
                setFilters(next);
                localStorage.setItem(MINISTRY_KEY, "0");
              } else {
                next.add("abrahamic");
                next.add("ministry");
                setFilters(next);
                localStorage.setItem(MINISTRY_KEY, "1");
              }
            }}
            style={{
              borderRadius: 8,
              padding: "7px 10px",
              font: "700 12px system-ui",
              color: ministryOn ? "#000" : ui.text,
              background: ministryOn ? "#f6c453" : "#0e1726",
              border: ministryOn
                ? "1px solid #f4cf72"
                : `1px solid var(--mc-border)`,
              boxShadow: ministryOn
                ? "0 0 22px rgba(251,191,36,.65)"
                : "none",
              cursor: "pointer",
            }}
          >
            Ministry
          </button>

          {/* Minimize */}
          {!isMobile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMinimized(true);
              }}
              style={{
                borderRadius: 6,
                padding: "4px 8px",
                background: "#0e1726",
                color: ui.sub,
                border: ui.edge,
                cursor: "pointer",
                font: "600 12px system-ui",
              }}
            >
              –
            </button>
          )}

          {/* Mobile hide */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              style={{
                borderRadius: 999,
                padding: "4px 8px",
                background: "rgba(8,15,26,0.9)",
                border: ui.edge,
                color: ui.sub,
                font: "600 11px system-ui",
              }}
            >
              Hide
            </button>
          )}
        </div>
      </header>

      {/* Transcript */}
      <div ref={transcriptRef} style={transcriptStyle}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              borderRadius: 12,
              padding: "10px 12px",
              margin: "6px 0",
              background:
                m.role === "user"
                  ? "rgba(39,52,74,.6)"
                  : "rgba(28,38,54,.6)",
              color:
                m.role === "user"
                  ? ui.text
                  : "rgba(233,240,250,.94)",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* Composer */}
      <div
        style={{
          borderTop: ui.edge,
          background: ui.surface2,
          padding: 10,
        }}
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
              color: ui.text,
            }}
          >
            {pendingFiles.map((f: any, idx: number) => (
              <a
                key={idx}
                href={getAttachmentUrl(f) || "#"}
                target={getAttachmentUrl(f) ? "_blank" : undefined}
                style={{
                  padding: "4px 8px",
                  borderRadius: 8,
                  border: "1px solid var(--mc-border)",
                  background: "#0e1726",
                  textDecoration: "none",
                  opacity: getAttachmentUrl(f) ? 1 : 0.7,
                }}
              >
                📎 {f.name}
              </a>
            ))}
          </div>
        )}

        {/* Input row */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {/* Attach */}
            <button
              type="button"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>("#solace-file-input")
                  ?.click()
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid var(--mc-border)",
                background: "#0e1726",
                color: ui.text,
              }}
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

            {/* Mic */}
            <button
              type="button"
              onClick={toggleMic}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid var(--mc-border)",
                background: listening ? "#244a1f" : "#0e1726",
                color: ui.text,
              }}
            >
              {listening ? "■" : "🎤"}
            </button>
          </div>

          {/* Textarea */}
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
            style={fieldStyle}
          />

          {/* Ask btn */}
          <button
            type="button"
            onClick={send}
            disabled={streaming || (!input.trim() && pendingFiles.length === 0)}
            style={askBtnStyle}
          >
            {streaming ? "…" : "Ask"}
          </button>
        </div>

        {/* Footer status line */}
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
            {ministryOn ? "Ministry overlay" : "Neutral"}
          </span>

          {filters.size > 0 && (
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
