"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "create" | "next" | "red" | "ministry";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const MODES: Record<Mode, { label: string; hint: string }> = {
  create: { label: "Create", hint: "Brainstorm, draft, ideate." },
  next: { label: "Next Steps", hint: "Move to action with concrete steps." },
  red: { label: "Red Team", hint: "Stress-test, find blind spots." },
  ministry: { label: "Ministry", hint: "Reverent, scripture-aligned guidance." },
};

export default function FloatingChat({
  userId,
  userName,
}: {
  userId?: string | null;
  userName?: string | null;
}) {
  const [open, setOpen] = useState(true);
  const [mode, setMode] = useState<Mode>("create");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  // position (remember last)
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    try {
      const raw = localStorage.getItem("mca.chat.pos");
      return raw ? JSON.parse(raw) : { x: 24, y: 24 };
    } catch {
      return { x: 24, y: 24 };
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("mca.chat.pos", JSON.stringify(pos));
    } catch {}
  }, [pos]);

  // drag
  const dragging = useRef(false);
  const dragStart = useRef<{ ox: number; oy: number } | null>(null);
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStart.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !dragStart.current) return;
    setPos({ x: e.clientX - dragStart.current.ox, y: e.clientY - dragStart.current.oy });
  };
  const onMouseUp = () => {
    dragging.current = false;
    dragStart.current = null;
  };

  // prevent “loop”: never auto-send; only on explicit action
  const send = async (text?: string) => {
    const content = (text ?? draft).trim();
    if (!content || sending) return;

    setSending(true);
    setDraft("");

    const outgoing: Msg = { role: "user", content };
    setMsgs((m) => [...m, outgoing, { role: "assistant", content: "" }]);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          userId,
          userName,
          messages: [...msgs, outgoing].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!r.ok || !r.body) {
        throw new Error(`HTTP ${r.status}`);
      }

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs((m) => {
          // stream into last assistant message
          const copy = [...m];
          const i = copy.length - 1;
          if (i >= 0 && copy[i].role === "assistant") {
            copy[i] = { role: "assistant", content: acc };
          }
          return copy;
        });
      }
    } catch (e) {
      setMsgs((m) => [
        ...m.slice(0, -1),
        { role: "assistant", content: "⚠️ Failed to reach the assistant. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const modeBtn = (m: Mode) => (
    <button
      key={m}
      className={[
        "px-2.5 py-1 rounded-md text-xs border",
        mode === m ? "bg-zinc-800 border-zinc-600" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700",
      ].join(" ")}
      onClick={() => setMode(m)}
    >
      {MODES[m].label}
    </button>
  );

  // minimal styles inline to avoid CSS thrash
  return (
    <div
      style={{
        position: "fixed",
        right: `${pos.x}px`,
        bottom: `${pos.y}px`,
        zIndex: 60,
        maxWidth: 640,
        width: "min(92vw, 640px)",
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* header */}
      <div
        className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-zinc-800 bg-zinc-950/90 px-3 py-2 cursor-move select-none"
        onMouseDown={onMouseDown}
      >
        <div className="text-xs text-zinc-400">
          {MODES[mode].hint}
          {mode === "ministry" && <span className="ml-2 text-amber-300">• Ministry mode</span>}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            className="rounded-md px-2 py-1 text-xs border border-zinc-800 hover:border-zinc-700"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "–" : "Open"}
          </button>
          <div className="hidden sm:flex gap-1">{(Object.keys(MODES) as Mode[]).map(modeBtn)}</div>
        </div>
      </div>

      {!open ? null : (
        <div className="rounded-b-2xl border border-zinc-800 bg-zinc-950/90">
          {/* transcript */}
          <div className="max-h-[46vh] overflow-auto px-3 py-2 space-y-2">
            {msgs.length === 0 && (
              <div className="text-xs text-zinc-500">
                Ask anything, or paste context. I’ll stream a concise, mode-aware answer and invite next steps.
              </div>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm"
                    : "bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm"
                }
              >
                {m.content}
              </div>
            ))}
          </div>

          {/* input row */}
          <div className="flex items-end gap-2 border-t border-zinc-800 px-2 py-2">
            <button
              title="Attach"
              className="shrink-0 rounded-lg border border-zinc-800 px-2 py-2 hover:border-zinc-700"
              onClick={() => alert("TODO: open file picker & upload; stored to Supabase storage")}
            >
              📎
            </button>
            <button
              title="Mic"
              className="shrink-0 rounded-lg border border-zinc-800 px-2 py-2 hover:border-zinc-700"
              onClick={() => alert("TODO: start/stop Web Speech API or Whisper streaming")}
            >
              🎙️
            </button>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Speak or type…"
              className="min-h-[44px] max-h-40 grow resize-none overflow-x-auto overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-700"
              style={{ whiteSpace: "pre" }} // no soft-wrap; horizontal scroll instead
            />
            <button
              disabled={sending || !draft.trim()}
              onClick={() => send()}
              className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>

          {/* compact mode selector for mobile */}
          <div className="sm:hidden border-t border-zinc-800 px-2 py-2 flex gap-2 overflow-auto">
            {(Object.keys(MODES) as Mode[]).map(modeBtn)}
          </div>
        </div>
      )}
    </div>
  );
}
