// app/newsroom/cabinet/components/Leaderboard.tsx
"use client";

import OutletCard from "./OutletCard";

export interface OutletSummary {
  outlet: string;
  avg_pi: number;
  article_count: number;
  last_story_at: string;
}

interface LeaderboardProps {
  outlets: OutletSummary[];
  onSelect: (outlet: string) => void;
  selectedOutlet: string | null;
}

export default function Leaderboard({
  outlets,
  onSelect,
  selectedOutlet,
}: LeaderboardProps) {
  if (!Array.isArray(outlets) || outlets.length === 0) {
    return (
      <div className="text-neutral-400 text-sm">
        No outlet scoring data available yet.
      </div>
    );
  }

  // Sort outlets by PI descending (higher = more neutral / less predictable)
  const sorted = [...outlets].sort((a, b) => b.avg_pi - a.avg_pi);

  // Top 3 for Golden Anchor
  const top3 = sorted.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Outlet Leaderboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((o, index) => (
          <OutletCard
            key={o.outlet}
            rank={index + 1}
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
