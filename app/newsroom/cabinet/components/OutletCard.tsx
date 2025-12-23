"use client";

import OutletLogo from "./OutletLogo";
import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview;
  rank: number;
  selected: boolean;
  badge: "golden" | "neutral" | "watchlist";
  onSelect: () => void;
};

export default function OutletCard({
  outlet,
  rank,
  selected,
  badge,
  onSelect,
}: Props) {
  // 🔒 CANONICAL PI DISPLAY (WEIGHTED, LIFETIME)
  const piDisplay = (outlet.avg_pi_weighted * 100).toFixed(2);

  const base =
    "rounded-lg border px-4 py-3 text-left transition cursor-pointer";
  const selectedStyle =
    badge === "golden"
      ? "border-amber-400/60 bg-amber-400/10"
      : "border-neutral-700 bg-neutral-900";
  const unselectedStyle =
    "border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900";

  return (
    <button
      className={`${base} ${selected ? selectedStyle : unselectedStyle}`}
      onClick={onSelect}
    >
      <div className="flex flex-col items-start gap-1">
        <div className="text-xs text-neutral-400">#{rank}</div>

        <OutletLogo domain={outlet.canonical_outlet} />

        <div className="text-sm font-medium text-neutral-100">
          {outlet.canonical_outlet.replace(".com", "").toUpperCase()}
        </div>

        <div className="text-xs text-amber-300">
          PI {piDisplay}
        </div>

        <div className="text-xs text-neutral-400">
          {outlet.total_stories} stories analyzed
        </div>
      </div>
    </button>
  );
}
