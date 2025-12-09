"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";

import { UI } from "./dock-ui";
import { Skins } from "./dock-skins";
import SolaceDockHeader from "./dock-header";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

type Message = { role: "user" | "assistant"; content: string };
type ModeHint = "Create" | "Red Team" | "Next Steps" | "Neutral";

const POS_KEY = "solace:pos:v4";
const MINISTRY_KEY = "solace:ministry";
const FOUNDER_KEY = "solace:founder";
const PAD = 12;

/* ---------------------------------------------------------
   Attachments helpers
--------------------------------------------------------- */
function isImageAttachment(f: any): boolean {
  if (!f) return false;
  const mime = f.mime || f.type || "";
  if (mime.startsWith("image/")) return true;
  const name = f.name || "";
  return /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(name);
}
function getAttachmentUrl(f: any): string | null {
  if (!f) return null;
  return f.url || f.publicUrl || f.path || null;
}

/* ---------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */
export default function SolaceDock() {
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

  // Store
  const {
    visible,
    setVisible,
    x,
    y,
    setPos,
    filters,
    setFilters,
    founderMode,
    setFounderMode,
    modeHint,
    setModeHint,
  } = useSolaceStore();

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

  const [minimized, setMinimized] = useState(false);

  /* ---------------------------------------------------------
     Local state
  --------------------------------------------------------- */
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [posReady, setPosReady] = useState(false);

  const [panelH, setPanelH] = useState(0);
  const [panelW, setPanelW] = useState(0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  const [collapsed] = useState(false);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const { userKey, memReady } = useSolaceMemory();

  const appendInfo = (content: string) =>
    setMessages((m) => [...m, { role: "assistant", content }]);

  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({ onInfoMessage: appendInfo });

  /* ---------------------- Ministry Mode --------------------- */
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

  /* ---------------------- Founder Mode ---------------------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FOUNDER_KEY);
      if (saved === "1") setFounderMode(true);
    } catch {}
  }, []);

  /* ---------------------- Welcome message ------------------- */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: "Ready when you are." }]);
    }
  }, [messages.length]);

  /* ---------------------------------------------------------
     Position + drag handling
  --------------------------------------------------------- */
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      const w = panelW || 760;
      const h = panelH || 560;
      const startX = Math.max(PAD, Math.round((vw - w) / 2));
      const startY = Math.max(PAD, Math.round((vh - h) / 2));
      setPos(startX, startY);
      setPosReady(true);
    });
  }, [canRender, visible, panelW, panelH, setPos]);

  useEffect(() => {
    if (!posReady || isMobile) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady, isMobile]);

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

  /* ---------------------------------------------------------
     Autosize textarea
  --------------------------------------------------------- */
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  /* ---------------------------------------------------------
     BACKEND CALL — corrected for no duplication
  --------------------------------------------------------- */
  async function sendToChat(userMsg: string, prevHistory: Message[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMsg,
        history: prevHistory,
        workspaceId: MCA_WORKSPACE_ID,
        ministryMode: ministryOn,
        modeHint,
        founderMode,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${t}`);
    }

    const data = await res.json();
    return data.text ?? "[No reply]";
  }

  async function sendToVision(userMsg: string, prevHistory: Message[]) {
    const imageAttachment = pendingFiles.find(isImageAttachment);
    const imageUrl = getAttachmentUrl(imageAttachment);

    if (!imageUrl) {
      appendInfo("I see an image attachment, but I don’t have a usable link.");
      clearPending();
      return "[No reply]";
    }

    const prompt =
      userMsg.trim() ||
      "Look at this image and describe what you see, then offer grounded help.";

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
    return data.answer ?? "[No reply]";
  }

  /* ---------------------------------------------------------
     SEND — FIXED ORDER (user first, reply after)
  --------------------------------------------------------- */
  async function send() {
    const text = input.trim();
    const hasAttachments = pendingFiles.length > 0;
    const hasImage = pendingFiles.some(isImageAttachment);

    if (!text && !hasAttachments) return;
    if (streaming) return;

    const userMsg = text || (hasAttachments ? "Attachments:" : "");
    setInput("");
    setStreaming(true);

    // ⭐ Show user message immediately
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    try {
      const historyForBackend = [
        ...messages,
        { role: "user", content: userMsg },
      ];

      let reply;

      if (hasImage) {
        reply = await sendToVision(userMsg, historyForBackend);
      } else {
        reply = await sendToChat(userMsg, historyForBackend);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err: any) {
      appendInfo(`⚠️ ${err?.message || "Error"}`);
    } finally {
      setStreaming(false);
    }
  }

  /* ---------------------------------------------------------
     MODE toggles
  --------------------------------------------------------- */
  function toggleMinistry() {
    if (ministryOn) {
      const next = new Set(filters);
      next.delete("abrahamic");
      next.delete("ministry");
      setFilters(next);
      localStorage.setItem(MINISTRY_KEY, "0");
    } else {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
      localStorage.setItem(MINISTRY_KEY, "1");
    }
  }

  function toggleFounder() {
    const updated = !founderMode;
    setFounderMode(updated);
    localStorage.setItem(FOUNDER_KEY, updated ? "1" : "0");
  }

  /* ---------------------------------------------------------
     Microphone
  --------------------------------------------------------- */
  function toggleMic() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      appendInfo("🎤 Microphone not supported in this browser.");
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

  /* ---------------------------------------------------------
     RENDERING
  --------------------------------------------------------- */
  if (!canRender || !visible) return null;

  /* ---------------- Minimized bubble ---------------- */
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

  /* ---------------- Clamp panel position ---------------- */
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);
  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);
  const invisible = !posReady;

  /* ---------------- Active skin (default always for A) ---------------- */
  const skin = Skins.default;

  /* ---------------- Panel styles ---------------- */
  const panelStyle: React.CSSProperties = {
    position: "fixed",
    left: PAD,
    top: PAD,
    width: "clamp(560px, 56vw, 980px)",
    height: "clamp(460px, 62vh, 820px)",
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

  const composerWrapStyle: React.CSSProperties = {
    borderTop: UI.edge,
    background: UI.surface2,
    padding: 10,
  };

  /* ---------------- Render Panel ---------------- */
  const panel = (
    <section ref={containerRef} style={panelStyle}>
      <SolaceDockHeader
        ministryOn={ministryOn}
        founderMode={founderMode}
        modeHint={modeHint}
        memReady={memReady}
        onToggleMinistry={toggleMinistry}
        onToggleFounder={toggleFounder}
        onMinimize={() => setMinimized(true)}
        setModeHint={setModeHint}
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
                  borderRadius: 8,
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
          {/* File + Mic */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>("#solace-file-input")
                  ?.click()
              }
              title="Attach files"
              style={{
                width: 40,
                height: 40,
                borderRadius: UI.radiusLg,
                border: UI.border,
                background: "#0e1726",
                color: UI.text,
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
              onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
            />

            <button
              onClick={toggleMic}
              style={{
                width: 40,
                height: 40,
                borderRadius: UI.radiusLg,
                border: UI.border,
                background: listening ? "#244a1f" : "#0e1726",
                color: UI.text,
                cursor: "pointer",
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
            style={{
              flex: "1 1 auto",
              minHeight: 60,
              maxHeight: 240,
              borderRadius: UI.radiusLg,
              border: UI.border,
              background: "#0e1726",
              color: UI.text,
              padding: "10px 12px",
              resize: "none",
            }}
          />

          {/* Ask Button */}
          <button
            onClick={send}
            disabled={streaming || (!input.trim() && pendingFiles.length === 0)}
            style={{
              minWidth: 80,
              height: 40,
              borderRadius: UI.radiusLg,
              background: "#6e8aff",
              color: "#fff",
              font: "600 13px system-ui",
              opacity:
                streaming || (!input.trim() && pendingFiles.length === 0)
                  ? 0.55
                  : 1,
            }}
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
            color: UI.sub,
          }}
        >
          <span>
            {founderMode ? "Founder • " : ""}
            {ministryOn ? "Ministry • " : ""}
            {modeHint}
          </span>
        </div>
      </div>
    </section>
  );

  return createPortal(panel, document.body);
}

