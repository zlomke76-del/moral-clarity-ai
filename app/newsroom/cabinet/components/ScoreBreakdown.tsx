"use client";

import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview | null;
};

export default function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm text-neutral-400">
        Select an outlet from the leaderboard to see how its Predictability Index
        and bias components are calculated.
      </div>
    );
  }

  /* =========================================================
     AUTHORITATIVE VALUES — outlet_bias_pi_overview
     ========================================================= */

  // Predictability Index (0–1, lifetime)
  const piRaw = outlet.avg_pi;
  const piPercent = piRaw * 100;

  // Bias intent (0–3, lifetime)
  const biasIntent = outlet.avg_bias_intent;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 space-y-5">
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">
            {outlet.canonical_outlet}
          </h2>

          <p className="mt-1 text-xs text-neutral-400">
            Lifetime scoring based on{" "}
            <span className="font-medium">{outlet.total_stories}</span> analyzed
            stories.
          </p>

          {outlet.last_story_day && (
            <p className="mt-1 text-[11px] text-neutral-500">
              Last scored: {outlet.last_story_day}
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
            Predictability Index
          </div>
          <div className="font-mono text-3xl text-emerald-300">
            {piPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* ================= PI EXPLANATION ================= */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 text-xs text-neutral-400">
        <p>
          <strong>Predictability Index (PI)</strong> measures the stability and
          neutrality of storytelling.
        </p>
        <p className="mt-1">
          PI = 100% − normalized bias contribution across language, sourcing,
          framing, and missing context.
        </p>
      </div>

      {/* ================= BIAS INTENT ================= */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-neutral-400">
          <span>Bias intent (overall)</span>
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
      </div>

      {/* ================= COMPONENT BREAKDOWN ================= */}
      <div className="grid gap-3 sm:grid-cols-2">
        <BiasBar label="Language" value={outlet.bias_language} />
        <BiasBar label="Source" value={outlet.bias_source} />
        <BiasBar label="Framing" value={outlet.bias_framing} />
        <BiasBar label="Context" value={outlet.bias_context} />
      </div>

      {/* ================= FOOTNOTE ================= */}
      <p className="text-[11px] text-neutral-500 leading-relaxed">
        This system does not judge truth. It measures how stories are constructed
        — wording, sourcing, framing, and omissions — and converts that into a
        stable, auditable signal. Higher PI indicates more consistent,
        lower-volatility reporting behavior.
      </p>
    </div>
  );
}

/* ================= BIAS BAR ================= */

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
