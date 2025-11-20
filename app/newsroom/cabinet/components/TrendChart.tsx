// app/newsroom/cabinet/components/TrendChart.tsx
"use client";

import type { OutletTrendPoint } from "../types";

type Props = {
  points: OutletTrendPoint[] | null;
  loading: boolean;
};

export default function TrendChart({ points, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-xs text-neutral-400">
        Loading trend…
      </div>
    );
  }

  if (!points || points.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-xs text-neutral-400">
        No daily trend data yet for this outlet. Once we have multiple days of
        scored stories, you&apos;ll see a PI timeline here.
      </div>
    );
  }

  const piValues = points.map((p) => p.avg_pi_score);
  const minPi = Math.min(...piValues);
  const maxPi = Math.max(...piValues);
  const range = Math.max(0.05, maxPi - minPi); // avoid flat zero

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-3">
      <header className="flex items-baseline justify-between">
        <div>
          <h2 className="text-sm font-semibold">PI over time</h2>
          <p className="text-[11px] text-neutral-400">
            Each bar is a day. Higher bars mean higher Predictability Index
            (more neutral storytelling).
          </p>
        </div>
        <div className="text-[11px] text-neutral-400">
          span:{" "}
          <span className="font-mono">
            {points[0].story_day} → {points[points.length - 1].story_day}
          </span>
        </div>
      </header>

      {/* Minimal sparkline-style bar chart */}
      <div className="flex items-end gap-1 h-24 rounded-lg bg-neutral-900/60 px-2 py-2 overflow-x-auto">
        {points.map((p) => {
          const normalized = (p.avg_pi_score - minPi) / range;
          const height = 20 + normalized * 70; // between 20% and 90% of container

          return (
            <div key={p.story_day} className="flex flex-col items-center gap-1">
              <div
                className="w-2 rounded-full bg-gradient-to-t from-emerald-500 to-blue-400"
                style={{ height: `${height}%` }}
                title={`${p.story_day}: PI ${p.avg_pi_score.toFixed(3)}`}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-neutral-500">
        <span>
          Min PI:{" "}
          <span className="font-mono">{Math.min(...piValues).toFixed(3)}</span>
        </span>
        <span>
          Max PI:{" "}
          <span className="font-mono">{Math.max(...piValues).toFixed(3)}</span>
        </span>
      </div>
    </div>
  );
}
