// app/newsroom/cabinet/components/OutletCard.tsx
"use client";

import { cn } from "@/lib/utils";
import type { OutletOverview } from "../types";

type Highlight = "gold" | "warning" | "none";

type Props = {
  outlet: OutletOverview;
  rank: number;
  highlight: Highlight;
  selected: boolean;
  onClick: () => void;
};

export default function OutletCard({
  outlet,
  rank,
  highlight,
  selected,
  onClick,
}: Props) {
  const pi = outlet.avg_pi;
  const bias = outlet.avg_bias_intent;

  const badgeLabel =
    highlight === "gold"
      ? "Golden Anchor"
      : highlight === "warning"
      ? "High Bias Watch"
      : null;

  const badgeClass =
    highlight === "gold"
      ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
      : highlight === "warning"
      ? "border-amber-400/60 bg-amber-500/10 text-amber-200"
      : "border-neutral-700/80 bg-neutral-900/80 text-neutral-300";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border px-3 py-3 text-left text-xs transition",
        "bg-neutral-950/60 hover:bg-neutral-900/80",
        "border-neutral-800 hover:border-neutral-600/80",
        selected && "border-emerald-400/70 bg-neutral-900/90 shadow-[0_0_0_1px_rgba(16,185,129,0.4)]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-neutral-900 px-1 text-[11px] font-semibold text-neutral-300">
              #{rank}
            </span>
            <span className="text-[13px] font-semibold text-neutral-100">
              {outlet.canonical_outlet}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
            <span className="font-mono">
              PI{" "}
              <span className="text-neutral-100">
                {pi.toFixed(3)}
              </span>
              {" / "}
              <span className="text-neutral-500">
                1.000
              </span>
            </span>
            <span className="h-3 w-px bg-neutral-800" />
            <span className="font-mono">
              Bias {bias.toFixed(3)} / 3
            </span>
            <span className="h-3 w-px bg-neutral-800" />
            <span>
              {outlet.total_stories} stories · {outlet.days_active} days
            </span>
          </div>

          {outlet.last_story_day && (
            <div className="text-[10px] text-neutral-500">
              Last scored story:{" "}
              <span className="font-mono">
                {outlet.last_story_day}
              </span>
            </div>
          )}
        </div>

        {badgeLabel && (
          <span
            className={cn(
              "inline-flex h-6 items-center rounded-full border px-2 text-[10px] font-semibold uppercase tracking-wide",
              badgeClass
            )}
          >
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Tiny dual bar at bottom: PI vs Bias */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>PI (0–1)</span>
            <span className="font-mono text-neutral-300">
              {pi.toFixed(2)}
            </span>
          </div>
          <div className="mt-0.5 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-400"
              style={{ width: `${Math.max(0, Math.min(pi, 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>Bias (0–3)</span>
            <span className="font-mono text-neutral-300">
              {bias.toFixed(2)}
            </span>
          </div>
          <div className="mt-0.5 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500"
              style={{
                width: `${Math.max(0, Math.min(bias / 3, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
