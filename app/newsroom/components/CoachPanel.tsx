// app/newsroom/components/CoachPanel.tsx
"use client";

import { useState } from "react";

export default function CoachPanel() {
  const [draft, setDraft] = useState("");
  const [critique, setCritique] = useState("");
  const [rewrite, setRewrite] = useState("");

  async function analyze() {
    if (!draft.trim()) return;
    setCritique("Analyzing…");
    const res = await fetch("/api/solace-news/coach", {
      method: "POST",
      body: JSON.stringify({
        mode: "critique",
        text: draft
      })
    });
    const data = await res.json();
    setCritique(data.critique || "");
  }

  async function regenerate() {
    if (!draft.trim()) return;
    setRewrite("Rewriting…");
    const res = await fetch("/api/solace-news/coach", {
      method: "POST",
      body: JSON.stringify({
        mode: "rewrite",
        text: draft
      })
    });
    const data = await res.json();
    setRewrite(data.rewrite || "");
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-serif">Journalism Coach</h2>

      <textarea
        className="border rounded p-3 w-full text-sm"
        rows={12}
        placeholder="Paste your article draft here…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          className="bg-black text-white px-4 py-2 text-sm rounded"
          onClick={analyze}
        >
          Critique Draft
        </button>

        <button
          className="bg-neutral-800 text-white px-4 py-2 text-sm rounded"
          onClick={regenerate}
        >
          Rewrite Neutrally
        </button>
      </div>

      {critique && (
        <div className="bg-neutral-50 border rounded p-4">
          <h3 className="font-serif text-xl mb-2">Solace Critique</h3>
          <p className="whitespace-pre-wrap text-sm">{critique}</p>
        </div>
      )}

      {rewrite && (
        <div className="bg-neutral-50 border rounded p-4">
          <h3 className="font-serif text-xl mb-2">Neutral Rewrite</h3>
          <p className="whitespace-pre-wrap text-sm">{rewrite}</p>
        </div>
      )}
    </section>
  );
}
