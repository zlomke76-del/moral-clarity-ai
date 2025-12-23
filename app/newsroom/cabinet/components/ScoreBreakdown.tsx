"use client";

import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview | null;
};

export default function ScoreBreakdown({ outlet }: Props) {
  // ─────────────────────────────────────────────
  // INSTRUCTIONAL PLACEHOLDER (NO SELECTION)
  // ─────────────────────────────────────────────
  if (!outlet) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-5 text-sm text-neutral-400">
        <div className="mb-2 font-medium text-neutral-200">
          Outlet score breakdown
        </div>
        <p>
          Select an outlet from the leaderboard to view its{" "}
          <span className="text-neutral-200">lifetime Predictability Index</span>{" "}
          and the bias pressures that influence it.
        </p>
        <p className="mt-2 text-[11px] text-neutral-500">
          Scores are lifetime-based and mature naturally as more stories are
          analyzed.
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // AUTHORITATIVE LIFETIME VALUES
  // (from outlet_bias_pi_overview)
  // ─────────────────────────────────────────────
  const piPercent = outlet.avg_pi * 100;
  const biasIntent = outlet.avg_bias_intent;

  const components = [
    { label: "Language", value: outlet.bias_language },
    { label: "Source", value: outlet.bias_source },
    { label: "Framing", value: outlet.bias_framing },
    { label: "Context", value: outlet.bias_context },
  ];

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">
            {outlet.canonical_outlet}
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Lifetime scoring based on{" "}
            <span className="font-medium text-neutral-200">
              {outlet.total_stories}
            </span>{" "}
            stories across{" "}
            <span className="font-medium text-neutral-200">
              {outlet.days_active}
            </span>{" "}
            day{outlet.days_active === 1 ? "" : "s"}.
          </p>
          {outlet.last_story_day && (
            <p className="mt-1 text-[11px] text-neutral-500">
              Last scored: {outlet.last_story_day}
            </p>
          )}
        </div>

        {/* PI BLOCK */}
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
            Predictability Index
          </div>
          <div className="font-mono text-3xl text-emerald-300">
            {piPercent.toFixed(2)}%
          </div>
          <div className="text-[11px] text-neutral-400">
            Lifetime · higher = more stable storytelling
          </div>
        </div>
      </div>

      {/* BIAS INTENT (OVERALL) */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] text-neutral-400">
          <span>Overall bias pressure</span>
          <span className="font-mono text-neutral-200">
            {biasIntent.toFixed(2)} / 3.00
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-900">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400"
            style={{
              width: `${Math.max(
                4,
                Math.min((biasIntent / 3) * 100, 100)
              ).toFixed(1)}%`,
            }}
          />
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          Bias is not treated as acceptable disagreement. It represents
          directional pressure — left or right — that makes outcomes more
          predictable regardless of factual accuracy.
        </p>
      </div>

      {/* COMPONENT BREAKDOWN */}
      <div className="grid gap-3 sm:grid-cols-2">
        {components.map((c) => (
          <BiasBar key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      {/* EXPLAINABLE MATH */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 text-[11px] text-neutral-400 space-y-2">
        <div className="font-medium text-neutral-200">
          How the score is derived
        </div>
        <p>
          • Bias pressure is measured across language, sourcing, framing, and
          missing context.
        </p>
        <p>
          • Component scores are weighted and averaged into a single lifetime
          bias pressure value.
        </p>
        <p>
          • The Predictability Index reflects how consistently stories follow
          those pressures over time.
        </p>
        <p className="text-neutral-500">
          This cabinet does not decide who is right or wrong — it measures how
          stories are told and how predictable that telling becomes.
        </p>
      </div>
    </div>
  );
}

function BiasBar({ label, value }: { label: string; value: number }) {
  const width = Math.max(4, Math.min((value / 3) * 100, 100));

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span>{label}</span>
        <span className="font-mono text-neutral-200">
          {value.toFixed(2)} / 3.00
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
