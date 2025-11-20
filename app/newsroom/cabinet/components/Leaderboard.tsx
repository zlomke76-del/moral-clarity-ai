// app/newsroom/cabinet/components/Leaderboard.tsx
"use client";

import type { OutletOverview } from "../types";
import OutletCard from "./OutletCard";

type Props = {
  outlets: OutletOverview[];
  selectedCanonical: string | null;
  onSelect: (canonicalOutlet: string) => void;
};

export default function Leaderboard({
  outlets,
  selectedCanonical,
  onSelect,
}: Props) {
  if (!outlets.length) return null;

  const sorted = [...outlets].sort(
    (a, b) => a.avg_bias_intent - b.avg_bias_intent
  );

  const topCount = Math.min(3, sorted.length);
  const bottomCount = Math.min(3, sorted.length - topCount);

  const top = sorted.slice(0, topCount);
  const middle = sorted.slice(topCount, sorted.length - bottomCount);
  const bottom = sorted.slice(sorted.length - bottomCount);

  return (
    <div className="space-y-4">
      <header className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Outlet Neutrality Leaderboard
        </h2>
        <p className="text-xs text-neutral-400">
          Ranked by{" "}
          <span className="font-medium">lowest bias intent (0–3)</span> and{" "}
          <span className="font-medium">highest PI (0–1)</span>.
        </p>
      </header>

      <div className="space-y-3">
        {/* Top outlets */}
        <section>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-emerald-300">
              Golden Anchors
            </span>
            <span className="text-[10px] rounded-full border border-emerald-500/40 bg-emerald-500/5 px-2 py-0.5 text-emerald-200">
              Target: PI → 1.00
            </span>
          </div>
          <div className="space-y-2">
            {top.map((o, idx) => (
              <OutletCard
                key={o.canonical_outlet}
                outlet={o}
                rank={idx + 1}
                highlight="gold"
                selected={o.canonical_outlet === selectedCanonical}
                onClick={() => onSelect(o.canonical_outlet)}
              />
            ))}
          </div>
        </section>

        {/* Middle outlets */}
        {middle.length > 0 && (
          <section>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-neutral-300">
                Neutral Band
              </span>
              <span className="text-[10px] rounded-full border border-neutral-600/60 bg-neutral-900/80 px-2 py-0.5 text-neutral-300">
                Solid coverage, mixed bias patterns
              </span>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {middle.map((o, idx) => (
                <OutletCard
                  key={o.canonical_outlet}
                  outlet={o}
                  rank={topCount + idx + 1}
                  highlight="none"
                  selected={o.canonical_outlet === selectedCanonical}
                  onClick={() => onSelect(o.canonical_outlet)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Bottom outlets */}
        {bottom.length > 0 && (
          <section>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-amber-300">
                High Bias Watchlist
              </span>
              <span className="text-[10px] rounded-full border border-amber-500/40 bg-amber-500/5 px-2 py-0.5 text-amber-200">
                Strong language / framing / context tilt
              </span>
            </div>
            <div className="space-y-2">
              {bottom.map((o, idx) => (
                <OutletCard
                  key={o.canonical_outlet}
                  outlet={o}
                  rank={sorted.length - bottom.length + idx + 1}
                  highlight="warning"
                  selected={o.canonical_outlet === selectedCanonical}
                  onClick={() => onSelect(o.canonical_outlet)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
