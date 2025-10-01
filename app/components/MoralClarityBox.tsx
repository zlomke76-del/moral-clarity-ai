"use client";

import { useState } from "react";
import sendChat from "../lib/sendChat";

export default function MoralClarityBox() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [busy, setBusy] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    setBusy(true);

    // user message
    const next = [...log, { role: "user" as const, content: input }];
    setLog(next);
    setInput("");

    try {
      const text = await sendChat(next);
      setLog([...next, { role: "assistant" as const, content: text }]);
    } catch (e: any) {
      setLog([...next, { role: "assistant" as const, content: `Error: ${e.message}` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <div style={{ minHeight: "200px", marginBottom: "1rem", overflowY: "auto" }}>
        {log.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
          placeholder="Type your message..."
          disabled={busy}
        />
        <button onClick={handleSend} disabled={busy || !input.trim()}>
          {busy ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
