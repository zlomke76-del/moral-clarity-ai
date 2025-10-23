"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSolaceStore } from "@/app/providers/solace-store";

declare global {
  interface Window {
    __solaceDockMounted?: boolean;
  }
}

type Message = { role: "user" | "assistant"; content: string };
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Neutral";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

const POS_KEY = "solace:pos:v2";
const MIN_PAD = 12;

export default function SolaceDock() {
  // ----- singleton mount guard -----
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ---- UI / state ----
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ dx: 0, dy: 0 });
  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  // Ministry overlay
  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  // Wider + taller defaults; user can resize
  const width = "clamp(560px, 56vw, 980px)";

  // track size for clamping
  const [panelH, setPanelH] = useState(0);
  const [panelW, setPanelW] = useState(0);
  const [posReady, setPosReady] = useState(false);

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

  // center or restore saved pos (ignore bogus values)
  useEffect(() => {
    if (typeof window === "undefined" || !canRender || !visible) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { x: number; y: number } | null;
        if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          const sx = Math.max(MIN_PAD, Math.min(vw - MIN_PAD, saved.x));
          const sy = Math.max(MIN_PAD, Math.min(vh - MIN_PAD, saved.y));
          if (sx >= MIN_PAD && sy >= MIN_PAD && (sx !== 0 || sy !== 0)) {
            setPos(sx, sy);
            setPosReady(true);
            return;
          }
        }
      }
    } catch {}

    requestAnimationFrame(() => {
      const w = panelW || Math.min(980, Math.max(560, Math.round(vw * 0.56)));
      const h = panelH || Math.min(820, Math.max(420, Math.round(vh * 0.62)));
      const startX = Math.max(MIN_PAD, Math.round((vw - w) / 2));
      const startY = Math.max(MIN_PAD, Math.round((vh - h) / 2));
      setPos(startX, startY);
      setPosReady(true);
    });
  }, [canRender, visible, panelW, panelH, setPos]);

  // persist pos once sane
  useEffect(() => {
    if (typeof window === "undefined" || !posReady) return;
    if (x < MIN_PAD || y < MIN_PAD) return;
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

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    const next: Message[] = [...messages, { role: "user", content: text }];
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
        body: JSON.stringify({ messages: next, filters: activeFilters, stream: false }),
      });

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

  // toggle ministry overlay
  function toggleMinistry() {
    if (ministryOn) {
      const next = Array.from(filters).filter((f) => f !== "abrahamic" && f !== "ministry");
      setFilters(next);
    } else {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
    }
  }

  if (!canRender || !visible) return null;

  // clamp within viewport
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const maxX = Math.max(0, vw - panelW - MIN_PAD);
  const maxY = Math.max(0, vh - panelH - MIN_PAD);
  const tx = Math.min(Math.max(0, x - MIN_PAD), maxX);
  const ty = Math.min(Math.max(0, y - MIN_PAD), maxY);

  const invisible = !posReady;

  const panelGlow = ministryOn
    ? {
        boxShadow:
          "0 0 0 1px rgba(251,191,36,.25) inset, 0 0 90px rgba(251,191,36,.14), 0 22px 70px rgba(0,0,0,.55)",
        background:
          "radial-gradient(40% 60% at 20% -30%, rgba(251,191,36,.12), transparent 60%), radial-gradient(45% 60% at 80% -30%, rgba(251,191,36,.10), transparent 60%)",
      }
    : {};

  const panel = (
    <section
      ref={containerRef}
      role="dialog"
      aria-label="Solace"
      style={{
        position: "fixed",
        left: MIN_PAD,
        top: MIN_PAD,
        width,
        // **taller by default & resizable**
        height: "clamp(420px, 62vh, 820px)",
        maxHeight: "90vh",
        zIndex: 70000,
        pointerEvents: invisible ? "none" : "auto",
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        opacity: invisible ? 0 : 1,
        transition: "opacity 120ms ease",
        resize: "both",
        overflow: "hidden",
        ...panelGlow,
      }}
      className={cx(
        "solace-dock rounded-3xl border shadow-2xl backdrop-blur flex flex-col",
        ministryOn && "ring-1 ring-amber-300/30"
      )}
    >
      {/* Header */}
      <header
        onMouseDown={onHeaderMouseDown}
        className="cursor-move select-none px-4 py-2.5 flex items-center gap-3 border-b border-zinc-800"
        onClick={(e) => {
          if (e.altKey) {
            const startX = Math.max(MIN_PAD, Math.round((vw - (panelW || 760)) / 2));
            const startY = Math.max(MIN_PAD, Math.round((vh - (panelH || 560)) / 2));
            setPos(startX, startY);
            try { localStorage.removeItem(POS_KEY); } catch {}
          }
        }}
      >
        {/* title + golden orb */}
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-full"
            style={{
              background:
                "radial-gradient(62% 62% at 50% 42%, rgba(251,191,36,1) 0%, rgba(251,191,36,.65) 38%, rgba(251,191,36,.22) 72%, rgba(251,191,36,.12) 100%)",
              boxShadow: "0 0 38px rgba(251,191,36,.55)",
            }}
            title="Alt+Click to center/reset"
          />
          <span className="text-sm font-semibold leading-none">Solace</span>
          <span className="text-xs text-zinc-400 leading-none">Create with moral clarity</span>
        </div>

        {/* lenses in the middle */}
        <div className="flex items-center gap-2 ml-4">
          <Chip label="Create" active={modeHint === "Create"} onClick={() => setModeHint("Create")} />
          <Chip label="Next"   active={modeHint === "Next Steps"} onClick={() => setModeHint("Next Steps")} />
          <Chip label="Red"    active={modeHint === "Red Team"}   onClick={() => setModeHint("Red Team")} />
        </div>

        {/* push Ministry all the way right */}
        <div className="ml-auto">
          <MinistryTab active={ministryOn} onToggle={toggleMinistry} />
        </div>
      </header>

      {/* Transcript (roomy) */}
      <div className="flex-1 overflow-auto px-4 py-3 space-y-2" aria-live="polite">
        {messages.length === 0 ? (
          <div className="rounded-xl px-3 py-3 text-zinc-400 text-sm">
            Ready when you are.
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cx(
                "rounded-xl px-3 py-2",
                m.role === "user"
                  ? "bg-zinc-800/70 text-zinc-100"
                  : "bg-zinc-900/70 text-zinc-300"
              )}
            >
              {m.content}
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-end gap-2">
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
            rows={3}
            className="min-h-[60px] max-h-[240px] w-full resize-none rounded-xl p-3 outline-none"
          />
          <button
            onClick={send}
            disabled={streaming || !input.trim()}
            className={cx(
              "primary rounded-xl px-4 py-2 text-sm font-medium",
              (streaming || !input.trim()) && "opacity-50 cursor-not-allowed"
            )}
          >
            {streaming ? "…" : "Ask"}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
          <span>{ministryOn ? "Create • Ministry overlay" : modeHint || "Neutral"}</span>
          {!!filters.size && (
            <span className="truncate max-w-[60%]">Filters: {Array.from(filters).join(", ")}</span>
          )}
        </div>
      </div>
    </section>
  );

  return createPortal(panel, document.body);
}

/* ---- UI atoms ---- */

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-md px-2.5 py-1.5 text-xs font-semibold leading-none",
        active ? "bg-zinc-200 text-zinc-900" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
      )}
      title={`${label} mode`}
      type="button"
    >
      {label}
    </button>
  );
}

function MinistryTab({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cx(
        "rounded-md px-2.5 py-1.5 text-xs font-semibold leading-none",
        active
          ? "bg-amber-300 text-black shadow-[0_0_22px_-4px_rgba(251,191,36,.75)]"
          : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
      )}
      title="Ministry mode"
      type="button"
    >
      Ministry
    </button>
  );
}
