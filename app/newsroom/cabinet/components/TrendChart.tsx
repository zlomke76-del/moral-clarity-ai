"use client";

import type { OutletTrendPoint } from "../types";

type Props = {
  points: OutletTrendPoint[] | null;
  loading?: boolean;
};

export default function TrendChart({ points, loading }: Props) {
  if (loading) {
    return (
      <div className="h-24 flex items-center justify-center text-xs text-neutral-500">
        Loading trend…
      </div>
    );
  }

  if (!points || points.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center text-xs text-neutral-500">
        No trend data available
      </div>
    );
  }

  return (
    <div className="flex h-24 items-end gap-1">
      {points.map((p) => {
        // 🔒 AUTHORITATIVE FIELD — WEIGHTED PI
        const value =
          typeof p.avg_pi_weighted === "number"
            ? p.avg_pi_weighted
            : 0;

        // Scale: min 4px, max 100px
        const height = Math.max(4, Math.min(value * 100, 100));

        return (
          <div
            key={p.story_day}
            className="flex flex-col items-center"
            title={`${(value * 100).toFixed(2)} PI`}
          >
            <div
              className="w-2 rounded bg-neutral-200"
              style={{ height }}
            />
          </div>
        );
      })}
    </div>
  );
}
