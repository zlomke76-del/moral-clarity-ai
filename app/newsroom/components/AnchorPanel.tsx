// app/newsroom/components/AnchorPanel.tsx
"use client";

import { useState } from "react";

export default function AnchorPanel() {
  const [digest, setDigest] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function loadDigest() {
    setLoading(true);
    const res = await fetch("/api/solace-news/chat", {
      method: "POST",
      body: JSON.stringify({
        role: "anchor",
        action: "load-digest"
      })
    });
    const data = await res.json();
    setDigest(data.digest || "(no digest returned)");
    setLoading(false);
  }

  async function ask() {
    if (!question.trim()) return;
    setAnswer("…");
    const res = await fetch("/api/solace-news/chat", {
      method: "POST",
      body: JSON.stringify({
        role: "anchor",
        question
      })
    });
    const data = await res.json();
    setAnswer(data.text || "");
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-serif">Neutral News Anchor</h2>

      <button
        className="bg-black text-white px-4 py-2 text-sm rounded"
        onClick={loadDigest}
        disabled={loading}
      >
        {loading ? "Loading…" : "Load Daily Digest"}
      </button>

      {digest && (
        <pre className="whitespace-pre-wrap bg-neutral-50 p-4 rounded border">
          {digest}
        </pre>
      )}

      <textarea
        className="border rounded p-3 w-full text-sm"
        rows={4}
        placeholder="Ask Solace about today’s digest…"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        className="bg-neutral-800 text-white px-4 py-2 text-sm rounded"
        onClick={ask}
      >
        Ask Solace
      </button>

      {answer && (
        <div className="bg-neutral-50 border rounded p-4">
          <h3 className="font-semibold mb-2">Solace Response</h3>
          <p className="whitespace-pre-wrap text-sm">{answer}</p>
        </div>
      )}
    </section>
  );
}
