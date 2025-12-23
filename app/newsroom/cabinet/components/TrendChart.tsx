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
        No daily trend data yet.
      </div>
    );
  }

  return (
    <div className="h-40 overflow-x-auto">
      <div className="flex h-full items-end gap-1">
        {points.map((p) => {
          const height = 20 + p.avg_pi_score * 100;
          return (
            <div key={p.story_day} className="flex flex-col items-center">
              <div
                className="w-3 rounded-t-md bg-emerald-400/80"
                style={{ height }}
                title={`${p.story_day}: PI ${p.avg_pi_score.toFixed(3)}`}
              />
              <div className="mt-1 rotate-90 text-[9px] text-neutral-500">
                {p.story_day.slice(5)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
