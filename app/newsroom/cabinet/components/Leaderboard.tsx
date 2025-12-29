"use client";

import type { OutletOverview } from "../types";
import OutletCard from "./OutletCard";

type Props = {
  outlets: OutletOverview[];
  selectedCanonical: string | null;
  onSelect: (canonical: string) => void;
};

export default function Leaderboard({
  outlets,
  selectedCanonical,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {outlets.map((o) => {
        let badge: "golden" | "neutral" | "watchlist" = "neutral";

        if (o.rank && o.rank <= 3) badge = "golden";
        else if (o.rank && o.rank > outlets.length - 3) badge = "watchlist";

        return (
          <OutletCard
            key={o.canonical_outlet}
            outlet={o}
            rank={o.rank ?? undefined}
            selected={o.canonical_outlet === selectedCanonical}
            badge={badge}
            onSelect={() => onSelect(o.canonical_outlet)}
          />
        );
      })}
    </div>
  );
}
