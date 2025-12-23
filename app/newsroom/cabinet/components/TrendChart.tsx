"use client";

import type { OutletTrendPoint } from "../types";

type Props = {
  points: OutletTrendPoint[] | null;
  loading?: boolean;
};

export default function TrendChart({ points, loading }: Props) {
  if (loading) {
    return (
      <div className="h-24 rounded-lg border border-neutral-800 bg-neutral-950/60 flex items-center justify-center text-xs text-neutral-500">
        Loading trend…
      </div>
    );
  }

  if (!points || points.length === 0) {
    return (
      <div className="h-24 rounded-lg border border-neutral-800 bg-neutral-950/60 flex items-center justify-center text-xs text-neutral-500">
        No trend data available
      </div>
    );
  }

  return (
    <div className="h-24 rounded-lg border border-neutral-800 bg-neutral-950/60 p-2">
      <div className="flex h-full items-end gap-1">
        {points.map((p) => {
          const value =
            typeof p.avg_pi === "number" ? p.avg_pi : 0;

          const height = Math.max(
            4,
            Math.min(20 + value * 100, 100)
          );

          return (
            <div
              key={p.day}
              className="flex flex-col items-center flex-1"
            >
              <div
                className="w-full rounded-sm bg-emerald-400/80"
                style={{ height: `${height}%` }}
                title={`PI ${value.toFixed(2)}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
