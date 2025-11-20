"use client";

import type { OutletTrendPoint } from "../types";

export type TrendDirection = "up" | "down" | "flat";

export type OutletDetailData = {
  canonical_outlet: string;
  display_name: string;
  tierLabel: string;
  storiesAnalyzed: number;
  lifetimePi: number;
  lifetimeBiasIntent: number;
  lifetimeLanguage: number;
  lifetimeSource: number;
  lifetimeFraming: number;
  lifetimeContext: number;
  lastScoredAt: string | null;
  ninetyDayPi?: number | null;
  ninetyDayBiasIntent?: number | null;
  trendDirection?: TrendDirection;
};

type Props = {
  outlet: OutletDetailData | null;
  trends: OutletTrendPoint[] | null;
  onClose: () => void;
};

export default function OutletDetailModal({
  outlet,
  trends,
  onClose,
}: Props) {
  if (!outlet) return null;

  const {
    canonical_outlet,
    display_name,
    tierLabel,
    storiesAnalyzed,
    lifetimePi,
    lifetimeBiasIntent,
    lifetimeLanguage,
    lifetimeSource,
    lifetimeFraming,
    lifetimeContext,
    lastScoredAt,
    ninetyDayPi,
    ninetyDayBiasIntent,
    trendDirection,
  } = outlet;

  // Very simple copy for 90-day trend until we wire the real metric
  const hasNinetyDay = typeof ninetyDayPi === "number";
  const trendLabel = (() => {
    if (!hasNinetyDay) {
      return "Not enough recent stories to compute a 90-day trend yet.";
    }
    if (!trendDirection || trendDirection === "flat") {
      return "Predictability has been relatively stable over the last 90 days.";
    }
    if (trendDirection === "up") {
      return "Predictability has improved over the last 90 days.";
    }
    return "Predictability has weakened over the last 90 days.";
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-950 p-5 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-300 hover:bg-neutral-800"
        >
          Esc
        </button>

        {/* Header: logo + outlet name */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-neutral-900">
            <img
              src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
                canonical_outlet
              )}&sz=64`}
              alt={display_name}
              className="h-10 w-10"
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-100">
              {display_name}
            </div>
            <div className="mt-0.5 text-[11px] text-neutral-400">
              {canonical_outlet}
            </div>
          </div>
        </div>

        {/* Body copy */}
        <div className="mt-4 space-y-3 text-xs text-neutral-200">
          <div>
            <div className="font-semibold text-neutral-100">Outlet</div>
            <div className="mt-0.5 text-neutral-300">
              {canonical_outlet}
            </div>
            <div className="mt-1 text-[11px] text-neutral-400">
              {storiesAnalyzed} stories analyzed · PI based on lifetime.
            </div>
          </div>

          <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
            <div className="font-semibold text-neutral-100">
              Lifetime PI
            </div>
            <div className="font-mono text-neutral-100">
              {(lifetimePi * 100).toFixed(1)}
            </div>

            <div className="font-semibold text-neutral-100">Tier</div>
            <div className="text-neutral-200">{tierLabel}</div>

            <div className="font-semibold text-neutral-100">
              Bias profile
            </div>
            <div className="text-neutral-300">
              (0–3, lower is more neutral)
            </div>
          </div>

          <div className="space-y-0.5 font-mono text-[11px] text-neutral-300">
            <div>
              Bias intent {lifetimeBiasIntent.toFixed(2)}
            </div>
            <div>
              Language {lifetimeLanguage.toFixed(2)} / 3.00
            </div>
            <div>
              Source {lifetimeSource.toFixed(2)} / 3.00
            </div>
            <div>
              Framing {lifetimeFraming.toFixed(2)} / 3.00
            </div>
            <div>
              Context {lifetimeContext.toFixed(2)} / 3.00
            </div>
          </div>

          <div className="text-[11px] text-neutral-400">
            Last scored: {lastScoredAt ?? "—"}
          </div>

          <div className="space-y-0.5 text-[11px] text-neutral-300">
            <div className="font-semibold text-neutral-100">
              90-day trend
            </div>
            {hasNinetyDay && (
              <div className="font-mono">
                PI {ninetyDayPi?.toFixed(3)} · Bias intent{" "}
                {ninetyDayBiasIntent?.toFixed(2)}
              </div>
            )}
            <div>{trendLabel}</div>
          </div>

          {/* Daily PI snapshots */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-neutral-100">
              Daily PI snapshots (recent days)
            </div>
            {trends && trends.length > 0 ? (
              <div className="mt-1 flex max-h-24 items-end gap-1 overflow-x-auto">
                {trends.map((p) => {
                  const norm = Math.min(
                    1,
                    Math.max(0, p.avg_pi_score)
                  );
                  const height = 12 + norm * 60;
                  return (
                    <div
                      key={p.story_day}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="w-3 rounded-t-md bg-emerald-400/80"
                        style={{ height: `${height}px` }}
                        title={`${p.story_day}: PI ${p.avg_pi_score.toFixed(
                          3
                        )}`}
                      />
                      <div className="mt-1 w-6 rotate-90 whitespace-nowrap text-[9px] text-neutral-500">
                        {p.story_day.slice(5)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-[11px] text-neutral-400">
                No recent daily snapshots yet.
              </div>
            )}
          </div>

          <p className="pt-1 text-[11px] text-neutral-500">
            This cabinet doesn&apos;t decide who is right or wrong. It
            measures how stories are told — language, sourcing, framing,
            and missing context — and turns that into a predictable,
            auditable signal. Higher PI means more stable, neutral
            storytelling.
          </p>
        </div>
      </div>
    </div>
  );
}
