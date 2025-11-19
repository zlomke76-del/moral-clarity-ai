// app/newsroom/components/AnalystPanel.tsx
"use client";

import { useState } from "react";

export default function AnalystPanel() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);

  async function analyze() {
    if (!domain.trim()) return;
    const res = await fetch("/api/solace-news/analysis", {
      method: "POST",
      body: JSON.stringify({ domain })
    });
    const data = await res.json();
    setResult(data);
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-serif">Outlet Bias Analyst</h2>

      <input
        className="border rounded p-3 w-full text-sm"
        placeholder="Enter news domain (e.g. foxnews.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />

      <button
        className="bg-neutral-900 text-white px-4 py-2 text-sm rounded"
        onClick={analyze}
      >
        Analyze Outlet
      </button>

      {result && (
        <div className="bg-neutral-50 border rounded p-4">
          <h3 className="font-serif text-xl mb-2">Bias Summary</h3>
          <pre className="whitespace-pre-wrap text-sm mb-4">
            {result.bias_text}
          </pre>

          <h4 className="font-semibold mb-1">Bias Scores</h4>
          <pre className="text-xs">
            {JSON.stringify(result.bias_scores, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}
