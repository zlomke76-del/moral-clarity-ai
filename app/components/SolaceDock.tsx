// app/components/SolaceDock.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import { useSolaceMemory } from "./useSolaceMemory";
import { useSolaceAttachments } from "./useSolaceAttachments";
import { Copy } from "lucide-react";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

type Message = { role: "user"; content: string } | { role: "assistant"; content: string };
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";

const POS_KEY = "solace:pos:v4";
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

function isImage(f: any) {
  if (!f) return false;
  const name = f.name || "";
  const mime = f.mime || f.type || "";
  return mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|heic|bmp)$/i.test(name);
}

function getURL(f: any): string | null {
  if (!f) return null;
  return f.url || f.publicUrl || f.path || null;
}

export default function SolaceDock() {
  /* -------------------------------------------------------------------------- */
  /*  Ensure single mount                                                       */
  /* -------------------------------------------------------------------------- */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__solaceDockMounted) return;
    window.__solaceDockMounted = true;
    setMounted(true);
    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  if (!mounted) return null;

  /* -------------------------------------------------------------------------- */
  /* Store + internal state                                                     */
  /* -------------------------------------------------------------------------- */
  const { visible, x, y, setPos, filters, setFilters } = useSolaceStore();

  const [posReady, setPosReady] = useState(false);

  const [panelW, setPanelW] = useState(0);
  const [panelH, setPanelH] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });

  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ready when you are." },
  ]);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [mobilePill, setMobilePill] = useState(false);

  // NEW stable minimize state
  const [minimized, setMinimized] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------------------------------- */
  /* Memory + Attachments                                                       */
  /* -------------------------------------------------------------------------- */
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();

  const {
    pendingFiles,
    handleFiles,
    handlePaste,
    clearPending,
  } = useSolaceAttachments({
    onInfoMessage: (txt: string) =>
      setMessages((m) => [...m, { role: "assistant", content: txt }]),
  });

  const ministryOn = useMemo(
    () => filters.has("ministry") && filters.has("abrahamic"),
    [filters]
  );

  /* -------------------------------------------------------------------------- */
  /* Autoscroll transcript                                                      */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* -------------------------------------------------------------------------- */
  /* Measure panel                                                              */
  /* -------------------------------------------------------------------------- */
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
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

  /* -------------------------------------------------------------------------- */
  /* Mobile detection                                                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setMobilePill(isMobile);
  }, [isMobile]);

  /* -------------------------------------------------------------------------- */
  /* Restore desktop position                                                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!visible) return;

    if (isMobile) {
      setPosReady(true);
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.x && saved?.y) {
          setPos(
            Math.max(PAD, Math.min(vw - PAD, saved.x)),
            Math.max(PAD, Math.min(vh - PAD, saved.y))
          );
          setPosReady(true);
          return;
        }
      }
    } catch {}

    requestAnimationFrame(() => {
      const w = panelW || Math.min(980, Math.max(560, vw * 0.56));
      const h = panelH || Math.min(820, Math.max(460, vh * 0.62));
      setPos(
        Math.max(PAD, (vw - w) / 2),
        Math.max(PAD, (vh - h) / 2)
      );
      setPosReady(true);
    });
  }, [visible, isMobile, panelW, panelH, setPos]);

  /* -------------------------------------------------------------------------- */
  /* Persist desktop position                                                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!posReady || isMobile) return;
    localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
  }, [x, y, posReady, isMobile]);

  /* -------------------------------------------------------------------------- */
  /* Dragging                                                                   */
  /* -------------------------------------------------------------------------- */
  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (isMobile || minimized) return;
    const rect = panelRef.current?.getBoundingClientRect();
    setOffset({
      dx: e.clientX - (rect?.left || 0),
      dy: e.clientY - (rect?.top || 0),
    });
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const move = (e: MouseEvent) => setPos(e.clientX - offset.dx, e.clientY - offset.dy);
    const up = () => setDragging(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, offset, setPos]);

  /* -------------------------------------------------------------------------- */
  /* Textarea autoresize                                                        */
  /* -------------------------------------------------------------------------- */
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  /* -------------------------------------------------------------------------- */
  /* Ministry default                                                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MINISTRY_KEY);
      if (saved === "0") return;
    } catch {}

    if (!ministryOn) {
      const next = new Set(filters);
      next.add("ministry");
      next.add("abrahamic");
      setFilters(next);
      localStorage.setItem(MINISTRY_KEY, "1");
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Chat                                                                       */
  /* -------------------------------------------------------------------------- */
  async function sendToChat(userMsg: string, nextMsgs: Message[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Last-Mode": modeHint,
        "X-User-Key": userKey,
      },
      body: JSON.stringify({
        messages: nextMsgs,
        filters: [...filters],
        attachments: pendingFiles,
        ministry: filters.has("ministry"),
        stream: false,
        workspace_id: MCA_WORKSPACE_ID,
        user_key: userKey,
        memory_preview: memReady ? memoryCacheRef.current.slice(0, 50) : [],
      }),
    });

    clearPending();

    const data = await res.json();
    const reply = data.text || "[No reply]";
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  async function sendToVision(userMsg: string, nextMsgs: Message[]) {
    const img = pendingFiles.find(isImage);
    const url = getURL(img);
    if (!url) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I see an image, but the link is not usable. Try re-attaching.",
        },
      ]);
      clearPending();
      return;
    }

    const res = await fetch("/api/solace/vision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Key": userKey,
      },
      body: JSON.stringify({
        prompt: userMsg.trim() || "Look at this image and describe it.",
        imageUrl: url,
      }),
    });

    clearPending();

    const data = await res.json();
    const reply = data.answer || "[No reply]";
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  async function send() {
    const text = input.trim();
    const hasFiles = pendingFiles.length > 0;
    const hasImageFile = pendingFiles.some(isImage);
    if (!text && !hasFiles) return;

    setInput("");

    const userMsg = text || "Attachments:";
    const nextUser: Message = { role: "user", content: userMsg };
    const nextMsgs = [...messages, nextUser];

    setMessages(nextMsgs);
    setStreaming(true);

    try {
      if (hasImageFile) await sendToVision(userMsg, nextMsgs);
      else await sendToChat(userMsg, nextMsgs);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${err?.message || "Error"}` },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Code blocks w/ copy                                                        */
  /* -------------------------------------------------------------------------- */
  function renderMessage(content: string) {
    if (!content.includes("```")) {
      return content.split("\n").map((line, i) => (
        <div key={i} style={{ whiteSpace: "pre-wrap" }}>
          {line}
        </div>
      ));
    }

    const parts = content.split("```");
    return parts.map((p, i) => {
      const isCode = i % 2 === 1;
      if (!isCode) {
        return (
          <div key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 4 }}>
            {p}
          </div>
        );
      }
      return (
        <div
          key={i}
          style={{
            background: "#0d1117",
            border: "1px solid #223048",
            borderRadius: 8,
            padding: "10px",
            marginBottom: 8,
            position: "relative",
          }}
        >
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre",
              overflowX: "auto",
              color: "#e2e8f0",
              fontSize: 13,
            }}
          >
            {p}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(p)}
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              background: "#1a2332",
              border: "1px solid #334155",
              borderRadius: 6,
              padding: "3px 6px",
              cursor: "pointer",
              fontSize: 11,
              color: "#cbd5e1",
            }}
          >
            <Copy size={12} />
          </button>
        </div>
      );
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Stable, single-path UI selection (no early returns)                        */
  /* -------------------------------------------------------------------------- */
  let uiNode: React.ReactNode = null;

  if (isMobile && mobilePill) {
    // Mobile pill mode
    uiNode = (
      <button
        type="button"
        onClick={() => setMobilePill(false)}
        style={{
          position: "fixed",
          bottom: 20,
          left: 16,
          right: 16,
          padding: "12px 18px",
          borderRadius: 9999,
          background: "rgba(6,12,20,0.95)",
          border: ui.border,
          boxShadow: ui.shadow,
          color: ui.text,
          backdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 60,
        }}
      >
        <span style={{ font: "600 14px system-ui" }}>Solace</span>
        <span style={{ color: ui.sub, fontSize: 12 }}>Tap to open</span>
      </button>
    );
  } else if (!isMobile && minimized) {
    // Desktop minimized bubble M1
    uiNode = (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 35%, #f6c453, #d79a32)",
          boxShadow:
            "0 4px 14px rgba(0,0,0,0.45), 0 0 22px rgba(251,191,36,.45)",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#000",
          font: "600 14px system-ui",
          cursor: "pointer",
          zIndex: 60,
        }}
      >
        S
      </button>
    );
  } else if (isMobile && !mobilePill) {
    // Mobile full-sheet
    uiNode = (
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: "70vh",
          maxHeight: "80vh",
          background: ui.panelBg,
          borderRadius: "20px 20px 0 0",
          border: ui.border,
          boxShadow: ui.shadow,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backdropFilter: "blur(8px)",
          zIndex: 60,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header
          style={{
            padding: "10px 14px",
            borderBottom: ui.edge,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: ui.text,
          }}
        >
          <span style={{ font: "600 14px system-ui" }}>Solace</span>
          <button
            style={{
              borderRadius: 8,
              padding: "6px 10px",
              background: "#0e1726",
              color: ui.sub,
              border: ui.edge,
            }}
            onClick={() => setMobilePill(true)}
          >
            Hide
          </button>
        </header>

        {/* MESSAGES */}
        <div
          ref={transcriptRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 16px",
            color: ui.text,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                margin: "6px 0",
                borderRadius: 12,
                background:
                  m.role === "user"
                    ? "rgba(39,52,74,.6)"
                    : "rgba(28,38,54,.6)",
                color:
                  m.role === "user"
                    ? "var(--mc-text)"
                    : "#e9f0fa",
              }}
            >
              {renderMessage(m.content)}
            </div>
          ))}
        </div>

        {/* COMPOSER */}
        <MobileComposer
          input={input}
          setInput={setInput}
          send={send}
          pendingFiles={pendingFiles}
          handleFiles={handleFiles}
          handlePaste={handlePaste}
          ui={ui}
          streaming={streaming}
          listening={listening}
          setListening={setListening}
          recogRef={recogRef}
        />
      </div>
    );
  } else {
    // Desktop full panel
    const vx = window.innerWidth;
    const vy = window.innerHeight;
    const maxX = Math.max(0, vx - panelW - PAD);
    const maxY = Math.max(0, vy - panelH - PAD);
    const px = Math.min(Math.max(0, x - PAD), maxX);
    const py = Math.min(Math.max(0, y - PAD), maxY);

    uiNode = (
      <div
        ref={panelRef}
        style={{
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
          transform: `translate(${px}px, ${py}px)`,
          opacity: posReady ? 1 : 0,
          pointerEvents: posReady ? "auto" : "none",
          transition: "opacity 120ms ease",
          resize: "both",
          zIndex: 60,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderBottom: ui.edge,
            cursor: "move",
            color: ui.text,
          }}
          onMouseDown={onHeaderMouseDown}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              aria-hidden
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 50% 35%, #f6c453, #d79a32)",
                boxShadow: "0 0 38px rgba(251,191,36,.55)",
              }}
            />
            <span style={{ font: "600 14px system-ui" }}>Solace</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
            {["Create", "Next Steps", "Red Team"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModeHint(m as ModeHint)}
                style={{
                  borderRadius: 8,
                  padding: "6px 10px",
                  background:
                    modeHint === m ? "var(--mc-text)" : "#0e1726",
                  color:
                    modeHint === m ? "#000" : "var(--mc-text)",
                  border: `1px solid var(--mc-border)`,
                  cursor: "pointer",
                  font: "600 12px system-ui",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                if (ministryOn) {
                  const next = [...filters].filter(
                    (f) => f !== "ministry" && f !== "abrahamic"
                  );
                  setFilters(next);
                  localStorage.setItem(MINISTRY_KEY, "0");
                } else {
                  const next = new Set(filters);
                  next.add("ministry");
                  next.add("abrahamic");
                  setFilters(next);
                  localStorage.setItem(MINISTRY_KEY, "1");
                }
              }}
              style={{
                borderRadius: 8,
                padding: "6px 10px",
                background: ministryOn ? "#f6c453" : "#0e1726",
                color: ministryOn ? "#000" : ui.text,
                border: ministryOn
                  ? "1px solid #f4cf72"
                  : ui.border,
                boxShadow: ministryOn
                  ? "0 0 22px rgba(251,191,36,.65)"
                  : "none",
                font: "700 12px system-ui",
                cursor: "pointer",
              }}
            >
              Ministry
            </button>

            <button
              type="button"
              onClick={() => setMinimized(true)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#0e1726",
                border: ui.edge,
                color: ui.sub,
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              –
            </button>
          </div>
        </header>

        {/* MESSAGES */}
        <div
          ref={transcriptRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 16px",
            color: ui.text,
            background:
              "linear-gradient(180deg, rgba(12,19,30,.9), rgba(10,17,28,.92))",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                margin: "6px 0",
                borderRadius: 12,
                background:
                  m.role === "user"
                    ? "rgba(39,52,74,.6)"
                    : "rgba(28,38,54,.6)",
              }}
            >
              {renderMessage(m.content)}
            </div>
          ))}
        </div>

        {/* COMPOSER */}
        <DesktopComposer
          input={input}
          setInput={setInput}
          send={send}
          pendingFiles={pendingFiles}
          handleFiles={handleFiles}
          handlePaste={handlePaste}
          ui={ui}
          streaming={streaming}
          listening={listening}
          setListening={setListening}
          recogRef={recogRef}
          memReady={memReady}
          modeHint={modeHint}
          filters={filters}
          ministryOn={ministryOn}
        />
      </div>
    );
  }

  return createPortal(uiNode, document.body);
}

/* -------------------------------------------------------------------------- */
/*  Desktop Composer                                                           */
/* -------------------------------------------------------------------------- */
function DesktopComposer({
  input,
  setInput,
  send,
  pendingFiles,
  handleFiles,
  handlePaste,
  ui,
  streaming,
  listening,
  setListening,
  recogRef,
  memReady,
  modeHint,
  filters,
  ministryOn,
}: any) {
  return (
    <div
      style={{
        padding: 12,
        borderTop: ui.edge,
        background: ui.surface2,
      }}
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
          {pendingFiles.map((f: any, i: number) => (
            <a
              key={i}
              href={getURL(f) || "#"}
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

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() =>
            document.querySelector<HTMLInputElement>("#solace-file-input")?.click()
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
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
        />

        <button
          type="button"
          onClick={() => toggleMic(listening, setListening, recogRef, setInput)}
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

        <textarea
          ref={React.useRef(null)}
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
            flex: 1,
            minHeight: 60,
            maxHeight: 240,
            overflowY: "auto",
            borderRadius: 12,
            border: "1px solid var(--mc-border)",
            background: "#0e1726",
            color: ui.text,
            padding: "10px 12px",
            resize: "none",
            outline: "none",
            font: "14px system-ui",
          }}
        />

        <button
          type="button"
          disabled={streaming || (!input.trim() && pendingFiles.length === 0)}
          onClick={send}
          style={{
            width: 80,
            height: 40,
            borderRadius: 12,
            background: "#6e8aff",
            color: "#fff",
            font: "600 13px system-ui",
            border: "none",
            cursor:
              streaming || (!input.trim() && pendingFiles.length === 0)
                ? "not-allowed"
                : "pointer",
            opacity:
              streaming || (!input.trim() && pendingFiles.length === 0) ? 0.55 : 1,
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
          color: ui.sub,
        }}
      >
        <span>{ministryOn ? "Create • Ministry overlay" : modeHint}</span>
        {filters.size > 0 && (
          <span
            style={{
              maxWidth: "60%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Filters: {[...filters].join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile Composer                                                            */
/* -------------------------------------------------------------------------- */
function MobileComposer({
  input,
  setInput,
  send,
  pendingFiles,
  handleFiles,
  handlePaste,
  ui,
  streaming,
  listening,
  setListening,
  recogRef,
}: any) {
  return (
    <div
      style={{
        borderTop: ui.edge,
        background: ui.surface2,
        padding: 12,
      }}
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
          {pendingFiles.map((f: any, i: number) => (
            <a
              key={i}
              href={getURL(f) || "#"}
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

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() =>
            document.querySelector<HTMLInputElement>("#solace-file-input-mobile")?.click()
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
          id="solace-file-input-mobile"
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files, { prefix: "solace" })}
        />

        <button
          type="button"
          onClick={() => toggleMic(listening, setListening, recogRef, setInput)}
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

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          style={{
            flex: 1,
            minHeight: 60,
            maxHeight: 240,
            overflowY: "auto",
            borderRadius: 12,
            border: "1px solid var(--mc-border)",
            background: "#0e1726",
            color: ui.text,
            padding: "10px 12px",
            resize: "none",
            outline: "none",
            font: "14px system-ui",
          }}
        />

        <button
          type="button"
          disabled={streaming || (!input.trim() && pendingFiles.length === 0)}
          onClick={send}
          style={{
            width: 80,
            height: 40,
            borderRadius: 12,
            background: "#6e8aff",
            color: "#fff",
            font: "600 13px system-ui",
            border: "none",
            cursor:
              streaming || (!input.trim() && pendingFiles.length === 0)
                ? "not-allowed"
                : "pointer",
            opacity:
              streaming || (!input.trim() && pendingFiles.length === 0)
                ? 0.55
                : 1,
          }}
        >
          {streaming ? "…" : "Ask"}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mic toggle                                                                 */
/* -------------------------------------------------------------------------- */
function toggleMic(
  listening: boolean,
  setListening: any,
  recogRef: any,
  setInput: any
) {
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  if (!SR) return;

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
    const text = Array.from(e.results)
      .map((r: any) => r[0].transcript)
      .join(" ");
    setInput((prev: string) => (prev ? prev + " " : "") + text);
  };

  sr.onerror = () => setListening(false);
  sr.onend = () => setListening(false);

  recogRef.current = sr;
  sr.start();
  setListening(true);
}

