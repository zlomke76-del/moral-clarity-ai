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
  const maxGolden = 3;
  const maxWatchlist = 3;

  const golden = outlets.slice(0, maxGolden);
  const watchlist = outlets.slice(-maxWatchlist);
  const neutral = outlets.slice(
    golden.length,
    Math.max(outlets.length - watchlist.length, golden.length)
  );

  const handle = (canon: string) => {
    onSelect(canon, canon === selectedCanonical);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-neutral-100">
        Outlet Neutrality Leaderboard
      </h2>

      {golden.map((o, i) => (
        <OutletCard
          key={o.canonical_outlet}
          outlet={o}
          rank={i + 1}
          selected={selectedCanonical === o.canonical_outlet}
          badge="golden"
          onSelect={() => handle(o.canonical_outlet)}
        />
      ))}

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

      {watchlist.map((o, i) => (
        <OutletCard
          key={o.canonical_outlet}
          outlet={o}
          rank={outlets.length - watchlist.length + i + 1}
          selected={selectedCanonical === o.canonical_outlet}
          badge="watchlist"
          onSelect={() => handle(o.canonical_outlet)}
        />
      ))}
    </div>
  );
}
