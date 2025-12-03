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

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Message = { role: "user" | "assistant"; content: string };
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";

const POS_KEY = "solace:pos:v3";
const MINISTRY_KEY = "solace:ministry";
const PAD = 12;

/* -------------------------------------------------------------------------- */
/*  Utility / UI tokens                                                       */
/* -------------------------------------------------------------------------- */

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
  if (mime && mime.startsWith("image/")) return true;
  const name = f.name || "";
  return /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(name);
}

function getAttachmentUrl(f: any): string | null {
  if (!f) return null;
  if (typeof f.url === "string") return f.url;
  if (typeof f.publicUrl === "string") return f.publicUrl;
  if (typeof f.path === "string") return f.path;
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function SolaceDock() {
  /* ---------------------------------------------------------------------- */
  /*  Ensure single mount                                                   */
  /* ---------------------------------------------------------------------- */
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

  if (!canRender) return null;

  /* ---------------------------------------------------------------------- */
  /*  Store + state                                                         */
  /* ---------------------------------------------------------------------- */

  const { visible, x, y, setPos, filters, setFilters } = useSolaceStore();

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
  const [collapsedMobile, setCollapsedMobile] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);

  // NEW: Panel minimize state (for desktop)
  const [minimized, setMinimized] = useState(false);

  /* ---------------------------------------------------------------------- */
  /*  Memory hook                                                           */
  /* ---------------------------------------------------------------------- */
  const { userKey, memReady, memoryCacheRef } = useSolaceMemory();

  /* ---------------------------------------------------------------------- */
  /*  Attachments hook                                                      */
  /* ---------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------- */
  /*  Autoscroll transcript                                                 */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ---------------------------------------------------------------------- */
  /*  Measure / clamp panel                                                 */
  /* ---------------------------------------------------------------------- */
  const containerRef = useRef<HTMLDivElement>(null);

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

  /* ---------------------------------------------------------------------- */
  /*  Detect mobile                                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setCollapsedMobile(isMobile);
  }, [isMobile]);

  /* ---------------------------------------------------------------------- */
  /*  Restore desktop position                                              */
  /* ---------------------------------------------------------------------- */
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
        if (saved && saved.x && saved.y) {
          const sx = Math.max(PAD, Math.min(vw - PAD, saved.x));
          const sy = Math.max(PAD, Math.min(vh - PAD, saved.y));
          setPos(sx, sy);
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

  /* ---------------------------------------------------------------------- */
  /*  Persist desktop position                                              */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!posReady || isMobile) return;
    localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
  }, [x, y, posReady, isMobile]);

  /* ---------------------------------------------------------------------- */
  /*  Drag                                                                  */
  /* ---------------------------------------------------------------------- */
  function onHeaderMouseDown(e: React.MouseEvent) {
    if (isMobile || minimized) return;
    const rect = containerRef.current?.getBoundingClientRect();
    setOffset({
      dx: e.clientX - (rect?.left || 0),
      dy: e.clientY - (rect?.top || 0),
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

  /* ---------------------------------------------------------------------- */
  /*  Textarea autoresize                                                   */
  /* ---------------------------------------------------------------------- */
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  /* ---------------------------------------------------------------------- */
  /*  Default Ministry Mode                                                 */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MINISTRY_KEY);
      if (saved === "0") return;
    } catch {}

    if (!ministryOn) {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
      localStorage.setItem(MINISTRY_KEY, "1");
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /*  Chat send                                                             */
  /* ---------------------------------------------------------------------- */
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
        stream: false,
        attachments: pendingFiles,
        ministry: filters.has("ministry"),
        workspace_id: MCA_WORKSPACE_ID,
        user_key: userKey,
        memory_preview: memReady
          ? memoryCacheRef.current.slice(0, 50)
          : [],
      }),
    });

    clearPending();

    const data = await res.json();
    const reply = data.text || "[No reply]";
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  }

  async function sendToVision(userMsg: string, nextMsgs: Message[]) {
    const img = pendingFiles.find(isImageAttachment);
    const imageUrl = getAttachmentUrl(img);
    if (!imageUrl) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I see an image attachment, but no usable link. Try re-attaching.",
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
        prompt:
          userMsg.trim() ||
          "Look at this image and describe what you see.",
        imageUrl,
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
    const hasImage = pendingFiles.some(isImageAttachment);
    if (!text && !hasFiles) return;

    setInput("");
    const userMsg = text || (hasFiles ? "Attachments:" : "");
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
        {
          role: "assistant",
          content: `⚠️ ${e?.message ?? "Error"}`,
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  Minimize toggle                                                       */
  /* ---------------------------------------------------------------------- */
  const toggleMinimize = () => {
    setMinimized((m) => !m);
  };

  /* ---------------------------------------------------------------------- */
  /*  Render code blocks with copy                                          */
  /* ---------------------------------------------------------------------- */
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
          <div
            key={i}
            style={{ whiteSpace: "pre-wrap", marginBottom: 4 }}
          >
            {p}
          </div>
        );
      }
      return (
        <div
          key={i}
          style={{
            background: "#0d1117",
            border: "1px solid #222f47",
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

  /* ---------------------------------------------------------------------- */
  /*  Mobile → pill                                                         */
  /* ---------------------------------------------------------------------- */

  if (isMobile && collapsedMobile) {
    return createPortal(
      <button
        type="button"
        onClick={() => setCollapsedMobile(false)}
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
      </button>,
      document.body
    );
  }

  /* ---------------------------------------------------------------------- */
  /*  Desktop → minimized M1                                                */
  /* ---------------------------------------------------------------------- */

  if (!isMobile && minimized) {
    return createPortal(
      <button
        type="button"
        onClick={toggleMinimize}
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
      </button>,
      document.body
    );
  }

  /* ---------------------------------------------------------------------- */
  /*  Desktop → full panel                                                  */
  /* ---------------------------------------------------------------------- */

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);
  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);
  const invisible = !posReady;

  const panelStyle: React.CSSProperties = {
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

  /* ---------------------------------------------------------------------- */
  /*  Final render: desktop panel                                           */
  /* ---------------------------------------------------------------------- */

  return createPortal(
    <section ref={containerRef} style={panelStyle}>
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          borderBottom: ui.edge,
          cursor: "move",
          userSelect: "none",
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
                "radial-gradient(62% 62% at 50% 42%, #f6c453 0%, #e4a736 38%, #bb862c 72%, #a86f1f 100%)",
              boxShadow: "0 0 38px rgba(251,191,36,.55)",
            }}
          />
          <span style={{ font: "600 14px system-ui" }}>Solace</span>
        </div>

        {/* Mode chips */}
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

        {/* Right side */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          {/* Ministry */}
          <button
            onClick={() => {
              if (ministryOn) {
                const next = [...filters].filter(
                  (f) => f !== "abrahamic" && f !== "ministry"
                );
                setFilters(next);
                localStorage.setItem(MINISTRY_KEY, "0");
              } else {
                const next = new Set(filters);
                next.add("abrahamic");
                next.add("ministry");
                setFilters(next);
                localStorage.setItem(MINISTRY_KEY, "1");
              }
            }}
            type="button"
            style={{
              borderRadius: 8,
              padding: "6px 10px",
              background: ministryOn ? "#f6c453" : "#0e1726",
              color: ministryOn ? "#000" : "var(--mc-text)",
              border: `1px solid ${
                ministryOn ? "#f4cf72" : "var(--mc-border)"
              }`,
              boxShadow: ministryOn
                ? "0 0 22px rgba(251,191,36,.65)"
                : "none",
              cursor: "pointer",
              font: "700 12px system-ui",
            }}
          >
            Ministry
          </button>

          {/* Minimize */}
          <button
            onClick={toggleMinimize}
            type="button"
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

      {/* TRANSCRIPT */}
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
              color:
                m.role === "user"
                  ? "var(--mc-text)"
                  : "#e9f0fa",
            }}
          >
            {renderMessage(m.content)}
          </div>
        ))}

        {streaming && (
          <div style={{ color: ui.sub, marginTop: 8 }}>
            Solace is typing…
          </div>
        )}
      </div>

      {/* COMPOSER */}
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

        <div style={{ display: "flex", gap: 8 }}>
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

          {/* Mic */}
          <button
            type="button"
            onClick={() => {
              const SR =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;
              if (!SR) {
                setMessages((m) => [
                  ...m,
                  {
                    role: "assistant",
                    content:
                      "🎤 Microphone is not supported in this browser.",
                  },
                ]);
                return;
              }
              if (listening) {
                recogRef.current?.stop();
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
            }}
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

          {/* Input */}
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

          {/* Send */}
          <button
            type="button"
            onClick={send}
            disabled={streaming || (!input.trim() && pendingFiles.length === 0)}
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
            {ministryOn ? "Create • Ministry overlay" : modeHint}
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
              Filters: {[...filters].join(", ")}
            </span>
          )}
        </div>
      </div>
    </section>,
    document.body
  );
}

