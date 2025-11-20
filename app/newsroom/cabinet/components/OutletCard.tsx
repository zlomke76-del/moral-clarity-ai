// app/newsroom/cabinet/components/OutletCard.tsx
"use client";

import type { OutletOverview } from "../types";

type Highlight = "gold" | "warning" | "none";

type Props = {
  outlet: OutletOverview;
  rank: number;
  highlight: Highlight;
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
  const bias = outlet.avg_bias_intent;
  const pi = outlet.avg_pi;
  const tone =
    highlight === "gold"
      ? "border-emerald-500/60 bg-emerald-500/5"
      : highlight === "warning"
      ? "border-amber-500/60 bg-amber-500/5"
      : "border-neutral-800 bg-neutral-900/40";

  const badge =
    highlight === "gold"
      ? "⚓ Golden Anchor"
      : highlight === "warning"
      ? "Bias Watch"
      : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-xl border px-3 py-2 text-left text-xs transition",
        tone,
        selected
          ? "ring-2 ring-offset-0 ring-blue-500/80 border-blue-500/80"
          : "hover:border-neutral-500/80 hover:bg-neutral-900",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-neutral-500 w-4">
            #{rank}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {outlet.canonical_outlet}
              </span>
              {badge && (
                <span className="text-[10px] rounded-full border border-current px-2 py-0.5">
                  {badge}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
              <span>
                PI:{" "}
                <span className="font-mono text-emerald-300">
                  {pi.toFixed(3)}
                </span>
              </span>
              <span className="text-neutral-500">•</span>
              <span>
                Bias intent:{" "}
                <span className="font-mono text-neutral-200">
                  {bias.toFixed(3)}
                </span>{" "}
                / 3
              </span>
              <span className="text-neutral-500">•</span>
              <span>{outlet.total_stories} stories scored</span>
            </div>
          </div>
        </div>

        {/* Simple PI bar */}
        <div className="flex flex-col items-end gap-1">
          <div className="h-1.5 w-24 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${Math.max(0, Math.min(pi, 1)) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-neutral-500">
            Target: <span className="font-mono">1.000</span>
          </span>
        </div>
      </div>
    </button>
  );
}
