'use client';

import { useState } from "react";
import { sendChat } from "@/lib/sendChat"; // ← named import

export default function MoralClarityBox() {
  const [input, setInput] = useState("");

  async function onAsk() {
    const text = input.trim();
    if (!text) return;
    setInput("");

    try {
      const resp = await sendChat({
        messages: [{ role: "user", content: text }],
        stream: false,
      });

      // naive demo handling — adjust to your UI as needed
      if (typeof resp === "string") {
        console.log(resp);
      } else if (resp?.text) {
        console.log(resp.text);
      } else {
        console.log(resp);
      }
    } catch (e) {
      console.error("sendChat failed:", e);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="flex-1 rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none"
        />
        <button
          onClick={onAsk}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
