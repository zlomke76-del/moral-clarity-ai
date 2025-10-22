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
type ModeHint = "Create" | "Next Steps" | "Red Team" | "Ministry" | "Neutral";

export default function SolaceDock() {
  const mountedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ---- singleton guard
  const [canRender, setCanRender] = useState(false);
  useEffect(() => {
    if (window.__solaceDockMounted) return; // another instance exists
    window.__solaceDockMounted = true;
    setCanRender(true);
    return () => {
      window.__solaceDockMounted = false;
    };
  }, []);

  const { visible, x, y, setPos, filters, setFilters, toggle } = useSolaceStore();
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [modeHint, setModeHint] = useState<ModeHint>("Neutral");

  // ensure Ministry acts as an overlay, not a mode switch
  const activeFilters = useMemo(() => Array.from(filters), [filters]);

  // drag handlers
  function onMouseDown(e: React.MouseEvent) {
    setDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    const dx = e.clientX - (rect?.left ?? 0);
    const dy = e.clientY - (rect?.top ?? 0);
    setOffset({ dx, dy });
  }
  function onMouseMove(e: MouseEvent) {
    if (!dragging) return;
    setPos(Math.max(8, e.clientX - offset.dx), Math.max(8, e.clientY - offset.dy));
  }
  function onMouseUp() {
    setDragging(false);
  }

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, offset, setPos]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Last-Mode": modeHint, // assists the router, not a hard lock
        },
        body: JSON.stringify({
          messages: next,
          filters: activeFilters, // multi-select, includes "abrahamic","ministry" if toggled
          stream: false, // can wire streaming later
        }),
      });
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

  // autoresize text area (no off-screen scroll)
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(160, ta.scrollHeight) + "px";
  }, [input]);

  if (!canRender || !visible) return null;

  const panel = (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 520,
        zIndex: 70_000, // above app
      }}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur"
    >
      {/* header / drag handle */}
      <div
        onMouseDown={onMouseDown}
        className="cursor-move select-none px-3 py-2 flex items-center justify-between border-b border-zinc-800"
      >
        <div className="text-sm text-zinc-300">Solace</div>
        <div className="flex items-center gap-2">
          {/* mode chips (Create/Next/Red) are hints; “Ministry” is an overlay */}
          <ModeChip
            label="Create"
            active={modeHint === "Create"}
            onClick={() => setModeHint("Create")}
          />
          <ModeChip
            label="Next"
            active={modeHint === "Next Steps"}
            onClick={() => setModeHint("Next Steps")}
          />
          <ModeChip
            label="Red"
            active={modeHint === "Red Team"}
            onClick={() => setModeHint("Red Team")}
          />
          <TogglePill
            label="Ministry"
            value={filters.has("abrahamic") || filters.has("ministry")}
            onToggle={() => {
              const has = filters.has("abrahamic") || filters.has("ministry");
              if (has) {
                const next = activeFilters.filter(
                  (f) => f !== "abrahamic" && f !== "ministry"
                );
                setFilters(next);
              } else {
                const next = new Set(filters);
                next.add("abrahamic");
                next.add("ministry");
                setFilters(next);
              }
            }}
          />
        </div>
      </div>

      {/* transcript */}
      <div className="max-h-[320px] overflow-auto px-3 py-2 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "text-zinc-200" : "text-zinc-400"}
          >
            <span className="text-xs uppercase tracking-wide text-zinc-500 mr-2">
              {m.role}
            </span>
            {m.content}
          </div>
        ))}
      </div>

      {/* composer */}
      <div className="border-t border-zinc-800 p-2">
        <textarea
          ref={taRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Speak or type…"
          className="w-full resize-none rounded-lg bg-zinc-900/80 p-2 text-zinc-200 outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            {activeFilters.length ? `Filters: ${activeFilters.join(", ")}` : "Neutral"}
          </div>
          <button
            onClick={send}
            disabled={streaming}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
          >
            {streaming ? "Thinking…" : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}

function ModeChip(props: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={props.onClick}
      className={`rounded-md px-2 py-1 text-xs ${
        props.active ? "bg-zinc-200 text-zinc-900" : "bg-zinc-800 text-zinc-300"
      }`}
      title={`${props.label} mode hint`}
    >
      {props.label}
    </button>
  );
}

function TogglePill(props: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={props.onToggle}
      className={`rounded-full px-2 py-1 text-xs ${
        props.value ? "bg-amber-400 text-black" : "bg-zinc-800 text-zinc-300"
      }`}
      title={`${props.label} overlay`}
    >
      {props.label}
    </button>
  );
}
