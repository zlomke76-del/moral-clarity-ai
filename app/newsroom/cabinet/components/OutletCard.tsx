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
  // PI displayed on a 0–100 scale, one decimal place (e.g. 82.7)
  const piDisplay = (outlet.avg_pi * 100).toFixed(1);
  const stories = outlet.total_stories;

  const tierLabel =
    badge === "golden"
      ? "Golden Anchor"
      : badge === "watchlist"
      ? "High Bias Watchlist"
      : badge === "neutral"
      ? "Neutral Band"
      : "";

  const borderClass = selected
    ? "border-emerald-400/70 shadow-[0_0_0_1px_rgba(16,185,129,.6)]"
    : "border-neutral-800";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full text-left rounded-xl border px-4 py-3 transition",
        "bg-neutral-950/70 hover:bg-neutral-900/80",
        borderClass,
      ].join(" ")}
      aria-label={`Select outlet ${outlet.canonical_outlet}`} // Accessibility improvement
      role="button" // Added role for accessibility
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: rank + logo + outlet */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-neutral-200">
            #{rank}
          </div>
          <OutletLogo
            domain={outlet.canonical_outlet}
            name={outlet.canonical_outlet}
          />
          <div>
            <div className="text-sm font-semibold text-neutral-100">
              {outlet.canonical_outlet}
            </div>
            <div className="mt-0.5 text-[11px] text-neutral-400">
              {stories} stories analyzed · PI based on lifetime
            </div>
          </div>
        </div>

        {/* Right: PI + tier label */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-2">
            <div className="text-xs text-neutral-400">PI</div>
            <div className="font-mono text-lg text-neutral-50">
              {piDisplay}
            </div>
          </div>
          {tierLabel && (
            <div className="text-[11px] font-medium text-emerald-300">
              {tierLabel}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
