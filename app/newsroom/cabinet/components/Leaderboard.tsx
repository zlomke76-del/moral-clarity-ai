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
  // 🔒 HARD RULES
  const GOLD_COUNT = 3;
  const WATCH_COUNT = 3;

  // 🔒 AUTHORITATIVE SORT — WEIGHTED LIFETIME PI ONLY, DESC
  const sorted = [...outlets].sort((a, b) => {
    if (b.avg_pi_weighted !== a.avg_pi_weighted) {
      return b.avg_pi_weighted - a.avg_pi_weighted;
    }
    return a.canonical_outlet.localeCompare(b.canonical_outlet);
  });

  const golden = sorted.slice(0, GOLD_COUNT);
  const watchlist = sorted.slice(-WATCH_COUNT);
  const neutral = sorted.slice(GOLD_COUNT, sorted.length - WATCH_COUNT);

  // 📊 TOTAL STORIES ANALYZED (LIFETIME CORPUS)
  const totalStoriesAnalyzed = sorted.reduce(
    (sum, o) => sum + o.total_stories,
    0
  );

  const handleSelect = (canon: string) => {
    onSelect(canon, canon === selectedCanonical);
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
              key={o.canonical_outlet}
              outlet={o}
              rank={i + 1}
              selected={selectedCanonical === o.canonical_outlet}
              badge="golden"
              onSelect={() => handleSelect(o.canonical_outlet)}
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
              key={o.canonical_outlet}
              outlet={o}
              rank={GOLD_COUNT + i + 1}
              selected={selectedCanonical === o.canonical_outlet}
              badge="neutral"
              onSelect={() => handleSelect(o.canonical_outlet)}
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
              key={o.canonical_outlet}
              outlet={o}
              rank={sorted.length - WATCH_COUNT + i + 1}
              selected={selectedCanonical === o.canonical_outlet}
              badge="watchlist"
              onSelect={() => handleSelect(o.canonical_outlet)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
