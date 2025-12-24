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
  const sorted = [...outlets].sort((a, b) => b.avg_pi - a.avg_pi);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {sorted.map((o, i) => (
        <OutletCard
          key={o.canonical_outlet}
          outlet={o}
          rank={i + 1}
          selected={o.canonical_outlet === selectedCanonical}
          onSelect={() => onSelect(o.canonical_outlet)}
        />
      ))}
    </div>
  );
}
