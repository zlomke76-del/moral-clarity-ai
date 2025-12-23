"use client";

import type { OutletDetailData } from "../types";

type Props = {
  outlet: OutletDetailData | null;
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

  const {
    canonical_outlet,
    storiesAnalyzed,
    lifetimePi,
    lifetimeBiasIntent,
    lifetimeLanguage,
    lifetimeSource,
    lifetimeFraming,
    lifetimeContext,
    lastScoredAt,
  } = outlet;

  const piDisplay = (lifetimePi * 100).toFixed(2);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">
            {canonical_outlet}
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Predictability Index and bias components are averaged over{" "}
            <span className="font-medium">{storiesAnalyzed}</span> scored stories.
          </p>
          {lastScoredAt && (
            <p className="mt-1 text-[11px] text-neutral-500">
              Last scored: {lastScoredAt}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
            Predictability Index
          </div>
          <div className="font-mono text-2xl text-emerald-300">
            {piDisplay}
          </div>
          <div className="text-[11px] text-neutral-400">
            PI scale: 0–100
          </div>
        </div>
      </div>

      {/* BIAS INTENT */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-neutral-400">
          <span>Bias intent (overall)</span>
          <span className="font-mono text-neutral-200">
            {lifetimeBiasIntent.toFixed(2)} / 3.00
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-900">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400"
            style={{
              width: `${Math.max(
                4,
                Math.min((lifetimeBiasIntent / 3) * 100, 100)
              ).toFixed(1)}%`,
            }}
          />
        </div>
      </div>

      {/* COMPONENT BARS */}
      <div className="grid gap-3 sm:grid-cols-2">
        <BiasBar label="Language" value={lifetimeLanguage} />
        <BiasBar label="Source" value={lifetimeSource} />
        <BiasBar label="Framing" value={lifetimeFraming} />
        <BiasBar label="Context" value={lifetimeContext} />
      </div>

      <p className="text-[11px] text-neutral-500">
        This cabinet does <span className="font-medium">not judge truth</span>.
        It measures how stories are told — language, sourcing, framing, and
        missing context — and converts that into a stable, auditable signal.
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
