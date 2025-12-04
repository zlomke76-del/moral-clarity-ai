// app/components/SolaceDock.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";

const POS_KEY = "solace:pos:v3";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

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

function isImageAttachment(f: any): boolean {
  if (!f) return false;
  const mime = (f.mime || f.type || "") as string;
  if (mime && typeof mime === "string" && mime.startsWith("image/")) return true;
  const name = (f.name || "") as string;
  if (!name) return false;
  return /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(name);
}

function getAttachmentUrl(f: any): string | null {
  if (!f) return null;
  if (typeof f.url === "string") return f.url;
  if (typeof f.publicUrl === "string") return f.publicUrl;
  if (typeof f.path === "string") return f.path;
  return null;
}

export default function SolaceDock() {
  // ensure single mount
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

  // ---------------------------------------------------------
  // NEW MINIMIZE STATE
  const [minimized, setMinimized] = useState(false);
  // ---------------------------------------------------------

  // --- state ----------------------------------------------------
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);
  const [panelH, setPanelH] = useState(0);
  const [panelW, setPanelW] = useState(0);

  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  // speech
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  // mobile responsiveness
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // mobile-only pill mode

  // transcript auto-scroll
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // MEMORY hook
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();

  const appendInfo = (content: string) => {
    setMessages((m) => [...m, { role: "assistant", content }]);
  };

  // ATTACHMENTS
  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: appendInfo,
  });

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  // seed welcome
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // measure/clamp container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setPanelH(r.height || 0);
      setPanelW(r.width || 0);
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

  // viewport breakpoint
  useEffect(() => {
    if (!canRender) return;
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [canRender]);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
    else setCollapsed(false);
  }, [isMobile]);

  // restore / center
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
        const saved = JSON.parse(raw) as { x: number; y: number } | null;
        if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          const sx = Math.max(PAD, Math.min(vw - PAD, saved.x));
          const sy = Math.max(PAD, Math.min(vh - PAD, saved.y));
          setPos(sx, sy);
          setPosReady(true);
          return;
        }
      }
    } catch {}

    requestAnimationFrame(() => {
      const w = panelW || Math.min(980, Math.max(560, Math.round(vw * 0.56)));
      const h = panelH || Math.min(820, Math.max(460, Math.round(vh * 0.62)));
      const startX = Math.max(PAD, Math.round((vw - w) / 2));
      const startY = Math.max(PAD, Math.round((vh - h) / 2));
      setPos(startX, startY);
      setPosReady(true);
    });
  }, [canRender, visible, panelW, panelH, setPos]);

  // persist pos
  useEffect(() => {
    if (!posReady || isMobile) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile]);

  // dragging
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

  // autoresize
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  // ministry default
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MINISTRY_KEY);
      if (saved === "0") return;
    } catch {}

    const hasAbrahamic = filters.has("abrahamic");
    const hasMinistry = filters.has("ministry");
    if (!hasAbrahamic || !hasMinistry) {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
      try {
        localStorage.setItem(MINISTRY_KEY, "1");
      } catch {}
    }
  }, []);

  // send actions -------------------------------------------------

  async function sendToChat(userMsg: string, nextMsgs: Message[]) {
    const activeFilters: string[] = Array.from(filters);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Last-Mode": modeHint,
        "X-User-Key": userKey,
      },
      body: JSON.stringify({
        messages: nextMsgs,
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

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${t}`);
    }
    const data = await res.json();
    const reply = String(data.text ?? "[No reply]");
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  async function sendToVision(userMsg: string, nextMsgs: Message[]) {
    const imageAttachment = pendingFiles.find(isImageAttachment);
    const imageUrl = getAttachmentUrl(imageAttachment);

    if (!imageUrl) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I see an image attachment, but I don’t have a usable link for it. Try re-attaching or uploading again.",
        },
      ]);
      clearPending();
      return;
    }

    const prompt =
      userMsg.trim() ||
      "Look at this image and describe what you see, then offer practical, nonjudgmental help.";

    const res = await fetch("/api/solace/vision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Key": userKey,
      },
      body: JSON.stringify({ prompt, imageUrl }),
    });

    clearPending();

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Vision HTTP ${res.status}: ${t}`);
    }

    const data = await res.json();
    const reply = String(data.answer ?? "[No reply]");
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  async function send() {
    const text = input.trim();
    const hasAnyAttachments = pendingFiles.length > 0;
    const hasImage = pendingFiles.some(isImageAttachment);

    if (!text && !hasAnyAttachments) return;
    if (streaming) return;

    setInput("");

    const userMsg = text || (hasAnyAttachments ? "Attachments:" : "");
    const nextUser: Message = { role: "user", content: userMsg };
    const nextMsgs: Message[] = [...messages, nextUser];
    setMessages(nextMsgs);
    setStreaming(true);

    try {
      if (hasImage) {
        await sendToVision(userMsg, nextMsgs);
      } else {
        await sendToChat(userMsg, nextMsgs);
      }
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e?.message ?? "Error"}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  function toggleMinistry() {
    if (ministryOn) {
      const next = Array.from(filters).filter(
        (f) => f !== "abrahamic" && f !== "ministry"
      );
      setFilters(next);
      try {
        localStorage.setItem(MINISTRY_KEY, "0");
      } catch {}
    } else {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
      try {
        localStorage.setItem(MINISTRY_KEY, "1");
      } catch {}
    }
  }

  function toggleMic() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      appendInfo("🎤 Microphone is not supported in this browser.");
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
      setInput((prev) => (prev ? prev + " " : "") + t);
    };
    sr.onend = () => setListening(false);
    sr.onerror = () => setListening(false);
    recogRef.current = sr;
    sr.start();
    setListening(true);
  }

  if (!canRender || !visible) return null;

  // ---------------------------------------------------------
  // ⭐ NEW MINIMIZED BUBBLE (safe early return)
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
      border: "1px solid rgba(255,255,255,.18)",
    };

    return createPortal(
      <button
        onClick={() => setMinimized(false)}
        style={bubbleStyle}
        aria-label="Open Solace"
      >
        S
      </button>,
      document.body
    );
  }
  // ---------------------------------------------------------

  // clamp within viewport (desktop)
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);
  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);
  const invisible = !posReady;

  // ---------- styles --------------------------------------------------
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        top: "auto",
        width: "100%",
        maxWidth: "100%",
        height: "70vh",
        maxHeight: "80vh",
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
        zIndex: 60,
      }
    : {
        position: "fixed",
        left: PAD,
        top: PAD,
        width: "clamp(560px, 56vw, 980px)",
        height: "clamp(460px, 62vh, 820px)",
        maxHeight: "90vh",
        background: ui.panelBg,
        borderRadius: 20,
        border: ui.border,
        boxShadow: ministryOn ? ui.glowOn : ui.shadow,
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pointerEvents: invisible ? "none" : "auto",
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        opacity: invisible ? 0 : 1,
        transition: "opacity 120ms ease",
        resize: "both",
        zIndex: 60,
      };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderBottom: ui.edge,
    cursor: isMobile ? "default" : "move",
    userSelect: "none",
    background:
      "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.00))",
    color: ui.text,
  };

  const transcriptStyle: React.CSSProperties = {
    flex: "1 1 auto",
    overflow: "auto",
    padding: "14px 16px 10px 16px",
    color: ui.text,
    background:
      "linear-gradient(180deg, rgba(12,19,30,.9), rgba(10,17,28,.92))",
  };

  const composerWrapStyle: React.CSSProperties = {
    borderTop: ui.edge,
    background: ui.surface2,
    padding: 10,
  };

  const borderColor =
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
    border: `1px solid ${borderColor}`,
    background: "#0e1726",
    color: ui.text,
    borderRadius: 12,
    padding: "10px 12px",
    font:
      "14px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    resize: "none",
    outline: "none",
  };

  const askBtnStyle: React.CSSProperties = {
    minWidth: 80,
    height: 40,
    borderRadius: 12,
    border: "0",
    background: "#6e8aff",
    color: "#fff",
    font:
      "600 13px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    cursor:
      streaming || (!input.trim() && pendingFiles.length === 0)
        ? "not-allowed"
        : "pointer",
    opacity:
      streaming || (!input.trim() && pendingFiles.length === 0) ? 0.55 : 1,
  };

  const orbStyle: React.CSSProperties = {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background:
      "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1) 0%, rgba(251,191,36,.65) 38%, rgba(251,191,36,.22) 72%, rgba(251,191,36,.12) 100%)",
    boxShadow: "0 0 38px rgba(251,191,36,.55)",
    flex: "0 0 22px",
  };

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        borderRadius: 8,
        padding: "7px 10px",
        font:
          "600 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        color: active ? "#0b0f16" : "var(--mc-text)",
        background: active ? "var(--mc-text)" : "#0e1726",
        border: `1px solid var(--mc-border)`,
        cursor: "pointer",
      }}
      title={`${label} mode`}
      type="button"
    >
      {label}
    </button>
  );

  const ministryTab = (
    <button
      onClick={toggleMinistry}
      title="Ministry mode"
      type="button"
      style={{
        borderRadius: 8,
        padding: "7px 10px",
        font:
          "700 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        color: ministryOn ? "#000" : "var(--mc-text)",
        background: ministryOn ? "#f6c453" : "#0e1726",
        border: `1px solid ${ministryOn ? "#f4cf72" : "var(--mc-border)"}`,
        boxShadow: ministryOn ? "0 0 22px rgba(251,191,36,.65)" : "none",
        cursor: "pointer",
      }}
    >
      Ministry
    </button>
  );

  // mobile pill
  if (isMobile && collapsed) {
    const pillStyle: React.CSSProperties = {
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
    };

    return createPortal(
      <button
        type="button"
        style={pillStyle}
        onClick={() => setCollapsed(false)}
        aria-label="Open Solace"
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span aria-hidden style={orbStyle} />
          <span style={{ font: "600 13px system-ui" }}>Solace</span>
        </span>
        <span style={{ font: "12px system-ui", color: ui.sub }}>
          Tap to open
        </span>
      </button>,
      document.body
    );
  }

  // FULL PANEL ---------------------------------------------------

  const panel = (
    <section
      ref={containerRef}
      role="dialog"
      aria-label="Solace"
      style={panelStyle}
      onClick={(e) => {
        if (!containerRef.current || isMobile) return;
        if ((e as any).altKey) {
          const vw2 = window.innerWidth;
          const vh2 = window.innerHeight;
          const w = panelW || 760;
          const h = panelH || 560;
          const startX = Math.max(PAD, Math.round((vw2 - w) / 2));
          const startY = Math.max(PAD, Math.round((vh2 - h) / 2));
          setPos(startX, startY);
          try {
            localStorage.removeItem(POS_KEY);
          } catch {}
        }
      }}
    >
      {/* HEADER */}
      <header style={headerStyle} onMouseDown={onHeaderMouseDown}>
        {/* left: orb + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden
            style={orbStyle}
            title="Alt+Click header to center/reset"
          />
          <span style={{ font: "600 13px system-ui", color: ui.text }}>
            Solace
          </span>
          <span style={{ font: "12px system-ui", color: ui.sub }}>
            Create with moral clarity
          </span>

          {/* memory dot */}
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

        {/* lenses */}
        <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
          {chip("Create", modeHint === "Create", () => setModeHint("Create"))}
          {chip("Next", modeHint === "Next Steps", () =>
            setModeHint("Next Steps")
          )}
          {chip("Red", modeHint === "Red Team", () => setModeHint("Red Team"))}
        </div>

        {/* right side */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {ministryTab}

          {/* ----------------------------------------------------
              NEW MINIMIZE BUTTON (desktop only)
          ---------------------------------------------------- */}
          {!isMobile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMinimized(true);
              }}
              title="Minimize"
              style={{
                borderRadius: 6,
                padding: "4px 8px",
                font: "600 12px system-ui",
                background: "#0e1726",
                border: ui.edge,
                color: ui.sub,
                cursor: "pointer",
              }}
            >
              –
            </button>
          )}

          {isMobile && (
            <button
              type="button"
              onClick={(ev) => {
                ev.stopPropagation();
                setCollapsed(true);
              }}
              title="Collapse Solace"
              style={{
                borderRadius: 999,
                padding: "4px 8px",
                font: "600 11px system-ui",
                border: ui.edge,
                background: "rgba(8,15,26,0.9)",
                color: ui.sub,
              }}
            >
              Hide
            </button>
          )}
        </div>
      </header>

      {/* TRANSCRIPT */}
      <div ref={transcriptRef} style={transcriptStyle} aria-live="polite">
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
                  ? "var(--mc-text)"
                  : "rgba(233,240,250,.94)",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* COMPOSER */}
      <div
        style={composerWrapStyle}
        onPaste={(e) => handlePaste(e, { prefix: "solace" })}
      >
        {pendingFiles.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 8,
              color: ui.text,
              font: "12px system-ui",
            }}
          >
            {pendingFiles.map((f: any, idx: number) => (
              <a
                key={idx}
                href={getAttachmentUrl(f) || "#"}
                target={getAttachmentUrl(f) ? "_blank" : undefined}
                rel={getAttachmentUrl(f) ? "noreferrer" : undefined}
                style={{
                  padding: "4px 8px",
                  borderRadius: 8,
                  border: "1px solid var(--mc-border)",
                  background: "#0e1726",
                  textDecoration: "none",
                  opacity: getAttachmentUrl(f) ? 1 : 0.7,
                  cursor: getAttachmentUrl(f) ? "pointer" : "default",
                }}
                title={f.name}
              >
                📎 {f.name}
              </a>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>("#solace-file-input")
                  ?.click()
              }
              title="Attach files"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid var(--mc-border)",
                background: "#0e1726",
                color: ui.text,
                cursor: "pointer",
              }}
            >
              📎
            </button>
            <input
              id="solace-file-input"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) =>
                handleFiles(e.target.files, { prefix: "solace" })
              }
            />

            <button
              type="button"
              onClick={toggleMic}
              title={listening ? "Stop mic" : "Speak"}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid var(--mc-border)",
                background: listening ? "#244a1f" : "#0e1726",
                color: ui.text,
                cursor: "pointer",
              }}
            >
              {listening ? "■" : "🎤"}
            </button>
          </div>

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

          <button
            onClick={send}
            type="button"
            disabled={streaming || (!input.trim() && pendingFiles.length === 0)}
            style={askBtnStyle}
          >
            {streaming ? "…" : "Ask"}
          </button>
        </div>

        <div
          style={{
            marginTop: 6,
            display: "flex",
            justifyContent: "space-between",
            font: "12px system-ui",
            color: "var(--mc-muted)",
          }}
        >
          <span>
            {ministryOn ? "Create • Ministry overlay" : modeHint || "Neutral"}
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

/* ========= end component ========= */

