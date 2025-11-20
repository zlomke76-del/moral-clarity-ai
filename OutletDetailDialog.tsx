// app/newsroom/cabinet/components/OutletDetailDialog.tsx
"use client";

import * as React from "react";
import type { OutletTrendPoint } from "../types";
import { OutletLogo } from "./OutletLogo";

type TrendDirection = "up" | "down" | "flat";

export type OutletDetailData = {
  canonical_outlet: string;
  display_name?: string;
  tierLabel: string; // e.g. "Golden Anchor"
  storiesAnalyzed: number;

  // lifetime scores (0–1 PI, 0–3 bias)
  lifetimePi: number;
  lifetimeBiasIntent: number;
  lifetimeLanguage: number;
  lifetimeSource: number;
  lifetimeFraming: number;
  lifetimeContext: number;

  lastScoredAt: string; // ISO or YYYY-MM-DD

  // optional 90-day trend
  ninetyDayPi?: number | null;
  trendDirection?: TrendDirection;
};

type OutletDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outlet: OutletDetailData | null;
  trends: OutletTrendPoint[] | null;
};

export function OutletDetailDialog({
  open,
  onOpenChange,
  outlet,
  trends,
}: OutletDetailDialogProps) {
  if (!open || !outlet) return null;

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
    trendDirection,
  } = outlet;

  const name = display_name || canonical_outlet;
  const lifetimePiPct = lifetimePi * 100;
  const ninetyDayPiPct =
    typeof ninetyDayPi === "number" ? ninetyDayPi * 100 : null;

  const formattedLastScored = lastScoredAt
    ? new Date(lastScoredAt).toISOString().slice(0, 10)
    : "—";

  const trendLabel =
    trendDirection === "up"
      ? "Trending toward more neutral coverage (last 90 days)."
      : trendDirection === "down"
      ? "Trending toward stronger bias (last 90 days)."
      : "Relatively stable bias pattern over the last 90 days.";

  const trendGlyph =
    trendDirection === "up" ? "▲" : trendDirection === "down" ? "▼" : "⟷";

  function close() {
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 rounded-full border border-neutral-700/70 bg-neutral-900/80 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
        >
          Esc
        </button>

        {/* Header: logo + name + PI + tier */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <OutletLogo domain={canonical_outlet} />
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Outlet
              </div>
              <div className="text-lg font-semibold text-neutral-50">
                {name}
              </div>
              <div className="mt-1 text-xs text-neutral-400">
                {storiesAnalyzed} stories analyzed · PI based on lifetime.
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
              Lifetime PI
            </div>
            <div className="text-2xl font-semibold text-emerald-300">
              {lifetimePiPct.toFixed(1)}
            </div>
            <div className="text-[11px] text-neutral-400">
              {tierLabel}
            </div>
          </div>
        </div>

        {/* Body: bias metrics + 90-day trend */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Bias metrics */}
          <div className="space-y-3 text-sm text-neutral-200">
            <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              Bias profile (0–3, lower is more neutral)
            </div>
            <div className="space-y-1.5">
              <MetricRow label="Bias intent" value={lifetimeBiasIntent} />
              <MetricRow
                label="Language"
                value={lifetimeLanguage}
                max={3}
                showMax
              />
              <MetricRow
                label="Source"
                value={lifetimeSource}
                max={3}
                showMax
              />
              <MetricRow
                label="Framing"
                value={lifetimeFraming}
                max={3}
                showMax
              />
              <MetricRow
                label="Context"
                value={lifetimeContext}
                max={3}
                showMax
              />
            </div>

            <div className="mt-3 text-xs text-neutral-400">
              Last scored: {formattedLastScored}
            </div>
          </div>

          {/* 90-day trend */}
          <div className="space-y-2 text-sm text-neutral-200">
            <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              90-day trend
            </div>

            {ninetyDayPiPct !== null ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-neutral-50">
                    {ninetyDayPiPct.toFixed(1)}
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
                  <span>{trendLabel}</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-neutral-400">
                Not enough recent stories to compute a 90-day trend yet.
              </div>
            )}

            {/* Optional hook for future: small inline sparkline */}
            {trends && trends.length > 0 && (
              <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
                <div className="text-[11px] text-neutral-400 mb-2">
                  Daily PI snapshots (recent days)
                </div>
                <div className="flex h-16 items-end gap-[2px]">
                  {trends.map((p) => (
                    <div
                      key={p.story_day}
                      className="flex-1 rounded-sm bg-emerald-400/70"
                      style={{
                        height: `${(p.avg_pi_score ?? 0) * 60}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer / explainer */}
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
  max?: number;
  showMax?: boolean;
};

function MetricRow({ label, value, max = 3, showMax }: MetricRowProps) {
  const clamped = Math.max(0, Math.min(value ?? 0, max));
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-neutral-300">{label}</span>
      <span className="font-mono text-xs text-neutral-100">
        {clamped.toFixed(2)}
        {showMax ? ` / ${max.toFixed(2)}` : null}
      </span>
    </div>
  );
}
