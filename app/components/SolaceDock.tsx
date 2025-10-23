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

/** bump the key to invalidate any saved {x:0,y:0} */
const POS_KEY = "solace:pos:v2";

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

  const ministryOn = useMemo(
    () => filters.has("abrahamic") && filters.has("ministry"),
    [filters]
  );

  const width = "min(720px, calc(100vw - 2rem))";

  // seed first prompt
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Welcome. What is **the one thing** you could do today that would make tomorrow more meaningful?",
        },
      ]);
    }
  }, [messages.length]);

  // --- track dock size so we can clamp within the viewport ---
  const [panelH, setPanelH] = useState(0);
  const [panelW, setPanelW] = useState(0);
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

  // --- center on first open (or restore saved pos if valid) ---
  const triedInitRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || !canRender || !visible) return;
    if (triedInitRef.current) return;
    triedInitRef.current = true;

    // 1) try to restore a *valid* saved position
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { x?: number; y?: number } | null;
        const sx = typeof parsed?.x === "number" ? parsed!.x : undefined;
        const sy = typeof parsed?.y === "number" ? parsed!.y : undefined;
        if (
          sx !== undefined &&
          sy !== undefined &&
          !(sx === 0 && sy === 0) // ignore old bad value
        ) {
          setPos(sx, sy);
          return;
        }
      }
    } catch {
      /* ignore parse errors */
    }

    // 2) otherwise center after the element has real dimensions
    const el = containerRef.current;
    if (!el) return;
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const w = rect.width || Math.min(720, window.innerWidth - 32);
      const h = rect.height || 220;
      const startX = Math.max(16, Math.round((window.innerWidth - w) / 2));
      const startY = Math.max(16, Math.round((window.innerHeight - h) / 2));
      setPos(startX, startY);
    }, 120);
  }, [canRender, visible, setPos]);

  // --- persist position whenever it changes ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // don’t save 0,0 (we never want to restore that)
      if (!(x === 0 && y === 0)) {
        localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
      }
    } catch {
      /* ignore */
    }
  }, [x, y]);

  // --- drag handlers ---
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
    ta.style.height = Math.min(160, ta.scrollHeight) + "px";
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
        body: JSON.stringify({
          messages: next,
          filters: activeFilters,
          stream: false,
        }),
      });

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

  // toggle ministry overlay (adds/removes BOTH tags together)
  function toggleMinistry() {
    if (ministryOn) {
      const next = Array.from(filters).filter(
        (f) => f !== "abrahamic" && f !== "ministry"
      );
      setFilters(next);
    } else {
      const next = new Set(filters);
      next.add("abrahamic");
      next.add("ministry");
      setFilters(next);
    }
  }

  if (!canRender || !visible) return null;

  // clamp to viewport
  const maxX = Math.max(
    0,
    (typeof window !== "undefined" ? window.innerWidth : 0) - panelW - 16
  );
  const maxY = Math.max(
    0,
    (typeof window !== "undefined" ? window.innerHeight : 0) - panelH - 16
  );
  const tx = Math.min(Math.max(0, x - 16), maxX);
  const ty = Math.min(Math.max(0, y - 16), maxY);

  const panel = (
    <section
      ref={containerRef}
      role="dialog"
      aria-label="Solace"
      style={{
        position: "fixed",
        left: 16,
        top: 16,
        width,
        zIndex: 70000,
        pointerEvents: "auto",
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        transition: "transform 160ms ease-out, opacity 160ms ease-out",
        opacity: 1,
      }}
      className={cx(
        "solace-dock rounded-3xl border shadow-2xl backdrop-blur",
        ministryOn &&
          "ring-1 ring-amber-300/30 shadow-[0_0_40px_-10px_rgba(251,191,36,0.25)]"
      )}
    >
      {/* Header: drag handle + mode chips + ministry overlay */}
      <header
        onMouseDown={onHeaderMouseDown}
        className="cursor-move select-none px-4 py-2.5 flex items-center justify-between border-b border-zinc-800"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
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
        {messages.map((m, i) => (
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
        ))}
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
            className="min-h-[44px] max-h-[160px] w-full resize-none rounded-xl p-3 outline-none"
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
        active
          ? "bg-zinc-200 text-zinc-900"
          : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
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
