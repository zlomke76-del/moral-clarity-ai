// app/newsroom/cabinet/components/TrendChart.tsx
"use client";

import React from "react";

type DailyPoint = {
  day_iso: string;
  pi_score: number | null;
};

type OutletTrend = {
  outlet: string;
  daily?: DailyPoint[];
};

interface TrendChartProps {
  outlet: OutletTrend;
}

export default function TrendChart({ outlet }: TrendChartProps) {
  const daily = Array.isArray(outlet.daily) ? outlet.daily : [];

  if (!daily.length) {
    return (
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
        <h3 className="text-lg font-semibold mb-2">
          Predictability Index Trend — {outlet.outlet}
        </h3>
        <p className="text-neutral-400 text-sm">
          No daily trend data available yet for this outlet.
        </p>
      </div>
    );
  }

  // Normalize data to [0,1] for PI values
  const piValues = daily.map((d) =>
    typeof d.pi_score === "number" && Number.isFinite(d.pi_score)
      ? Math.max(0, Math.min(1, d.pi_score))
      : 0
  );

  const width = 100;
  const height = 40;
  const paddingX = 4;
  const paddingY = 6;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const n = piValues.length;
  const stepX = n > 1 ? innerWidth / (n - 1) : 0;

  const points = piValues.map((v, i) => {
    const x = paddingX + i * stepX;
    // Higher PI should be closer to the top (smaller y)
    const y = paddingY + (1 - v) * innerHeight;
    return { x, y };
  });

  const pathD =
    points.length === 1
      ? `M ${points[0].x} ${points[0].y}`
      : points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
          .join(" ");

  const lastPi = piValues[piValues.length - 1] ?? 0;
  const firstPi = piValues[0] ?? 0;
  const delta = lastPi - firstPi;

  let trendLabel = "Stable";
  let trendColor = "text-neutral-300";
  if (delta > 0.02) {
    trendLabel = "Improving";
    trendColor = "text-emerald-400";
  } else if (delta < -0.02) {
    trendLabel = "Drifting";
    trendColor = "text-red-400";
  }

  return (
    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-lg font-semibold">
          Predictability Index Trend — {outlet.outlet}
        </h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-neutral-400">
            Latest PI:{" "}
            <span className="text-neutral-100 font-semibold">
              {lastPi.toFixed(3)}
            </span>
          </span>
          <span className={trendColor}>{trendLabel}</span>
        </div>
      </div>

      <div className="h-40 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          {/* Baseline at PI = 1.0 (top) and 0.0 (bottom) */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#4ade80"
            strokeWidth={0.4}
            strokeDasharray="2 2"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#f97373"
            strokeWidth={0.4}
            strokeDasharray="2 2"
          />

          {/* Trend path */}
          <path
            d={pathD}
            fill="none"
            stroke="#22c55e"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Last point highlight */}
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={1.4}
              fill="#22c55e"
            />
          )}
        </svg>
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        Top dashed line = PI 1.0 (max neutrality). Bottom dashed line = PI 0.0
        (high bias/predictability). The line shows how this outlet&apos;s
        Predictability Index has changed over time.
      </p>
    </div>
  );
}
