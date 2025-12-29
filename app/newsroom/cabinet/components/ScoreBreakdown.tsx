"use client";

/* =========================
   DEDICATED BREAKDOWN TYPE
   ========================= */

export type OutletBreakdown = {
  outlet: string;
  total_stories: number;
  days_active: number;
  last_story_day: string | null;

  avg_pi_weighted: number | null;
  avg_bias_intent_weighted: number | null;
  avg_bias_language_weighted: number | null;
  avg_bias_source_weighted: number | null;
  avg_bias_framing_weighted: number | null;
  avg_bias_context_weighted: number | null;
};

type Props = {
  outlet: OutletBreakdown | null;
};

/* =========================
   DIMENSION EXPLANATIONS
   ========================= */

const DIMENSION_EXPLANATIONS: Record<string, string> = {
  Intent:
    "Measures whether reporting is informational or attempts to persuade the reader.",
  Language:
    "Evaluates emotionally loaded, biased, or suggestive wording.",
  Source:
    "Assesses sourcing quality, attribution clarity, and consistency.",
  Framing:
    "Examines how facts are emphasized, omitted, or positioned.",
  Context:
    "Checks whether sufficient background is provided for accurate understanding.",
};

export default function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm text-neutral-400">
        Select an outlet from the leaderboard to inspect how its score is computed.
      </div>
    );
  }

  const piRaw =
    typeof outlet.avg_pi_weighted === "number"
      ? outlet.avg_pi_weighted
      : null;

  const piPercent =
    typeof piRaw === "number" ? piRaw * 100 : null;

  const bias = [
    { label: "Intent", value: outlet.avg_bias_intent_weighted ?? undefined },
    { label: "Language", value: outlet.avg_bias_language_weighted ?? undefined },
    { label: "Source", value: outlet.avg_bias_source_weighted ?? undefined },
    { label: "Framing", value: outlet.avg_bias_framing_weighted ?? undefined },
    { label: "Context", value: outlet.avg_bias_context_weighted ?? undefined },
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 space-y-6">

      {/* ================= IDENTITY & SCOPE ================= */}
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
            Predictability Index
          </div>
          <div className="font-mono text-2xl text-emerald-300">
            {piPercent !== null ? `${piPercent.toFixed(2)}%` : "—"}
          </div>
        </div>
      </div>

      {/* ================= PI EXPLANATION ================= */}
      <div className="text-xs text-neutral-400">
        Predictability Index is computed from a weighted combination of the
        following dimensions.
      </div>

      {/* ================= DIMENSION BREAKDOWN ================= */}
      <div className="space-y-4">
        {bias.map((b) => (
          <BiasBar
            key={b.label}
            label={b.label}
            description={DIMENSION_EXPLANATIONS[b.label]}
            value={b.value}
          />
        ))}
      </div>
    </div>
  );
}

function BiasBar({
  label,
  description,
  value,
}: {
  label: string;
  description: string;
  value?: number;
}) {
  const hasValue = typeof value === "number";
  const safe = hasValue ? value : 0;
  const width = Math.max(4, Math.min((safe / 3) * 100, 100));

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span className="font-medium text-neutral-200">{label}</span>
        <span className="font-mono text-neutral-200">
          {hasValue ? safe.toFixed(2) : "—"} / 3.00
        </span>
      </div>

      <p className="text-[11px] text-neutral-500 leading-snug">
        {description}
      </p>

      <div className="h-1.5 w-full rounded-full bg-neutral-900">
        <div
          className="h-full rounded-full bg-neutral-200"
          style={{ width: `${width.toFixed(1)}%` }}
        />
      </div>
    </div>
  );
}
