// app/components/SolaceDock.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { generateImage } from "@/lib/sendImage";
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

export default function SolaceDock() {
  // SINGLE MOUNT
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

  // STATE
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ready when you are." },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");
  const [imgLoading, setImgLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [panelW, setPanelW] = useState(0);
  const [panelH, setPanelH] = useState(0);
  const [posReady, setPosReady] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const recogRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // MEMORY
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();

  // ATTACHMENTS
  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: (content: string) =>
      setMessages((m) => [...m, { role: "assistant", content }]),
  });

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  // AUTO-SCROLL
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // MEASURE PANEL
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

  // MOBILE CHECK
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

  // RESTORE DESKTOP POSITION
  useEffect(() => {
    if (!canRender || !visible) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (isMobile) {
      setPosReady(true);
      return;
    }

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Number.isFinite(s.x) && Number.isFinite(s.y)) {
          setPos(
            Math.max(PAD, Math.min(vw - PAD - 400, s.x)),
            Math.max(PAD, Math.min(vh - PAD - 300, s.y))
          );
          setPosReady(true);
          return;
        }
      }
    } catch {}

    setPos(Math.round((vw - 720) / 2), Math.round((vh - 520) / 2));
    setPosReady(true);
  }, [canRender, visible, isMobile, setPos]);

  useEffect(() => {
    if (!posReady || isMobile) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile]);

  // DRAGGING
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
    const move = (e: MouseEvent) =>
      setPos(e.clientX - offset.dx, e.clientY - offset.dy);
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, offset, setPos]);

  // AUTOSIZE TEXTAREA
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  // DEFAULT MINISTRY ON
  useEffect(() => {
    try {
      if (localStorage.getItem(MINISTRY_KEY) === "0") return;
    } catch {}

    const next = new Set(filters);
    next.add("abrahamic");
    next.add("ministry");
    setFilters(next);
    try {
      localStorage.setItem(MINISTRY_KEY, "1");
    } catch {}
  }, []);

  // SEND
  async function send() {
    const text = input.trim();
    if (!text && pendingFiles.length === 0) return;
    if (streaming) return;

    setInput("");
    const userMsg = text || "Attachments:";
    const nextUser: Message = { role: "user", content: userMsg };
    const nextMsgs = [...messages, nextUser];
    setMessages(nextMsgs);
    setStreaming(true);

    const activeFilters = Array.from(filters);

    try {
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
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${e?.message ?? "Error"}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  // IMAGE
  async function generateImageFromInput() {
    const text = input.trim();
    if (!text || imgLoading) return;

    setImgLoading(true);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);

    try {
      const url = await generateImage(text);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `🎨 Generated image:\n${url}` },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ Image error: ${e.message}` },
      ]);
    } finally {
      setImgLoading(false);
    }
  }

  // MINISTRY TOGGLE
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

  // MIC
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

  // POSITIONING (DESKTOP)
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);
  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);
  const invisible = !posReady;

  // PANEL STYLE (FIXED VERSION)
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "70vh",
        maxHeight: "80vh",
        width: "100%",
        borderRadius: "20px 20px 0 0",
        background: ui.panelBg,
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

        // *** FIXED POSITIONING (NO LEFT/TOP) ***
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
    border: `1px solid ${borderColor}`,
    background: "#0e1726",
    color: ui.text,
    borderRadius: 12,
    padding: "10px 12px",
    resize: "none",
    outline: "none",
    font:
      "14px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    overflow: "auto",
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

  const imageBtnStyle: React.CSSProperties = {
    minWidth: 80,
    height: 40,
    borderRadius: 12,
    border: "0",
    background: "#374151",
    color: "#e5e7eb",
    font:
      "600 13px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    cursor: imgLoading || !input.trim() ? "not-allowed" : "pointer",
    opacity: imgLoading || !input.trim() ? 0.55 : 1,
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
      type="button"
    >
      {label}
    </button>
  );

  const ministryTab = (
    <button
      onClick={toggleMinistry}
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

  // MOBILE PILL
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
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={orbStyle} />
          <span style={{ font: "600 13px system-ui" }}>Solace</span>
        </span>
        <span style={{ font: "12px system-ui", color: ui.sub }}>
          Tap to open
        </span>
      </button>,
      document.body
    );
  }

  // FULL PANEL UI
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={orbStyle} />
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

        <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
          {chip("Create", modeHint === "Create", () => setModeHint("Create"))}
          {chip(
            "Next",
            modeHint === "Next Steps",
            () => setModeHint("Next Steps")
          )}
          {chip("Red", modeHint === "Red Team", () => setModeHint("Red Team"))}
        </div>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {ministryTab}
          {isMobile && (
            <button
              type="button"
              onClick={(ev) => {
                ev.stopPropagation();
                setCollapsed(true);
              }}
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
            {pendingFiles.map((f, idx) => (
              <a
                key={idx}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "4px 8px",
                  borderRadius: 8,
                  border: "1px solid var(--mc-border)",
                  background: "#0e1726",
                  textDecoration: "none",
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
                (document.querySelector<HTMLInputElement>(
                  "#solace-file-input"
                )?.click())
              }
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
              className="hidden"
              onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
            />

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
            type="button"
            onClick={generateImageFromInput}
            disabled={imgLoading || !input.trim()}
            style={imageBtnStyle}
          >
            {imgLoading ? "…" : "Image"}
          </button>

          <button
            type="button"
            onClick={send}
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
