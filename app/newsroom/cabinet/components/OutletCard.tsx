// app/newsroom/cabinet/components/OutletCard.tsx
"use client";

import type { OutletOverview } from "../types";

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
  const piDisplay = outlet.avg_pi.toFixed(3);
  const biasDisplay = outlet.avg_bias_intent.toFixed(2);

  // FIXED — no display_name on OutletOverview
  const displayName = outlet.canonical_outlet;

  const badgeLabel =
    badge === "golden"
      ? "Golden Anchor"
      : badge === "watchlist"
      ? "High Bias Watchlist"
      : badge === "neutral"
      ? "Neutral Band"
      : null;

  const badgeClass =
    badge === "golden"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
      : badge === "watchlist"
      ? "bg-amber-500/10 text-amber-300 border-amber-400/40"
      : badge === "neutral"
      ? "bg-sky-500/10 text-sky-300 border-sky-400/40"
      : "bg-neutral-800/60 text-neutral-300 border-neutral-700/60";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full text-left rounded-xl border px-4 py-3 transition",
        "bg-neutral-950/70 hover:bg-neutral-900/80",
        selected
          ? "border-emerald-400/70 shadow-[0_0_0_1px_rgba(16,185,129,.6)]"
          : "border-neutral-800",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-neutral-200">
            #{rank}
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-100">
              {displayName}
            </div>
            <div className="mt-0.5 text-[11px] text-neutral-400">
              {outlet.total_stories} scored stories · {outlet.days_active} day
              {outlet.days_active === 1 ? "" : "s"} active
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {badgeLabel && (
            <span
              className={[
                "inline-flex items-center rounded-full border px-2 py-[2px]",
                "text-[10px] font-medium uppercase tracking-[0.14em]",
                badgeClass,
              ].join(" ")}
            >
              {badgeLabel}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            <div className="text-xs text-neutral-400">PI</div>
            <div className="font-mono text-sm text-neutral-50">
              {piDisplay}
            </div>
          </div>
          <div className="flex items-baseline gap-2 text-[11px] text-neutral-400">
            <span>Bias intent</span>
            <span className="font-mono">{biasDisplay}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <MetricPill label="Language" value={outlet.bias_language} />
        <MetricPill label="Source" value={outlet.bias_source} />
        <MetricPill label="Framing" value={outlet.bias_framing} />
        <MetricPill label="Context" value={outlet.bias_context} />
      </div>
    </button>
  );
}

function MetricPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-300">
      <span className="mr-1 text-[10px] text-neutral-500">{label}</span>
      <span className="font-mono text-[10px] text-neutral-100">
        {value.toFixed(2)}
      </span>
    </span>
  );
}

