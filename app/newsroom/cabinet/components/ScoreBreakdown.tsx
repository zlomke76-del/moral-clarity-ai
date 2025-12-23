// app/newsroom/cabinet/components/ScoreBreakdown.tsx
"use client";

import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview | null;
};

export default function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm text-neutral-400">
        Select an outlet from the leaderboard to see how its Predictability
        Index and bias components break down.
      </div>
    );
  }

  const pi = outlet.avg_pi;
  const biasIntent = outlet.avg_bias_intent;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">
            {outlet.canonical_outlet}
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Predictability Index and bias components are averaged over{" "}
            <span className="font-medium">{outlet.total_stories}</span> scored
            stories across{" "}
            <span className="font-medium">{outlet.days_active}</span>{" "}
            day{outlet.days_active === 1 ? "" : "s"}.
          </p>
          {outlet.last_story_day && (
            <p className="mt-1 text-[11px] text-neutral-500">
              Last scored: {outlet.last_story_day}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
            Predictability Index
          </div>
          <div className="font-mono text-2xl text-emerald-300">
            {pi.toFixed(3)}
          </div>
          <div className="text-[11px] text-neutral-400">
            Bias intent:{" "}
            <span className="font-mono text-neutral-100">
              {biasIntent.toFixed(2)}
            </span>{" "}
            (0 = neutral, 3 = strong bias)
          </div>
        </div>
      </div>

      {/* Bias intent bar */}
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

      {/* Four component bars */}
      <div className="grid gap-3 sm:grid-cols-2">
        <BiasBar label="Language" value={outlet.bias_language} />
        <BiasBar label="Source" value={outlet.bias_source} />
        <BiasBar label="Framing" value={outlet.bias_framing} />
        <BiasBar label="Context" value={outlet.bias_context} />
      </div>

      <p className="text-[11px] text-neutral-500">
        This cabinet does not decide who is right or wrong. It measures{" "}
        <span className="font-medium">how stories are told</span> — language,
        sourcing, framing, and missing context — and turns that into a
        predictable, auditable signal.
      </p>
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
