"use client";

import type { OutletTrendPoint } from "../types";

type Props = {
  points: OutletTrendPoint[] | null;
  loading: boolean;
};

export default function TrendChart({ points, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm text-neutral-400">
        Loading trend…
      </div>
    );
  }

  if (!points || points.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm text-neutral-400">
        No daily trend data yet for this outlet.
      </div>
    );
  }

  const maxPi = Math.max(...points.map(p => p.avg_pi_score));
  const minPi = Math.min(...points.map(p => p.avg_pi_score));

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-100">
            Predictability over time
          </h3>
          <p className="mt-1 text-xs text-neutral-400">
            Each bar represents a day. Higher bars indicate a higher Predictability Index (closer to 1.0) for that day's scored stories.
          </p>
        </div>
        <div className="text-[11px] text-neutral-500">
          {points.length} day{points.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="mt-2 h-40 w-full overflow-x-auto">
        <div className="flex h-full items-end gap-1">
          {points.map((p) => {
            const norm = (p.avg_pi_score - minPi) / (maxPi - minPi || 1); // Normalize to 0..1
            const height = 20 + norm * 100; // px
            return (
              <div key={p.story_day} className="flex flex-col items-center">
                <div
                  className="w-3 rounded-t-md bg-emerald-400/80"
                  style={{ height: `${height}px` }}
                  title={`${p.story_day}: PI ${p.avg_pi_score.toFixed(3)}`}
                  aria-label={`Predictability Index for ${p.story_day}: ${p.avg_pi_score.toFixed(3)}`}
                />
                <div className="mt-1 w-6 rotate-90 whitespace-nowrap text-[9px] text-neutral-500">
                  {p.story_day.slice(5)} {/* show MM-DD */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
