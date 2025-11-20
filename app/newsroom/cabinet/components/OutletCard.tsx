// app/newsroom/cabinet/components/OutletCard.tsx
"use client";

import type { OutletSummary } from "./Leaderboard";

interface OutletCardProps {
  outlet: OutletSummary;
  rank: number;
  highlight: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function OutletCard({
  outlet,
  rank,
  highlight,
  selected,
  onClick,
}: OutletCardProps) {
  const lastDate = outlet.last_story_at
    ? new Date(outlet.last_story_at)
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        text-left rounded-xl border px-5 py-4 transition
        w-full
        ${
          highlight
            ? "border-yellow-400/80 shadow-yellow-500/20 shadow-lg"
            : "border-neutral-700"
        }
        ${
          selected
            ? "bg-neutral-800/70 ring-1 ring-blue-400/60"
            : "bg-neutral-900/40 hover:bg-neutral-800/60"
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-neutral-500">#{rank}</span>
          <span className="text-lg font-semibold truncate">
            {outlet.outlet}
          </span>
        </div>

        {highlight && (
          <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/60 bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-300">
            <span>⚓</span>
            <span>Golden Anchor</span>
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-neutral-400">
        <div>
          <div className="text-sm font-semibold text-neutral-100">
            {outlet.avg_pi.toFixed(3)}
          </div>
          <div>PI score</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-100">
            {outlet.article_count}
          </div>
          <div>Articles rated</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-100">
            {lastDate ? lastDate.toLocaleDateString() : "—"}
          </div>
          <div>Last scored</div>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
        {/* Simple PI bar: 0–1 mapped to width */}
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${Math.max(0, Math.min(1, outlet.avg_pi)) * 100}%` }}
        />
      </div>

      <p className="mt-2 text-[11px] text-neutral-500">
        Higher PI (closer to 1.0) means more neutral, less predictably biased
        coverage over time.
      </p>
    </button>
  );
}
