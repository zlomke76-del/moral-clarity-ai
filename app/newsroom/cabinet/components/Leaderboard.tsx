"use client";

import type { OutletOverview } from "../types";
import OutletCard from "./OutletCard";

type Props = {
  outlets: OutletOverview[];
  selectedCanonical: string | null;
  onSelect: (canonical: string, wasSelected: boolean) => void;
};

export default function Leaderboard({
  outlets,
  selectedCanonical,
  onSelect,
}: Props) {
  const GOLD_COUNT = 3;
  const WATCH_COUNT = 3;

  const golden = outlets.slice(0, GOLD_COUNT);
  const watchlist = outlets.slice(-WATCH_COUNT);
  const neutral = outlets.slice(GOLD_COUNT, outlets.length - WATCH_COUNT);

  const handleSelect = (canon: string) => {
    onSelect(canon, canon === selectedCanonical);
  };

  return (
    <div className="space-y-6">

      {/* ===== GOLDEN ANCHOR ===== */}
      <div className="space-y-2">
        {golden.map((o, i) => (
          <div
            key={o.canonical_outlet}
            className="relative rounded-xl bg-yellow-500/10 shadow-[0_0_40px_rgba(234,179,8,0.35)]"
          >
            <OutletCard
              outlet={o}
              rank={i + 1}
              selected={selectedCanonical === o.canonical_outlet}
              badge="golden"
              onSelect={() => handleSelect(o.canonical_outlet)}
            />
          </div>
        ))}
      </div>

      {/* ===== NEUTRAL FIELD ===== */}
      <div className="space-y-2">
        {neutral.map((o, i) => (
          <OutletCard
            key={o.canonical_outlet}
            outlet={o}
            rank={GOLD_COUNT + i + 1}
            selected={selectedCanonical === o.canonical_outlet}
            badge="neutral"
            onSelect={() => handleSelect(o.canonical_outlet)}
          />
        ))}
      </div>

      {/* ===== WATCHLIST ===== */}
      <div className="space-y-2">
        {watchlist.map((o, i) => (
          <div
            key={o.canonical_outlet}
            className="relative rounded-xl bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.35)]"
          >
            <OutletCard
              outlet={o}
              rank={outlets.length - WATCH_COUNT + i + 1}
              selected={selectedCanonical === o.canonical_outlet}
              badge="watchlist"
              onSelect={() => handleSelect(o.canonical_outlet)}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
