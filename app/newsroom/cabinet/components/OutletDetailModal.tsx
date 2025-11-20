// app/newsroom/cabinet/components/OutletDetailModal.tsx
"use client";

import { useEffect } from "react";
import type { OutletOverview, OutletTrendPoint } from "../types";
import TrendChart from "./TrendChart";
import OutletLogo from "./OutletLogo";

type Props = {
  open: boolean;
  outlet: OutletOverview | null;
  trends: OutletTrendPoint[] | null;
  trendLoading: boolean;
  onClose: () => void;
};

export default function OutletDetailModal({
  open,
  outlet,
  trends,
  trendLoading,
  onClose,
}: Props) {
  // ESC to close
  useEffect(() => {
    if (!open) return;

    const handler = (evt: KeyboardEvent) => {
      if (evt.key === "Escape") {
        evt.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || !outlet) return null;

  const lifetimePi = (outlet.avg_pi * 100).toFixed(1);
  const biasIntent = outlet.avg_bias_intent;

  const language = outlet.bias_language;
  const source = outlet.bias_source;
  const framing = outlet.bias_framing;
  const context = outlet.bias_context;

  // 90-day trend sentence
  let trendText =
    "Not enough recent stories to compute a 90-day trend yet.";
  if (trends && trends.length >= 4) {
    const first = trends[0].avg_pi_score;
    const last = trends[trends.length - 1].avg_pi_score;
    const delta = last - first;
    const magnitude = Math.abs(delta);

    if (magnitude < 0.01) {
      trendText = "PI is roughly flat over the last 90 days.";
    } else if (delta > 0) {
      trendText =
        "PI is trending upward (more predictable, more stable bias).";
    } else {
      trendText =
        "PI is trending downward (less predictable, stronger bias).";
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close outlet detail"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-[71] max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-950/95 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-neutral-900">
              <OutletLogo
                domain={outlet.canonical_outlet}
                name={outlet.canonical_outlet}
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Outlet
              </div>
              <div className="text-sm font-semibold text-neutral-100">
                {outlet.canonical_outlet}
              </div>
              {outlet.last_story_day && (
                <div className="mt-0.5 text-[11px] text-neutral-400">
                  Last scored: {outlet.last_story_day} ·{" "}
                  {outlet.days_active} day
                  {outlet.days_active === 1 ? "" : "s"} active
                </div>
              )}
              <div className="mt-0.5 text-[11px] text-neutral-400">
                {outlet.total_stories} stories analyzed · PI based on lifetime.
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] text-neutral-300 hover:bg-neutral-800"
            >
              Esc
            </button>
            <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
              Lifetime PI
            </div>
            <div className="font-mono text-2xl text-emerald-300">
              {lifetimePi}
            </div>
            <div className="text-[11px] text-neutral-400">
              Bias intent:{" "}
              <span className="font-mono text-neutral-100">
                {biasIntent.toFixed(2)} / 3.00
              </span>
            </div>
          </div>
        </div>

        {/* Bias profile */}
        <div className="mt-4 space-y-3 text-[11px] text-neutral-300">
          <div className="font-semibold text-neutral-100">
            Bias profile (0–3, lower is more neutral)
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <BiasLine label="Language" value={language} />
            <BiasLine label="Source" value={source} />
            <BiasLine label="Framing" value={framing} />
            <BiasLine label="Context" value={context} />
          </div>
        </div>

        {/* 90-day trend narrative */}
        <div className="mt-4 space-y-1 text-[11px] text-neutral-300">
          <div className="font-semibold text-neutral-100">90-day trend</div>
          <p>{trendText}</p>
        </div>

        {/* Daily PI snapshots (reusing existing chart) */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-neutral-100">
            Daily PI snapshots (recent days)
          </div>
          <div className="mt-2">
            <TrendChart points={trends} loading={trendLoading} />
          </div>
        </div>

        <p className="mt-4 text-[11px] text-neutral-500">
          This cabinet doesn&apos;t decide who is right or wrong. It measures{" "}
          <span className="font-medium">how stories are told</span> — language,
          sourcing, framing, and missing context — and turns that into a
          predictable, auditable signal. Higher PI means more stable, neutral
          storytelling.
        </p>
      </div>
    </div>
  );
}

function BiasLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-neutral-400">{label}</span>
      <span className="font-mono text-neutral-100">
        {value.toFixed(2)} / 3.00
      </span>
    </div>
  );
}
