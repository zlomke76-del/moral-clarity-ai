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

/** classNames helper */
const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

/** Bump the key to bypass any previously-saved bad positions */
const POS_KEY = "solace:pos:v2";

/** minimum “sane” distance from edges to consider a saved pos valid */
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

  // Ministry overlay (additional guidance)
  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  // Wider by default, user can resize
  const width = "clamp(520px, 56vw, 980px)";

  // Track size for clamping movement
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

  // Center or restore saved position. Don’t show until position is set.
  useEffect(() => {
    if (typeof window === "undefined" || !canRender || !visible) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // try RESTORE (but ignore bogus coords like 0,0 or off-screen)
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { x: number; y: number } | null;
        if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
          const sx = Math.max(MIN_PAD, Math.min(vw - MIN_PAD, saved.x));
          const sy = Math.max(MIN_PAD, Math.min(vh - MIN_PAD, saved.y));
          const looksValid =
            sx >= MIN_PAD && sy >= MIN_PAD && (sx !== 0 || sy !== 0);
          if (looksValid) {
            setPos(sx, sy);
            setPosReady(true);
            return;
          }
        }
      }
    } catch {
      /* ignore */
    }

    // otherwise CENTER
    requestAnimationFrame(() => {
      const w = panelW || Math.min(980, Math.max(520, Math.round(vw * 0.56)));
      const h = panelH || 260;
      const startX = Math.max(MIN_PAD, Math.round((vw - w) / 2));
      const startY = Math.max(MIN_PAD, Math.round((vh - h) / 2));
      setPos(startX, startY);
      setPosReady(true);
    });
  }, [canRender, visible, panelW, panelH, setPos]);

  // Persist position (only once we’ve confirmed it’s ready & sane)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!posReady) return;
    if (x < MIN_PAD || y < MIN_PAD) return; // ignore bogus 0,0 writes
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
    } catch {
      /* ignore */
    }
  }, [x, y, posReady]);

  // Dragging
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
    ta.style.height = Math.min(200, ta.scrollHeight) + "px";
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

  const invisible = !posReady; // prevent top-left flash

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
        zIndex: 70000,
        pointerEvents: invisible ? "none" : "auto",
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        opacity: invisible ? 0 : 1,
        transition: "opacity 120ms ease",
        resize: "both",
        overflow: "auto",
      }}
      className={cx(
        "solace-dock rounded-3xl border shadow-2xl backdrop-blur",
        ministryOn && "ring-1 ring-amber-300/30 shadow-[0_0_40px_-10px_rgba(251,191,36,0.25)]"
      )}
    >
      {/* Header: drag handle + mode chips + ministry overlay */}
      <header
        onMouseDown={onHeaderMouseDown}
        className="cursor-move select-none px-4 py-2.5 flex items-center justify-between border-b border-zinc-800"
        onClick={(e) => {
          // ALT + click title area => reset pos (handy if someone drags it off)
          if (e.altKey) {
            const w = panelW || Math.min(980, Math.max(520, Math.round(vw * 0.56)));
            const h = panelH || 260;
            const startX = Math.max(MIN_PAD, Math.round((vw - w) / 2));
            const startY = Math.max(MIN_PAD, Math.round((vh - h) / 2));
            setPos(startX, startY);
            try { localStorage.removeItem(POS_KEY); } catch {}
          }
        }}
      >
        <div className="flex items-center gap-3">
          {/* golden orb accent (matches marketing vibe) */}
          <span
            aria-hidden
            className="inline-block h-4 w-4 rounded-full"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, rgba(251,191,36,0.95) 0%, rgba(251,191,36,0.55) 35%, rgba(251,191,36,0.2) 70%, rgba(251,191,36,0.1) 100%)",
              boxShadow: "0 0 24px rgba(251,191,36,0.45)",
            }}
            title="Alt+Click to center/reset"
          />
          <span className="text-sm font-medium">Solace</span>
          <span className="text-xs text-zinc-400">Create with moral clarity</span>
        </div>

        <div className="flex items-center gap-2">
          <Chip label="Create" active={modeHint === "Create"} onClick={() => setModeHint("Create")} />
          <Chip label="Next"   active={modeHint === "Next Steps"} onClick={() => setModeHint("Next Steps")} />
          <Chip label="Red"    active={modeHint === "Red Team"}   onClick={() => setModeHint("Red Team")} />
          <TogglePill label="Ministry" value={ministryOn} onToggle={toggleMinistry} />
        </div>
      </header>

      {/* Transcript */}
      <div className="max-h-[44vh] overflow-auto px-4 py-3 space-y-2" aria-live="polite">
        {messages.length === 0 ? (
          <div className="rounded-xl px-3 py-3 text-zinc-400 text-sm">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-3 w-3 rounded-full"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 40%, rgba(251,191,36,0.95) 0%, rgba(251,191,36,0.55) 35%, rgba(251,191,36,0.2) 70%, rgba(251,191,36,0.1) 100%)",
                  boxShadow: "0 0 18px rgba(251,191,36,0.35)",
                }}
              />
              <span>Ready when you are.</span>
            </div>
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
            rows={2}
            className="min-h-[52px] max-h-[220px] w-full resize-none rounded-xl p-3 outline-none"
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

/* ---- tiny UI atoms ---- */

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
        "rounded-md px-2 py-1 text-xs",
        active ? "bg-zinc-200 text-zinc-900" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
      )}
      title={`${label} mode hint`}
      type="button"
    >
      {label}
    </button>
  );
}

function TogglePill({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cx(
        "rounded-full px-2.5 py-1 text-xs font-medium transition",
        value
          ? "bg-amber-300 text-black shadow-[0_0_16px_-4px_rgba(251,191,36,0.6)]"
          : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
      )}
      title={`${label} overlay`}
      type="button"
    >
      {label}
    </button>
  );
}
