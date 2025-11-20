// app/newsroom/cabinet/components/OutletDetailModal.tsx
"use client";

import { useEffect } from "react";
import type { OutletDetailData, OutletTrendPoint } from "../types";
import { OutletLogo } from "./OutletLogo";

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
  // No outlet selected → no modal
  if (!outlet) return null;

  // ESC key to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

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

  const lifetimePiPct = lifetimePi * 100;
  const ninetyPiPct =
    typeof ninetyDayPi === "number" ? ninetyDayPi * 100 : null;

  const trendGlyph =
    trendDirection === "up"
      ? "▲"
      : trendDirection === "down"
      ? "▼"
      : "⟷";

  const trendText =
    trendDirection === "up"
      ? "Trending toward more neutral coverage (last 90 days)."
      : trendDirection === "down"
      ? "Trending toward stronger bias (last 90 days)."
      : "Relatively stable bias pattern over the last 90 days.";

  const hasNinetyDay = typeof ninetyDayPi === "number";

  const formattedLastScored = lastScoredAt || "—";

  // Backdrop click to close
  function handleBackdropClick() {
    onClose();
  }

  function handleCardClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/40 to-black/80 backdrop-blur-sm px-4 py-6"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-2xl"
        onClick={handleCardClick}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-neutral-700/70 bg-neutral-900/80 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
        >
          Esc
        </button>

        {/* Header: logo + name + tier + lifetime PI */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <OutletLogo name={display_name} domain={canonical_outlet} />
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Outlet
              </div>
              <div className="text-lg font-semibold text-neutral-50">
                {display_name}
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-400">
                {canonical_outlet}
              </div>
              <div className="mt-1 text-[11px] text-neutral-400">
                {storiesAnalyzed} stories analyzed · PI based on lifetime.
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {tierLabel && (
              <span
                className={[
                  "inline-flex items-center rounded-full border px-3 py-[3px]",
                  "text-[10px] font-medium uppercase tracking-[0.16em]",
                  tierClass(tierLabel),
                ].join(" ")}
              >
                {tierLabel}
              </span>
            )}
            <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
              Lifetime PI
            </div>
            <div className="text-2xl font-semibold text-emerald-300">
              {lifetimePiPct.toFixed(1)}
            </div>
            <div className="text-[11px] text-neutral-400">
              Bias intent{" "}
              <span className="font-mono text-neutral-100">
                {lifetimeBiasIntent.toFixed(2)}
              </span>{" "}
              (0 = neutral, 3 = strong bias)
            </div>
          </div>
        </div>

        {/* Body: bias profile + 90-day trend */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Bias profile */}
          <div className="space-y-3 text-sm text-neutral-200">
            <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              Bias profile (0–3, lower is more neutral)
            </div>
            <div className="space-y-1.5">
              <MetricRow
                label="Bias intent"
                value={lifetimeBiasIntent}
                max={3}
                emphasize
              />
              <MetricRow label="Language" value={lifetimeLanguage} max={3} />
              <MetricRow label="Source" value={lifetimeSource} max={3} />
              <MetricRow label="Framing" value={lifetimeFraming} max={3} />
              <MetricRow label="Context" value={lifetimeContext} max={3} />
            </div>
            <div className="mt-2 text-[11px] text-neutral-400">
              Last scored: {formattedLastScored}
            </div>
          </div>

          {/* 90-day trend + mini chart */}
          <div className="space-y-3 text-sm text-neutral-200">
            <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              90-day trend
            </div>

            {hasNinetyDay ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-neutral-50">
                    {ninetyPiPct?.toFixed(1)}
                  </span>
                  <span className="text-xs text-neutral-400">
                    PI (last 90 days)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <span
                    className={
                      trendDirection === "up"
                        ? "text-emerald-300"
                        : trendDirection === "down"
                        ? "text-rose-300"
                        : "text-neutral-300"
                    }
                  >
                    {trendGlyph}
                  </span>
                  <span>{trendText}</span>
                </div>
                {typeof ninetyDayBiasIntent === "number" && (
                  <div className="text-[11px] text-neutral-400">
                    90-day bias intent{" "}
                    <span className="font-mono text-neutral-100">
                      {ninetyDayBiasIntent.toFixed(2)}
                    </span>
                    .
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-neutral-400">
                Not enough recent stories to compute a 90-day trend yet.
              </div>
            )}

            {/* Daily PI mini chart */}
            <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
              <div className="mb-2 text-[11px] text-neutral-400">
                Daily PI snapshots (recent days)
              </div>
              {trends && trends.length > 0 ? (
                <div className="flex h-16 items-end gap-[2px]">
                  {trends.map((p) => {
                    const pi = p.avg_pi_score ?? 0;
                    const clamped = Math.max(0, Math.min(pi, 1));
                    const height = 12 + clamped * 60;
                    return (
                      <div
                        key={p.story_day}
                        className="flex-1 rounded-sm bg-emerald-400/80"
                        style={{ height: `${height}px` }}
                        title={`${p.story_day}: PI ${pi.toFixed(3)}`}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-[11px] text-neutral-400">
                  No recent daily snapshots yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer explainer */}
        <div className="mt-6 border-t border-neutral-800 pt-4 text-[11px] text-neutral-400">
          This cabinet doesn&apos;t decide who is right or wrong. It measures{" "}
          <span className="font-medium">how stories are told</span> — language,
          sourcing, framing, and missing context — and turns that into a
          predictable, auditable signal. Higher PI means more stable, neutral
          storytelling.
        </div>
      </div>
    </div>
  );
}

type MetricRowProps = {
  label: string;
  value: number;
  max: number;
  emphasize?: boolean;
};

function MetricRow({ label, value, max, emphasize }: MetricRowProps) {
  const clamped = Math.max(0, Math.min(value ?? 0, max));
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={
          emphasize
            ? "text-xs font-semibold text-neutral-100"
            : "text-xs text-neutral-300"
        }
      >
        {label}
      </span>
      <span className="font-mono text-xs text-neutral-100">
        {clamped.toFixed(2)} / {max.toFixed(2)}
      </span>
    </div>
  );
}

function tierClass(tierLabel: string): string {
  if (tierLabel === "Golden Anchor") {
    return "bg-emerald-500/10 text-emerald-300 border-emerald-400/50";
  }
  if (tierLabel === "High Bias Watchlist") {
    return "bg-amber-500/10 text-amber-300 border-amber-400/50";
  }
  return "bg-sky-500/10 text-sky-300 border-sky-400/50";
}
