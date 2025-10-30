// app/components/SolaceDock.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import supabase from "@/lib/supabaseClient";
import { useSolaceStore } from "@/app/providers/solace-store";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

type Message = { role: "user" | "assistant"; content: string };
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";
type Attachment = { name: string; url: string; type: string };

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

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

export default function SolaceDock() {
  // ensure single mount
  const [canRender, setCanRender] = useState(false);
  useEffect(() => {
    if (window.__solaceDockMounted) return;
    window.__solaceDockMounted = true;
    setCanRender(true);
    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  const { visible, x, y, setPos, filters, setFilters } = useSolaceStore();

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

  // attachments
  const [pendingFiles, setPendingFiles] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // speech
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  // transcript auto-scroll
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  // seed welcome once
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

  // restore position or center
  useEffect(() => {
    if (!canRender || !visible) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

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

  // persist position
  useEffect(() => {
    if (!posReady) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {}
  }, [x, y, posReady]);

  // dragging
  function onHeaderMouseDown(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    setOffset({
      dx: e.clientX - (rect?.left ?? 0),
      dy: e.clientY - (rect?.top ?? 0),
    });
    setDragging(true);
  }
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => setPos(e.clientX - offset.dx, e.clientY - offset.dy);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, offset, setPos]);

  // autoresize textarea
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(220, ta.scrollHeight) + "px";
  }, [input]);

  // default ministry ON (with persist), unless explicitly turned off before
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MINISTRY_KEY);
      if (saved === "0") return; // user previously turned it off
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
  }, []); // run once

  // ---------- actions -------------------------------------------------

  async function send() {
    const text = input.trim();
    if (!text && pendingFiles.length === 0) return;
    if (streaming) return;

    setInput("");
    const userMsg = text || (pendingFiles.length ? "Attachments:" : "");
    const next: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(next);
    setStreaming(true);

    const activeFilters: string[] = Array.from(filters);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Last-Mode": modeHint,
        },
        body: JSON.stringify({
          messages: next,
          filters: activeFilters,
          stream: false,
          attachments: pendingFiles, // pass to backend (your /api/chat we updated)
          ministry: activeFilters.includes("ministry"),
        }),
      });

      setPendingFiles([]);

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${t}`);
      }
      const data = await res.json();
      const reply = String(data.text ?? "[No reply]");
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${e?.message ?? "Error"}` }]);
    } finally {
      setStreaming(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const out: Attachment[] = [];
    for (const f of Array.from(files)) {
      try {
        const path = `${crypto.randomUUID()}_${encodeURIComponent(f.name)}`;
        const { error } = await supabase.storage.from("uploads").upload(path, f, {
          upsert: false,
          cacheControl: "3600",
        });
        if (error) throw error;
        const { data } = supabase.storage.from("uploads").getPublicUrl(path);
        out.push({ name: f.name, url: data.publicUrl, type: f.type || "application/octet-stream" });
      } catch (err: any) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: `⚠️ Upload failed for ${f.name}: ${err.message || err}` },
        ]);
      }
    }
    if (out.length) {
      setPendingFiles((prev) => [...prev, ...out]);
      // show a small preview note
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Attached ${out.length} file${out.length > 1 ? "s" : ""}. They will be included in your next message.`,
        },
      ]);
    }
  }

  function toggleMinistry() {
    if (ministryOn) {
      const next = Array.from(filters).filter((f) => f !== "abrahamic" && f !== "ministry");
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
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "🎤 Microphone is not supported in this browser." },
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
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      setInput((prev) => (prev ? prev + " " : "") + t);
    };
    sr.onend = () => setListening(false);
    sr.onerror = () => setListening(false);
    recogRef.current = sr;
    sr.start();
    setListening(true);
  }

  if (!canRender || !visible) return null;

  // clamp within viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(0, vw - panelW - PAD);
  const maxY = Math.max(0, vh - panelH - PAD);
  const tx = Math.min(Math.max(0, x - PAD), maxX);
  const ty = Math.min(Math.max(0, y - PAD), maxY);
  const invisible = !posReady;

  // ---------- styles --------------------------------------------------
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
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderBottom: ui.edge,
    cursor: "move",
    userSelect: "none",
    background: "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.00))",
    color: ui.text,
  };

  const transcriptStyle: React.CSSProperties = {
    flex: "1 1 auto",
    overflow: "auto",
    padding: "14px 16px 10px 16px",
    color: ui.text,
    background: "linear-gradient(180deg, rgba(12,19,30,.9), rgba(10,17,28,.92))",
  };

  const composerWrapStyle: React.CSSProperties = {
    borderTop: ui.edge,
    background: ui.surface2,
    padding: 10,
  };

  const fieldStyle: React.CSSProperties = {
    flex: "1 1 auto",
    minHeight: 60,
    maxHeight: 240,
    overflow: "auto",
    border: `1px solid ${getComputedStyle(document.documentElement).getPropertyValue(
      "--mc-border"
    ) || "rgba(34,48,71,.9)"}`,
    background: "#0e1726",
    color: ui.text,
    borderRadius: 12,
    padding: "10px 12px",
    font: "14px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
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
    font: "600 13px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    cursor: streaming || (!input.trim() && pendingFiles.length === 0) ? "not-allowed" : "pointer",
    opacity: streaming || (!input.trim() && pendingFiles.length === 0) ? 0.55 : 1,
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
        font: "600 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
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
        font: "700 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
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

  // ---------- UI ------------------------------------------------------
  const panel = (
    <section
      ref={containerRef}
      role="dialog"
      aria-label="Solace"
      style={panelStyle}
      onClick={(e) => {
        // Alt+Click to re-center (kept convenience)
        if (!containerRef.current) return;
        if ((e as any).altKey) {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const w = panelW || 760;
          const h = panelH || 560;
          const startX = Math.max(PAD, Math.round((vw - w) / 2));
          const startY = Math.max(PAD, Math.round((vh - h) / 2));
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
          <span aria-hidden style={orbStyle} title="Alt+Click header to center/reset" />
          <span style={{ font: "600 13px system-ui", color: ui.text }}>Solace</span>
          <span style={{ font: "12px system-ui", color: ui.sub }}>Create with moral clarity</span>
        </div>

        {/* middle: lenses */}
        <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
          {chip("Create", modeHint === "Create", () => setModeHint("Create"))}
          {chip("Next", modeHint === "Next Steps", () => setModeHint("Next Steps"))}
          {chip("Red", modeHint === "Red Team", () => setModeHint("Red Team"))}
        </div>

        {/* right: ministry */}
        <div style={{ marginLeft: "auto" }}>{ministryTab}</div>
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
              background: m.role === "user" ? "rgba(39,52,74,.6)" : "rgba(28,38,54,.6)",
              color: m.role === "user" ? "var(--mc-text)" : "rgba(233,240,250,.94)",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* COMPOSER */}
      <div style={composerWrapStyle}>
        {/* pending attachments preview */}
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
              onClick={() => fileInputRef.current?.click()}
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
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
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
          <button onClick={send} disabled={streaming || (!input.trim() && pendingFiles.length === 0)} style={askBtnStyle}>
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
          <span>{ministryOn ? "Create • Ministry overlay" : modeHint || "Neutral"}</span>
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
