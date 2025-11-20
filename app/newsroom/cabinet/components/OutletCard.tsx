"use client";

import type { OutletOverview } from "../types";
import { cn } from "@/lib/utils"; // if you have a class merge helper

type Props = {
  outlet: OutletOverview;
  rank: number;
  highlight: "gold" | "warning" | "none";
  selected: boolean;
  onClick?: () => void;
};

export default function OutletCard({
  outlet,
  rank,
  highlight,
  selected,
  onClick,
}: Props) {
  const { canonical_outlet, avg_pi, avg_bias_intent, total_stories } = outlet;

  const badge =
    highlight === "gold"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
      : highlight === "warning"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/40"
      : "bg-neutral-800/50 text-neutral-300 border-neutral-700";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border p-3 transition hover:bg-neutral-900/60",
        selected && "border-blue-400 bg-neutral-900",
        !selected && "border-neutral-800 bg-neutral-950/40"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Rank */}
          <div
            className={cn(
              "w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold",
              badge
            )}
          >
            {rank}
          </div>

          {/* Outlet name */}
          <div>
            <div className="font-medium tracking-tight">{canonical_outlet}</div>
            <div className="text-[11px] text-neutral-500">
              {total_stories} stories
            </div>
          </div>
        </div>

        {/* PI Score */}
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500">
            PI
          </div>
          <div className="font-mono text-sm text-emerald-300">
            {avg_pi.toFixed(3)}
          </div>
          <div className="text-[10px] text-neutral-500">
            bias {avg_bias_intent.toFixed(2)}
          </div>
        </div>
      </div>
    </button>
  );
}
