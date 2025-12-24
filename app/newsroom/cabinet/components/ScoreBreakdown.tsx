// app/newsroom/cabinet/components/ScoreBreakdown.tsx
"use client";

import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview | null;
};

export default function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
        Select an outlet to view score breakdown.
      </div>
    );
  }

  // ================= PRIMARY SCORE =================
  const piRaw = outlet.avg_pi;        // 0–1
  const piPercent = piRaw * 100;      // %

  // ================= BIAS AXES =================
  const bias = [
    { label: "Intent", value: outlet.avg_bias_intent },
    { label: "Language", value: outlet.avg_bias_language },
    { label: "Source", value: outlet.avg_bias_source },
    { label: "Framing", value: outlet.avg_bias_framing },
    { label: "Context", value: outlet.avg_bias_context },
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-6">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">
        Score Breakdown
      </h2>

      {/* ===== PI SCORE ===== */}
      <div className="mb-6">
        <div className="text-sm text-neutral-400">Perspective Integrity (PI)</div>
        <div className="mt-1 text-3xl font-bold">
          {piPercent.toFixed(1)}%
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Average across all analyzed stories
        </div>
      </div>

      {/* ===== BIAS AXES ===== */}
      <div className="space-y-3">
        {bias.map((b) => (
          <div key={b.label} className="flex items-center justify-between">
            <span className="text-sm text-neutral-300">{b.label}</span>
            <span className="text-sm font-mono">
              {b.value.toFixed(2)} / 3.00
            </span>
          </div>
        ))}
      </div>

      {/* ===== INSTRUCTIONAL PLACEHOLDER ===== */}
      <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 text-xs text-neutral-400">
        Bias scores reflect directional pressure, not correctness.
        Lower variance indicates tighter editorial constraint.
      </div>
    </div>
  );
}
