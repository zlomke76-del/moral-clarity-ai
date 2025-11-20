// app/newsroom/cabinet/components/OutletDetailModal.tsx
"use client";

import type { OutletOverview, OutletTrendPoint } from "../types";
import OutletLogo from "./OutletLogo";

type Props = {
  outlet: OutletOverview;
  trends: OutletTrendPoint[] | null;
  loading: boolean;
  onClose: () => void;
};

export default function OutletDetailModal({
  outlet,
  trends,
  loading,
  onClose,
}: Props) {
  const {
    canonical_outlet,
    avg_pi,
    avg_bias_intent,
    bias_language,
    bias_source,
    bias_framing,
    bias_context,
    total_stories,
    days_active,
    last_story_day,
  } = outlet;

  const pi100 = (avg_pi * 100).toFixed(1);
  const biasIntent = avg_bias_intent.toFixed(2);

  const has90dTrend = trends && trends.length >= 2;
  let trendSummary = "Not enough recent stories to compute a 90-day trend yet.";
  let trendArrow: "up" | "down" | "flat" = "flat";

  if (has90dTrend) {
    const first = trends![0];
    const last = trends![trends!.length - 1];
    const delta = last.avg_pi_score - first.avg_pi_score;

    if (Math.abs(delta) < 0.005) {
      trendArrow = "flat";
      trendSummary = "PI is stable over the recent window.";
    } else if (delta > 0) {
      trendArrow = "up";
      trendSummary = "PI is trending upward (more predictable, neutral bias).";
    } else {
      trendArrow = "down";
      trendSummary = "PI is trending downward (less predictable, stronger bias).";
    }
  }

  const arrowSymbol =
    trendArrow === "up" ? "↑" : trendArrow === "down" ? "↓" : "→";

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-neutral-700 bg-neutral-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <OutletLogo domain={canonical_outlet} name={canonical_outlet} />
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Outlet
              </div>
              <div className="text-sm font-semibold text-neutral-50">
                {canonical_outlet}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
          >
            Esc
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4 text-sm text-neutral-200">
          {/* Top stats row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Lifetime PI
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl text-emerald-300">
                  {pi100}
                </span>
                <span className="text-xs text-neutral-400">
                  {total_stories} stories analyzed · PI based on lifetime
                </span>
              </div>
              <div className="text-[11px] text-neutral-500">
                Last scored: {last_story_day ?? "—"} ·{" "}
                {days_active} day{days_active === 1 ? "" : "s"} active
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Bias profile (0–3, lower is more neutral)
              </div>
              <div className="text-[11px] text-neutral-400">
                Bias intent{" "}
                <span className="font-mono text-neutral-100">
                  {biasIntent} / 3.00
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Language{" "}
                <span className="font-mono">
                  {bias_language.toFixed(2)} / 3.00
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Source{" "}
                <span className="font-mono">
                  {bias_source.toFixed(2)} / 3.00
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Framing{" "}
                <span className="font-mono">
                  {bias_framing.toFixed(2)} / 3.00
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Context{" "}
                <span className="font-mono">
                  {bias_context.toFixed(2)} / 3.00
                </span>
              </div>
            </div>
          </div>

          {/* 90-day trend summary */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 px-3 py-2 text-[11px] text-neutral-300 flex items-start gap-2">
            <span className="mt-[1px] font-mono text-xs">
              {arrowSymbol}
            </span>
            <span>
              <span className="font-semibold">90-day trend</span>:{" "}
              {loading ? "Loading…" : trendSummary}
            </span>
          </div>

          {/* Daily PI snapshots */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-200">
              Daily PI snapshots (recent days)
            </div>
            {loading ? (
              <div className="text-[11px] text-neutral-500">
                Loading recent days…
              </div>
            ) : !trends || trends.length === 0 ? (
              <div className="text-[11px] text-neutral-500">
                No recent days to show yet.
              </div>
            ) : (
              <div className="mt-1 h-40 w-full overflow-x-auto">
                <div className="flex h-full items-end gap-1">
                  {trends.map((p) => {
                    const height = 20 + p.avg_pi_score * 100; // 0–1 → 20–120px
                    return (
                      <div
                        key={p.story_day}
                        className="flex flex-col items-center"
                      >
                        <div
                          className="w-3 rounded-t-md bg-emerald-400/80"
                          style={{ height: `${height}px` }}
                          title={`${p.story_day}: PI ${(p.avg_pi_score * 100).toFixed(1)}`}
                        />
                        <div className="mt-1 w-6 rotate-90 whitespace-nowrap text-[9px] text-neutral-500">
                          {p.story_day.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer copy */}
          <p className="pt-1 text-[11px] text-neutral-500 border-t border-neutral-900">
            This cabinet doesn&apos;t decide who is right or wrong. It measures
            how stories are told — language, sourcing, framing, and missing
            context — and turns that into a predictable, auditable signal.
            Higher PI means more stable, neutral storytelling.
          </p>
        </div>
      </div>
    </div>
  );
}
