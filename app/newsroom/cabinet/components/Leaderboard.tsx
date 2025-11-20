"use client";

import OutletCard from "./OutletCard";

export default function Leaderboard({ outlets, onSelect, selectedOutlet }) {
  // Sort by PI descending (best → worst)
  const sorted = [...outlets].sort((a, b) => b.avg_pi - a.avg_pi);

  // TOP 3 for Golden Anchor
  const top3 = sorted.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Outlet Leaderboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((o, i) => (
          <OutletCard
            key={o.outlet}
            rank={i + 1}
            outlet={o}
            highlight={top3.some((t) => t.outlet === o.outlet)}
            selected={selectedOutlet === o.outlet}
            onClick={() => onSelect(o.outlet)}
          />
        ))}
      </div>
    </div>
  );
}
