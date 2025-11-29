// app/components/ChatUI.tsx
"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatUI() {
  // Correct: use the unified browser client
  const supabase = createSupabaseBrowser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Example session usage — adjust if needed
    const session = supabase.auth.getSession().catch(() => null);
    console.log("ChatUI session:", session);
  }, [supabase]);

  async function handleSend() {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // TODO: connect to your orchestration endpoint
  }

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className="text-slate-200 whitespace-pre-wrap">
            <strong>{m.role === "user" ? "You: " : "Solace: "}</strong>
            {m.content}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 p-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Speak or type…"
          className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
