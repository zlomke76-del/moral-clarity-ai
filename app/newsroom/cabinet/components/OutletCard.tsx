"use client";

import type { OutletOverview } from "../types";
import OutletLogo from "./OutletLogo";

type Props = {
  outlet: OutletOverview;
  rank: number;
  selected: boolean;
  badge?: "golden" | "neutral" | "watchlist";
  onSelect: () => void;
};

export default function OutletCard({
  outlet,
  rank,
  selected,
  badge,
  onSelect,
}: Props) {
  const piPercent = (outlet.avg_pi * 100).toFixed(1); // e.g. 0.827 → "82.7"

  const tierLabel =
    badge === "golden"
      ? "Golden Anchor"
      : badge === "watchlist"
      ? "High Bias Watchlist"
      : badge === "neutral"
      ? "Neutral Band"
      : "";

  const displayName = outlet.display_name ?? outlet.canonical_outlet;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full text-left rounded-xl border px-4 py-3 transition",
        "bg-neutral-950/70 hover:bg-neutral-900/80",
        selected
          ? "border-emerald-400/70 shadow-[0_0_0_1px_rgba(16,185,129,.6)]"
          : "border-neutral-800",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Rank + logo + name */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-neutral-200">
            #{rank}
          </div>
          <div className="flex items-center gap-2">
            <OutletLogo
              domain={outlet.canonical_outlet}
              name={displayName}
              className="h-7 w-7"
            />
            <div className="text-sm font-semibold text-neutral-100">
              {displayName}
            </div>
          </div>
        </div>

        {/* Metrics summary */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-neutral-400">PI</span>
            <span className="font-mono text-sm text-neutral-50">
              {piPercent}
            </span>
          </div>
          <div className="text-[11px] text-neutral-400">
            {outlet.total_stories} stories analyzed · PI based on lifetime
          </div>
          {tierLabel && (
            <span className="mt-1 inline-flex items-center rounded-full bg-neutral-900 px-2 py-[2px] text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-200">
              {tierLabel}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

