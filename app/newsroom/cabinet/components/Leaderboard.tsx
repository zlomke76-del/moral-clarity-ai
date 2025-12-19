"use client";

import type { OutletOverview } from "../types";
import OutletCard from "./OutletCard";

type Props = {
  outlets: OutletOverview[]; // MUST already be PI-ranked (highest → lowest)
  selectedCanonical: string | null;
  onSelect: (canonical: string, wasSelected: boolean) => void;
};

export default function Leaderboard({
  outlets,
  selectedCanonical,
  onSelect,
}: Props) {
  // 🔒 Explicit rules
  const GOLDEN_COUNT = 3;
  const WATCHLIST_COUNT = 3;

  // Top PI performers
  const golden = outlets.slice(0, GOLDEN_COUNT);

  // Bottom PI performers
  const watchlist = outlets.slice(-WATCHLIST_COUNT);

  // Everyone else
  const neutral = outlets.slice(
    GOLDEN_COUNT,
    Math.max(outlets.length - WATCHLIST_COUNT, GOLDEN_COUNT)
  );

  const handleSelect = (canonical: string) => {
    onSelect(canonical, canonical === selectedCanonical);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-neutral-100">
        Outlet Neutrality Leaderboard
      </h2>

      {/* 🟡 Golden Anchors */}
      {golden.map((o, i) => (
        <OutletCard
          key={o.canonical_outlet}
          outlet={o}
          rank={i + 1}
          selected={selectedCanonical === o.canonical_outlet}
          badge="golden"
          onSelect={() => handleSelect(o.canonical_outlet)}
        />
      ))}

      {/* ⚪ Neutral / Competitive Middle */}
      {neutral.map((o, i) => (
        <OutletCard
          key={o.canonical_outlet}
          outlet={o}
          rank={GOLDEN_COUNT + i + 1}
          selected={selectedCanonical === o.canonical_outlet}
          badge="neutral"
          onSelect={() => handleSelect(o.canonical_outlet)}
        />
      ))}

      {/* 🔴 Watchlist */}
      {watchlist.map((o, i) => (
        <OutletCard
          key={o.canonical_outlet}
          outlet={o}
          rank={outlets.length - WATCHLIST_COUNT + i + 1}
          selected={selectedCanonical === o.canonical_outlet}
          badge="watchlist"
          onSelect={() => handleSelect(o.canonical_outlet)}
        />
      ))}
    </div>
  );
}
