"use client";

import type { OutletOverview } from "../types";
import OutletCard from "./OutletCard";

type RankedOutlet = OutletOverview & { rank: number };

type Props = {
  outlets: RankedOutlet[]; // Enforce: rank is always present and global
  selectedOutlet: string | null;
  onSelect: (outlet: string) => void;
};

export default function Leaderboard({
  outlets,
  selectedOutlet,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {outlets.length === 0 ? (
        <div className="col-span-full text-sm text-neutral-400 p-4">
          No outlets qualify (minimum 5 stories analyzed).
        </div>
      ) : (
        outlets.map((o) => {
          // Badge logic can use o.rank globally if necessary,
          // or you can pass in a badge prop from the parent slice if it must be invariant
          let badge: "golden" | "neutral" | "watchlist" = "neutral";
          // Only top-3 global: "golden"
          if (o.rank <= 3) badge = "golden";
          // Only bottom-3 global: "watchlist" (works for golden/neutral/watchlist in any slice)
          else if (o.rank > outlets[outlets.length - 1].rank - 2) badge = "watchlist";
          // for neutral: everything else

          return (
            <OutletCard
              key={o.outlet}
              outlet={o}
              rank={o.rank} // << TRUE global rank!
              selected={o.outlet === selectedOutlet}
              badge={badge}
              onSelect={() => onSelect(o.outlet)}
            />
          );
        })
      )}
    </div>
  );
}
