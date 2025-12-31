"use client";

import type { OutletOverview } from "../types";
import OutletCard from "./OutletCard";

type RankedOutlet = OutletOverview & { rank: number };

type Props = {
  outlets: RankedOutlet[];
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
      {outlets.map((o) => {
        let badge: "golden" | "neutral" | "watchlist" = "neutral";
        if (o.rank <= 3) badge = "golden";
        else if (o.rank > outlets.length - 3) badge = "watchlist";
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
    </div>
  );
}
