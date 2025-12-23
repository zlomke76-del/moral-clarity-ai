"use client";

import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview | null;
};

export default function ScoreBreakdown({ outlet }: Props) {
  // ================= PLACEHOLDER =================
  if (!outlet) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-5 text-sm text-neutral-400">
        Select an outlet from the leaderboard to see a transparent breakdown of
        how its Predictability Index is calculated.
      </div>
    );
  }

  // ================= RAW VALUES (AUTHORITATIVE) =================
  const piRaw = outlet.avg_pi_weighted; // 0–1
  const piPercent = piRaw * 100;

  const biasIntent = outlet.avg_bias_intent_weighted;
  const biasLanguage = outlet.avg_bias_language_weighted;
  const biasSource = outlet.avg_bias_source_weighted;
  const biasFraming = outlet.avg_bias_framing_weighted;
  const biasContext = outlet.avg_bias_context_weighted;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">
            {outlet.canonical_outlet}
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Scores are lifetime averages across{" "}
            <span className="font-medium">{outlet.total_stories}</span> analyzed
            stories over{" "}
            <span className="font-medium">{outlet.days_active}</span> active
            day{outlet.days_active === 1 ? "" : "s"}.
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
          <div className="text-[11px] text-neutral-400">
            Higher = more stable, neutral storytelling
          </div>
        </div>
      </div>

      {/* ================= PI EXPLANATION ================= */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-xs text-neutral-400 leading-relaxed">
        The Predictability Index (PI) measures how consistently an outlet tells
        stories over time. It does not judge correctness or ideology. It reflects
        stability across language, sourcing, framing, and contextual completeness.
      </div>

      {/* ================= BIAS INTENT ================= */}
      <MetricBar
        label="Bias Intent (overall)"
        value={biasIntent}
        max={3}
        description="Overall directional pressure detected across stories."
      />

      {/* ================= COMPONENT SCORES ================= */}
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricBar
          label="Language"
          value={biasLanguage}
          max={3}
          description="Word choice, tone, and emotional loading."
        />
        <MetricBar
          label="Source"
          value={biasSource}
          max={3}
          description="Diversity and balance of cited sources."
        />
        <MetricBar
          label="Framing"
          value={biasFraming}
          max={3}
          description="Narrative structure and emphasis."
        />
        <MetricBar
          label="Context"
          value={biasContext}
          max={3}
          description="Omission or inclusion of relevant background."
        />
      </div>

      {/* ================= FOOTNOTE ================= */}
      <p className="text-[11px] text-neutral-500 leading-relaxed">
        This breakdown shows how scores are derived. Bias here is descriptive,
        not moral. PI improves naturally as an outlet demonstrates consistent,
        transparent reporting over time.
      </p>
    </div>
  );
}

function MetricBar({
  label,
  value,
  max,
  description,
}: {
  label: string;
  value: number;
  max: number;
  description?: string;
}) {
  const width = Math.max(4, Math.min((value / max) * 100, 100));

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span>{label}</span>
        <span className="font-mono text-neutral-200">
          {value.toFixed(2)} / {max.toFixed(2)}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-neutral-900">
        <div
          className="h-full rounded-full bg-neutral-200"
          style={{ width: `${width.toFixed(1)}%` }}
        />
      </div>
      {description && (
        <div className="text-[11px] text-neutral-500">{description}</div>
      )}
    </div>
  );
}
