"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Mic, Paperclip, X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/ui"; // if you don't have this, see fallback at bottom

type Mode = "create" | "next" | "red" | "ministry";

type Msg = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  mode: Mode;
  ts: number;
};

const modeMeta: Record<
  Mode,
  { label: string; hint: string; accent: string; border: string }
> = {
  create: {
    label: "Create",
    hint: "Brainstorm, draft, ideate.",
    accent: "text-fuchsia-300",
    border: "border-fuchsia-500/30",
  },
  next: {
    label: "Next Steps",
    hint: "Clarify actions and owners.",
    accent: "text-blue-300",
    border: "border-blue-500/30",
  },
  red: {
    label: "Red Team",
    hint: "Stress-test & find risks.",
    accent: "text-amber-300",
    border: "border-amber-500/30",
  },
  ministry: {
    label: "Ministry",
    hint: "Reverent, scripture-aligned tone.",
    accent: "text-emerald-300",
    border: "border-emerald-500/30",
  },
};

export default function ChatDock() {
  // position & UI state
  const [minimized, setMinimized] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const startRef = useRef<{ x: number; y: number; mx: number; my: number } | null>(null);

  // chat state (local for now; we’ll swap to real API later)
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "sys-1",
      role: "assistant",
      content:
        "Hi — I’m here, floating with you. Ask anything or paste context and I’ll help. (Create / Next Steps / Red Team / Ministry)",
      mode: "create",
      ts: Date.now(),
    },
  ]);
  const [busy, setBusy] = useState(false);

  // drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    startRef.current = { x: pos.x, y: pos.y, mx: e.clientX, my: e.clientY };
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging || !startRef.current) return;
    const dx = e.clientX - startRef.current.mx;
    const dy = e.clientY - startRef.current.my;
    setPos({ x: Math.max(8, startRef.current.x + dx), y: Math.max(8, startRef.current.y + dy) });
  };
  const onMouseUp = () => {
    setDragging(false);
    startRef.current = null;
  };
  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  // submit
  const send = async () => {
    const text = value.trim();
    if (!text || busy) return;
    const id = crypto.randomUUID();
    const userMsg: Msg = { id, role: "user", content: text, mode, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setValue("");
    setBusy(true);

    // TEMP: local “assistant” placeholder so UX feels alive
    await new Promise((r) => setTimeout(r, 450));
    const assistant: Msg = {
      id: crypto.randomUUID(),
      role: "assistant",
      mode,
      ts: Date.now(),
      content:
        mode === "create"
          ? "Let’s expand this. Give me the core constraint and the outcome you want; I’ll propose 3 strong paths."
          : mode === "next"
          ? "Here’s a quick action scaffold: 1) owner 2) deadline 3) blockers 4) metrics. Want me to fill a draft?"
          : mode === "red"
          ? "Counter-argument: What if the core premise is false? Identify the riskiest assumption and an experiment to test it."
          : "Let’s approach this with reverence. Would you like relevant scripture, or a gentle framing to act wisely?",
    };
    setMessages((m) => [...m, assistant]);
    setBusy(false);
  };

  // keyboard
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  // MOBILE: snap to bottom on small screens
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 60,
    right: pos.x,
    bottom: pos.y,
    maxWidth: "min(680px, 96vw)",
    width: "min(680px, 96vw)",
  };

  return (
    <div style={containerStyle} className="pointer-events-auto">
      {/* Minimized button */}
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-200 shadow-lg backdrop-blur transition hover:bg-zinc-900"
          aria-label="Open chat"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Solace</span>
          <Plus className="ml-1 h-4 w-4" />
        </button>
      ) : (
        <div
          className={cn(
            "rounded-2xl border bg-zinc-950/85 backdrop-blur shadow-2xl",
            "border-zinc-800"
          )}
        >
          {/* Header / drag handle */}
          <div
            onMouseDown={onMouseDown}
            className={cn(
              "cursor-grab active:cursor-grabbing select-none",
              "flex items-center justify-between px-3 py-2 border-b border-zinc-800"
            )}
            aria-label="Drag to move"
            title="Drag to move"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-medium text-zinc-200">Solace</span>
              <span className={cn("text-xs text-zinc-400 hidden sm:inline")}>
                {modeMeta[mode].hint}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(true)}
                className="rounded-md p-1 hover:bg-zinc-800"
                aria-label="Minimize"
              >
                <Minus className="h-4 w-4 text-zinc-400" />
              </button>
              <button
                onClick={() => setMinimized(true)}
                className="rounded-md p-1 hover:bg-zinc-800"
                aria-label="Close"
                title="Close (minimize)"
              >
                <X className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 px-2 pt-2">
            {(["create", "next", "red", "ministry"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs transition",
                  m === mode
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                {modeMeta[m].label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="max-h-[36vh] overflow-y-auto px-3 pt-2 pb-3 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="flex">
                <div
                  className={cn(
                    "max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-zinc-800 text-zinc-100"
                      : "mr-auto bg-zinc-900 text-zinc-200 border border-zinc-800",
                    // subtle mode border cue on assistant
                    msg.role === "assistant" && modeMeta[msg.mode].border
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="text-xs text-zinc-400 animate-pulse">Thinking…</div>
            )}
          </div>

          {/* Input row (single line, no wrap, horizontal scroll) */}
          <div className="border-t border-zinc-800 p-2">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-1">
              <button
                className="rounded-md p-2 hover:bg-zinc-900"
                title="Attach (coming soon)"
                aria-label="Attach"
              >
                <Paperclip className="h-4 w-4 text-zinc-400" />
              </button>

              {/* Single-line input that does NOT wrap text; horizontal scroll */}
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Speak or type…"
                className={cn(
                  "flex-1 bg-transparent outline-none text-zinc-100 text-sm",
                  "whitespace-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700",
                  "placeholder:text-zinc-500"
                )}
                style={{ caretColor: "white" }}
              />

              <button
                className="rounded-md p-2 hover:bg-zinc-900"
                title="Voice (detect built-in mic; graceful fallback)"
                aria-label="Voice input"
                onClick={() => alert("Voice input coming soon — will use built-in mic if present.")}
              >
                <Mic className="h-4 w-4 text-zinc-400" />
              </button>

              <button
                onClick={send}
                disabled={!value.trim() || busy}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  value.trim() && !busy
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                Send
              </button>
            </div>

            {/* Mode hint */}
            <div className={cn("mt-2 text-xs", modeMeta[mode].accent)}>
              {modeMeta[mode].label} mode
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Fallback tiny classnames helper (remove if you already have "@/lib/ui" with `cn`) */
// export function cn(...parts: Array<string | false | null | undefined>) {
//   return parts.filter(Boolean).join(" ");
// }
