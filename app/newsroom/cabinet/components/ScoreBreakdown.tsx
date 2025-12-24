"use client";

import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview | null;
};

export default function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm text-neutral-400">
        Select an outlet from the leaderboard to inspect how its score is computed.
      </div>
    );
  }

  /* ================= CANONICAL VALUES (WEIGHTED) ================= */

  const piRaw: number | null =
    typeof outlet.avg_pi_weighted === "number"
      ? outlet.avg_pi_weighted
      : null;

  const piPercent: number | null =
    typeof piRaw === "number" ? piRaw * 100 : null;

  const bias = [
    { label: "Intent", value: outlet.avg_bias_intent_weighted },
    { label: "Language", value: outlet.avg_bias_language_weighted },
    { label: "Source", value: outlet.avg_bias_source_weighted },
    { label: "Framing", value: outlet.avg_bias_framing_weighted },
    { label: "Context", value: outlet.avg_bias_context_weighted },
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 space-y-5">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">
            {outlet.outlet}
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Lifetime aggregation across{" "}
            <span className="font-medium">{outlet.total_stories}</span> stories
            over{" "}
            <span className="font-medium">{outlet.days_active}</span> days.
          </p>
          {outlet.last_story_day && (
            <p className="mt-1 text-[11px] text-neutral-500">
              Last scored: {outlet.last_story_day}
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
            Predictability Index (Weighted)
          </div>
          <div className="font-mono text-2xl text-emerald-300">
            {piPercent !== null ? `${piPercent.toFixed(2)}%` : "—"}
          </div>
          <div className="text-[11px] text-neutral-400">
            PI = weighted lifetime story stability
          </div>
        </div>
      </div>

      {/* PI MATH */}
      <div className="rounded-lg bg-neutral-900/60 p-3 text-[11px] text-neutral-400">
        <div className="font-mono text-neutral-200">
          PI ={" "}
          {piRaw !== null ? piRaw.toFixed(4) : "—"} × 100 ={" "}
          {piPercent !== null ? `${piPercent.toFixed(2)}%` : "—"}
        </div>
        <div className="mt-1">
          Predictability measures consistency, not correctness.
        </div>
      </div>

      {/* BIAS BREAKDOWN */}
      <div className="space-y-3">
        {bias.map((b) => (
          <BiasBar key={b.label} label={b.label} value={b.value} />
        ))}
      </div>

      <p className="text-[11px] text-neutral-500 leading-relaxed">
        Bias scores represent directional pressure, not truth.
        Predictability represents structural consistency, not trust.
      </p>
    </div>
  );
}

function BiasBar({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  const hasValue = typeof value === "number";
  const safe = hasValue ? value : 0;
  const width = Math.max(4, Math.min((safe / 3) * 100, 100));

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span>{label}</span>
        <span className="font-mono text-neutral-200">
          {hasValue ? safe.toFixed(2) : "—"} / 3.00
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-neutral-900">
        <div
          className="h-full rounded-full bg-neutral-200"
          style={{ width: `${width.toFixed(1)}%` }}
        />
      </div>
    </div>
  );
}
