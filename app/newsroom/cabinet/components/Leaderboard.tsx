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
  // Assumes `outlets` is ALREADY sorted by PI descending
  const golden = outlets.slice(0, 3);
  const watchlist = outlets.slice(-3);
  const neutral = outlets.slice(3, Math.max(outlets.length - 3, 3));

  const handle = (canon: string) => {
    onSelect(canon, canon === selectedCanonical);
  };

  return (
    <div className="space-y-10">
      {/* ================= GOLDEN ANCHOR ================= */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-300">
          Golden Anchor
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {golden.map((o, i) => (
            <div
              key={o.canonical_outlet}
              className="rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.25)]"
            >
              <OutletCard
                outlet={o}
                rank={i + 1}
                selected={selectedCanonical === o.canonical_outlet}
                badge="golden"
                onSelect={() => handle(o.canonical_outlet)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ================= NEUTRAL ================= */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-300">
          Neutral
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {neutral.map((o, i) => (
            <OutletCard
              key={o.canonical_outlet}
              outlet={o}
              rank={golden.length + i + 1}
              selected={selectedCanonical === o.canonical_outlet}
              badge="neutral"
              onSelect={() => handle(o.canonical_outlet)}
            />
          ))}
        </div>
      </section>

      {/* ================= WATCHLIST ================= */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-red-400">
          Watchlist
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {watchlist.map((o, i) => (
            <div
              key={o.canonical_outlet}
              className="rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.35)]"
            >
              <OutletCard
                outlet={o}
                rank={outlets.length - watchlist.length + i + 1}
                selected={selectedCanonical === o.canonical_outlet}
                badge="watchlist"
                onSelect={() => handle(o.canonical_outlet)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
