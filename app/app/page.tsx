"use client";
import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<any[]>([]);

  async function send() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://www.moralclarity.ai"
      },
      body: JSON.stringify({ messages: [{ role: "user", content: input }] })
    });
    const data = await res.json();
    setLog(l => [{ role:"assistant", ...data }, { role:"user", content: input }, ...l]);
    setInput("");
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="rounded-xl border border-zinc-800 p-4">
          <div className="mb-3 text-sm text-zinc-400">Mode: <b>{log[0]?.mode ?? "—"}</b> • {(log[0]?.confidence ?? 0).toFixed(2)}</div>
          <textarea value={input} onChange={e=>setInput(e.target.value)} className="h-28 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3" placeholder="Ask anything…" />
          <button onClick={send} className="mt-3 rounded-lg bg-blue-600 px-4 py-2">Send</button>
        </div>
        <div className="space-y-3">
          {log.map((m, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 p-4">
              <div className="text-xs uppercase text-zinc-500">{m.role}</div>
              <pre className="whitespace-pre-wrap break-words text-sm">{m.text ?? m.content}</pre>
            </div>
          ))}
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-xl border border-zinc-800 p-4">
          <div className="mb-2 text-sm text-zinc-400">Signals</div>
          <pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(log[0]?.signals ?? {}, null, 2)}</pre>
        </div>
      </aside>
    </div>
  );
}
