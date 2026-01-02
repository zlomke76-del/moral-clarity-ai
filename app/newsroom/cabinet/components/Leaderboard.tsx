"use client";

import type { OutletOverview } from "../types";
import OutletCard from "./OutletCard";

/**
 * RankedOutlet
 * Enforces that rank is global, stable, and precomputed upstream.
 * This component must never infer rank or category from slice position.
 */
type RankedOutlet = OutletOverview & { rank: number };

type Props = {
  outlets: RankedOutlet[]; // Slice of globally-ranked outlets
  selectedOutlet: string | null;
  onSelect: (outlet: string) => void;
};

/**
 * Badge classification is purely structural.
 * No moral, qualitative, or evaluative meaning is implied.
 *
 * Definitions (global, invariant):
 * - rank 1–3   → "golden"
 * - rank N-2–N → "watchlist"
 * - all others → "neutral"
 *
 * NOTE:
 * This component does not know N (total outlets),
 * so watchlist assignment must be passed implicitly
 * by slice membership OR enforced upstream.
 *
 * To remain canon-safe, this component only assigns:
 * - golden (rank <= 3)
 * - neutral (default)
 *
 * Watchlist is assigned ONLY when explicitly rendered
 * in the Watch List slice by the parent.
 */
export default function Leaderboard({
  outlets,
  selectedOutlet,
  onSelect,
}: Props) {
  if (outlets.length === 0) {
    return (
      <div className="col-span-full text-sm text-neutral-400 p-4">
        No outlets qualify (minimum 5 stories analyzed).
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {outlets.map((o) => {
        /**
         * Badge logic — minimal, explicit, non-inferential.
         *
         * Golden is global and absolute.
         * Watchlist designation is handled by slice context upstream.
         */
        let badge: "golden" | "neutral" | "watchlist" = "neutral";

        if (o.rank <= 3) {
          badge = "golden";
        }

        return (
          <OutletCard
            key={o.outlet}
            outlet={o}
            rank={o.rank} // Global rank only
            selected={o.outlet === selectedOutlet}
            badge={badge}
            onSelect={() => onSelect(o.outlet)}
          />
        );
      })}
    </div>
  );
}
