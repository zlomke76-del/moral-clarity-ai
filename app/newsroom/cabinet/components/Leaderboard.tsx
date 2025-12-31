"use client";

import type { OutletOverview } from "../types";
import OutletCard from "./OutletCard";

type RankedOutlet = OutletOverview & { rank: number };

type Props = {
  outlets: OutletOverview[];
  selectedOutlet: string | null;
  onSelect: (outlet: string) => void;
};

export default function Leaderboard({
  outlets,
  selectedOutlet,
  onSelect,
}: Props) {
  // Filter: Only outlets with at least 5 stories
  const filtered = outlets.filter(o => Number(o.total_stories) >= 5);

  // Sort: PI high-to-low, then alphabetically by outlet name
  const sorted = filtered
    .slice() // avoid mutating original
    .sort((a, b) => {
      const piA = typeof (a as any).avg_pi_weighted === "number"
        ? (a as any).avg_pi_weighted
        : Number((a as any).avg_pi_weighted);
      const piB = typeof (b as any).avg_pi_weighted === "number"
        ? (b as any).avg_pi_weighted
        : Number((b as any).avg_pi_weighted);
      if (piB !== piA) return piB - piA;
      return a.outlet.localeCompare(b.outlet);
    })
    .map((outlet, i) => ({ ...outlet, rank: i + 1 }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {sorted.map((o) => {
        // You can adjust badge logic as needed for "top 3", "bottom 3", etc
        let badge: "golden" | "neutral" | "watchlist" = "neutral";
        if (o.rank <= 3) badge = "golden";
        else if (o.rank > sorted.length - 3) badge = "watchlist";
        return (
          <OutletCard
            key={o.outlet}
            outlet={o}
            rank={o.rank}
            selected={o.outlet === selectedOutlet}
            badge={badge}
            onSelect={() => onSelect(o.outlet)}
          />
        );
      })}
      {sorted.length === 0 && (
        <div className="col-span-full text-sm text-neutral-400 p-4">
          No outlets qualify (minimum 5 stories analyzed).
        </div>
      )}
    </div>
  );
}
