// app/solace/core/useSolaceChat.ts
"use client";
import { useState, useRef } from "react";

export type Role = "user" | "assistant";
export type Msg  = { role: Role; content: string };

export function useSolaceChat(opts?: { filters?: string[]; lastMode?: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setBusy(true);
    setMessages(m => [...m, { role: "user", content: text.trim() }]);
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json", "X-Last-Mode": opts?.lastMode ?? "Neutral" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: text }], filters: opts?.filters ?? [], stream: false }),
      });
      const j = await r.json();
      setMessages(m => [...m, { role: "assistant", content: String(j.text ?? "[No reply]") }]);
    } catch (e: any) {
      setMessages(m => [...m, { role: "assistant", content: `⚠️ ${e?.message || "Error"}` }]);
    } finally {
      setBusy(false);
    }
  }

  function clear() { setMessages([]); }
  function stop()  { abortRef.current?.abort(); setBusy(false); }

  return { messages, busy, send, stop, clear };
}

