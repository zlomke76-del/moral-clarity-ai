// app/components/ChatDock.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * SINGLETON GUARD
 * Prevents duplicate mounts across hot reloads or accidental re-use.
 */
declare global {
  interface Window {
    __SOLACE_DOCK_MOUNTED__?: boolean;
  }
}

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "Create" | "Next Steps" | "Red Team";

/** Small inline SVGs (no external icon deps) */
const IconMin = (props: any) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}><path fill="currentColor" d="M5 12h14v2H5z"/></svg>
);
const IconClose = (props: any) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}><path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4l-6.3 6.3-1.41-1.42L9.17 12 2.88 5.71 4.3 4.29l6.29 6.3 6.29-6.3z"/></svg>
);
const IconSend = (props: any) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}><path fill="currentColor" d="M2 21 23 12 2 3v7l15 2-15 2z"/></svg>
);
const IconMic = (props: any) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21H9v2h6v-2h-2v-3.08A7 7 0 0 0 19 11z"/></svg>
);
const IconClip = (props: any) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}><path fill="currentColor" d="M16.5 6.5 8 15a3 3 0 0 0 4.24 4.24l8.49-8.49a5 5 0 1 0-7.07-7.07L4.7 9.64a7 7 0 1 0 9.9 9.9l6.01-6.01-1.41-1.41-6.01 6.01a5 5 0 1 1-7.07-7.07l9.9-9.9a3 3 0 1 1 4.24 4.24l-8.49 8.49"/></svg>
);

/** Utility */
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function ChatDock() {
  // -------- Singleton mount guard --------
  const [enabled, setEnabled] = useState(false);
  const mountedOnceRef = useRef(false);
  useEffect(() => {
    if (mountedOnceRef.current) return;
    mountedOnceRef.current = true;
    if (typeof window !== "undefined") {
      if (window.__SOLACE_DOCK_MOUNTED__) return;
      window.__SOLACE_DOCK_MOUNTED__ = true;
    }
    setEnabled(true);
  }, []);
  if (!enabled) return null;

  // -------- Position / drag state --------
  const initPos = useMemo(() => {
    if (typeof window === "undefined") return { x: 24, y: 24 };
    const raw = localStorage.getItem("solace_dock_pos");
    try {
      return raw ? JSON.parse(raw) : { x: 24, y: 24 };
    } catch {
      return { x: 24, y: 24 };
    }
  }, []);
  const [pos, setPos] = useState(initPos);
  const startRef = useRef<{ x: number; y: number; mx: number; my: number } | null>(null);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    startRef.current = { x: pos.x, y: pos.y, mx: e.clientX, my: e.clientY };
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onDragEnd);
  }, [pos]);

  const onDrag = useCallback((e: MouseEvent) => {
    const s = startRef.current;
    if (!s) return;
    const nx = s.x + (e.clientX - s.mx);
    const ny = s.y + (e.clientY - s.my);
    const maxX = (window.innerWidth ?? 0) - 360; // dock width
    const maxY = (window.innerHeight ?? 0) - 60; // header height-ish
    const clamped = { x: clamp(nx, 8, Math.max(8, maxX)), y: clamp(ny, 8, Math.max(8, maxY)) };
    setPos(clamped);
  }, []);

  const onDragEnd = useCallback(() => {
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onDragEnd);
    try {
      localStorage.setItem("solace_dock_pos", JSON.stringify(pos));
    } catch {}
    startRef.current = null;
  }, [pos, onDrag]);

  // -------- UI state --------
  const [open, setOpen] = useState(true);
  const [activeMode, setActiveMode] = useState<Mode>("Create");
  const [ministry, setMinistry] = useState(false); // overlay; can be combined with any mode
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi—I'm Solace. What’s on your mind?" },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------- send message --------
  const computeFilters = useCallback(() => {
    const f: string[] = [];
    if (activeMode === "Next Steps") f.push("guidance");
    if (ministry) f.push("abrahamic", "ministry");
    return f;
  }, [activeMode, ministry]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || pending) return;
    setError(null);
    setMsgs((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setInput("");
    setPending(true);

    const filters = computeFilters();
    const body = {
      messages: [...msgs, { role: "user", content: text }].map(({ role, content }) => ({
        role,
        content,
      })),
      filters,
      stream: true,
    };

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Last-Mode": activeMode },
        body: JSON.stringify(body),
      });

      // If backend returns JSON (non-stream), consume once
      const ct = r.headers.get("content-type") || "";
      if (!r.ok) {
        const t = await r.text().catch(() => "");
        throw new Error(t || `HTTP ${r.status}`);
      }

      if (ct.includes("application/json")) {
        const j = await r.json();
        const text = String(j?.text ?? "");
        setMsgs((m) => {
          const copy = [...m];
          const i = copy.length - 1;
          if (i >= 0 && copy[i].role === "assistant") {
            copy[i] = { role: "assistant", content: text || "[No reply]" };
          }
          return copy;
        });
        setPending(false);
        return;
      }

      // otherwise stream SSE/plain text
      if (!r.body) throw new Error("No response body");
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs((m) => {
          const copy = [...m];
          const i = copy.length - 1;
          if (i >= 0 && copy[i].role === "assistant") {
            copy[i] = { role: "assistant", content: acc };
          }
          return copy;
        });
      }
      setPending(false);
    } catch (e: any) {
      setPending(false);
      setError(e?.message || "Something went wrong");
      setMsgs((m) => {
        const copy = [...m];
        const i = copy.length - 1;
        if (i >= 0 && copy[i].role === "assistant") {
          copy[i] = { role: "assistant", content: "⚠️ Connection issue. Please try again." };
        }
        return copy;
      });
    }
  }, [input, pending, msgs, activeMode, computeFilters]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // -------- Mic & file stubs (safe placeholders) --------
  const handleMic = useCallback(() => {
    // Keep UI responsive without trying to access hardware here
    setError("Mic capture will be added next—use your keyboard for now.");
    setTimeout(() => setError(null), 3000);
  }, []);
  const handleAttach = useCallback(() => {
    setError("File attachments coming soon (images, PDFs).");
    setTimeout(() => setError(null), 3000);
  }, []);

  // -------- Render --------
  return (
    <div
      className="fixed z-[1000]"
      style={{ right: pos.x, bottom: pos.y }}
      aria-live="polite"
    >
      {/* FAB when minimized */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold shadow-lg shadow-blue-900/40 hover:bg-blue-500 focus:outline-none"
          title="Open Solace"
        >
          Open Solace
        </button>
      ) : (
        <div className="w-[360px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur shadow-2xl">
          {/* Header (draggable) */}
          <div
            className="flex cursor-grab items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/50 px-3 py-2"
            onMouseDown={onDragStart}
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-semibold tracking-tight">Solace</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                title="Minimize"
              >
                <IconMin />
              </button>
              <button
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                title="Close"
              >
                <IconClose />
              </button>
            </div>
          </div>

          {/* Mode row */}
          <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
            {(["Create", "Next Steps", "Red Team"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMode(m)}
                className={[
                  "rounded-md px-2.5 py-1 text-xs font-medium transition",
                  activeMode === m
                    ? "bg-zinc-800 text-zinc-100"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200",
                ].join(" ")}
              >
                {m}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs text-zinc-400">Ministry</label>
              <button
                onClick={() => setMinistry((v) => !v)}
                className={[
                  "h-5 w-10 rounded-full transition",
                  ministry ? "bg-emerald-500/80" : "bg-zinc-700",
                ].join(" ")}
                title="Abrahamic counsel overlay"
              >
                <span
                  className={[
                    "block h-5 w-5 rounded-full bg-white shadow transition",
                    ministry ? "translate-x-5" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="max-h-[320px] space-y-3 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-lg bg-blue-600/10 px-3 py-2 text-sm text-blue-200 ring-1 ring-inset ring-blue-900/50"
                    : "mr-8 rounded-lg bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 ring-1 ring-inset ring-black/20"
                }
              >
                {m.content}
              </div>
            ))}
            {error && (
              <div className="rounded-md bg-red-900/30 px-3 py-2 text-xs text-red-200 ring-1 ring-inset ring-red-900/50">
                {error}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-zinc-800 p-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAttach}
                className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                title="Attach (coming soon)"
              >
                <IconClip />
              </button>
              <button
                onClick={handleMic}
                className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                title="Speak (coming soon)"
              >
                <IconMic />
              </button>

              <div className="relative flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={
                    ministry
                      ? "Ask anything… (Create/Steps/Red-team + Ministry overlay)"
                      : "Ask anything… (Create / Next Steps / Red Team)"
                  }
                  className="w-full resize-none overflow-x-auto rounded-md bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-inset ring-zinc-800 focus:ring-zinc-600"
                  rows={1}
                  // Non-wrapping input so long thoughts scroll horizontally (your request)
                  style={{ whiteSpace: "nowrap" }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={pending || !input.trim()}
                className="rounded-md bg-blue-600 p-2 text-white shadow hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                title="Send"
              >
                <IconSend />
              </button>
            </div>

            <div className="mt-1 px-1 text-[10px] text-zinc-500">
              {pending ? "Thinking…" : ministry ? "Ministry overlay is ON" : "Neutral counsel"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
