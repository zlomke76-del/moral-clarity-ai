"use client";

import type { OutletOverview } from "../types";
import OutletLogo from "./OutletLogo";

type Props = {
  outlet: OutletOverview;
  rank: number;
  selected: boolean;
  badge?: "golden" | "neutral" | "watchlist";
  onSelect: () => void;
};

export default function OutletCard({
  outlet,
  rank,
  selected,
  badge,
  onSelect,
}: Props) {
  const pi = (outlet.avg_pi * 100).toFixed(1);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-xl border px-4 py-3 text-left transition",
        "bg-neutral-950/70 hover:bg-neutral-900/80",
        selected
          ? "border-emerald-400/70 shadow-[0_0_0_1px_rgba(16,185,129,.6)]"
          : "border-neutral-800",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold">
            #{rank}
          </div>
          <OutletLogo
            domain={outlet.canonical_outlet}
            name={outlet.canonical_outlet}
          />
          <div>
            <div className="text-sm font-semibold">
              {outlet.canonical_outlet}
            </div>
            <div className="text-[11px] text-neutral-400">
              {outlet.total_stories} stories analyzed · PI based on lifetime
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-neutral-400">PI</div>
          <div className="font-mono text-lg text-neutral-50">{pi}</div>
        </div>
      </div>
    </button>
  );
}
