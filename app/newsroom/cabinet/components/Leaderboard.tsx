"use client";

import type { OutletOverview } from "../../types";
import OutletCard from "./OutletCard";

type Props = {
  outlets: OutletOverview[];
  selectedOutlet: string | null;
  onSelect: (outlet: string, wasSelected: boolean) => void;
};

export default function Leaderboard({
  outlets,
  selectedOutlet,
  onSelect,
}: Props) {
  // 🔒 HARD RULES
  const GOLD_COUNT = 3;
  const WATCH_COUNT = 3;

  // 🔒 AUTHORITATIVE SORT — WEIGHTED PI DESC
  const sorted = [...outlets].sort((a, b) => {
    const aPi = a.avg_pi_weighted ?? -1;
    const bPi = b.avg_pi_weighted ?? -1;

    if (bPi !== aPi) {
      return bPi - aPi;
    }

    return a.outlet.localeCompare(b.outlet);
  });

  const golden = sorted.slice(0, GOLD_COUNT);
  const watchlist = sorted.slice(-WATCH_COUNT);
  const neutral = sorted.slice(GOLD_COUNT, sorted.length - WATCH_COUNT);

  // 📊 TOTAL STORIES ANALYZED (LIFETIME)
  const totalStoriesAnalyzed = sorted.reduce(
    (sum, o) => sum + o.total_stories,
    0
  );

  const handleSelect = (outlet: string) => {
    onSelect(outlet, outlet === selectedOutlet);
  };

  return (
    <div className="space-y-10">
      {/* ================= GLOBAL CORPUS COUNTER ================= */}
      <div className="text-sm text-neutral-400 font-mono">
        {totalStoriesAnalyzed.toLocaleString()} stories analyzed · lifetime corpus
      </div>

      {/* ================= GOLDEN ANCHOR ================= */}
      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-amber-300">
          Golden Anchor
        </h2>

        <div className="flex gap-4">
          {golden.map((o, i) => (
            <OutletCard
              key={o.outlet}
              outlet={o}
              rank={i + 1}
              selected={selectedOutlet === o.outlet}
              badge="golden"
              onSelect={() => handleSelect(o.outlet)}
            />
          ))}
        </div>
      </section>

      {/* ================= NEUTRAL ================= */}
      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-300">
          Neutral
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {neutral.map((o, i) => (
            <OutletCard
              key={o.outlet}
              outlet={o}
              rank={GOLD_COUNT + i + 1}
              selected={selectedOutlet === o.outlet}
              badge="neutral"
              onSelect={() => handleSelect(o.outlet)}
            />
          ))}
        </div>
      </section>

      {/* ================= WATCHLIST ================= */}
      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-red-400">
          Watchlist
        </h2>

        <div className="flex gap-4">
          {watchlist.map((o, i) => (
            <OutletCard
              key={o.outlet}
              outlet={o}
              rank={sorted.length - WATCH_COUNT + i + 1}
              selected={selectedOutlet === o.outlet}
              badge="watchlist"
              onSelect={() => handleSelect(o.outlet)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
