// app/newsroom/cabinet/components/Leaderboard.tsx
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
  if (!outlets.length) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm text-neutral-400">
        No scored outlets yet.
      </div>
    );
  }

  // outlets are already sorted by avg_bias_intent from the API/page
  const maxGolden = 3;
  const maxWatchlist = 3;

  const golden = outlets.slice(0, Math.min(maxGolden, outlets.length));
  const watchlist = outlets.slice(-maxWatchlist);
  const neutral = outlets.slice(
    golden.length,
    Math.max(outlets.length - watchlist.length, golden.length)
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-neutral-100">
          Outlet Neutrality Leaderboard
        </h2>
        <p className="mt-1 text-xs text-neutral-400">
          Outlets are ranked by their{" "}
          <span className="font-medium">bias intent</span>. Lower is better.
          Everyone is chasing a Predictability Index (PI) close to{" "}
          <span className="font-mono text-emerald-300">1.000</span>.
        </p>
      </div>

      {/* Golden Anchors */}
      {golden.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Golden Anchors
            </h3>
            <p className="text-[10px] text-neutral-500">
              Most predictable, neutral story-level bias so far.
            </p>
          </div>
          <div className="space-y-2">
            {golden.map((o, idx) => (
              <OutletCard
                key={o.canonical_outlet}
                outlet={o}
                rank={idx + 1}
                selected={selectedCanonical === o.canonical_outlet}
                badge="golden"
                onSelect={() => onSelect(o.canonical_outlet)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Neutral Band */}
      {neutral.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Neutral Band
            </h3>
            <p className="text-[10px] text-neutral-500">
              Mixed signals, but generally stable coverage.
            </p>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {neutral.map((o, idx) => (
              <OutletCard
                key={o.canonical_outlet}
                outlet={o}
