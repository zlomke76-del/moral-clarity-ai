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
  // 🔒 AUTHORITATIVE SORT — PI DESC
  const sorted = [...outlets].sort((a, b) => b.avg_pi - a.avg_pi);

  // 🔒 SIMPLE, STABLE BADGING (NO MAGIC)
  const GOLD_COUNT = 3;
  const WATCH_COUNT = 3;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {sorted.map((o, i) => {
        let badge: "golden" | "neutral" | "watchlist" = "neutral";

        if (i < GOLD_COUNT) badge = "golden";
        else if (i >= sorted.length - WATCH_COUNT) badge = "watchlist";

        return (
          <OutletCard
            key={o.canonical_outlet}
            outlet={o}
            rank={i + 1}
            selected={o.canonical_outlet === selectedCanonical}
            badge={badge}
            onSelect={() => onSelect(o.canonical_outlet)}
          />
        );
      })}
    </div>
  );
}
