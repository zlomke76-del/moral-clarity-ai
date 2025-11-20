// app/newsroom/cabinet/components/OutletDetailModal.tsx
"use client";

import { useEffect } from "react";
import type { OutletDetailData, OutletTrendPoint } from "../types";
import OutletLogo from "./OutletLogo";

type Props = {
  open: boolean;
  outlet: OutletDetailData | null;
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
  // Don’t render at all if closed
  if (!open || !outlet) return null;

  // Close on Esc
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const piLabel = outlet.lifetimePi.toFixed(1);
  const biasIntentLabel = outlet.lifetimeBiasIntent.toFixed(2);

  // small helper for daily snapshot list
  const recentSnapshots =
    trends && trends.length
      ? [...trends].slice(-7) // last 7 days if available
      : [];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-950/95 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: logo + outlet name + close */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <OutletLogo
              domain={outlet.canonical_outlet}
              name={outlet.display_name}
              className="h-12 w-12"
            />
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Outlet
              </div>
              <div className="text-sm font-semibold text-neutral-100">
                {outlet.display_name}
              </div>
              <div className="text-[11px] text-neutral-400">
                {outlet.canonical_outlet}
              </div>
              <div className="mt-1 text-[11px] text-neutral-400">
                {outlet.storiesAnalyzed} stories analyzed · PI based on
                lifetime.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-700 px-2 py-1 text-[11px] text-neutral-300 hover:bg-neutral-800"
          >
            Esc
          </button>
        </div>

        {/* Lifetime PI + bias intent */}
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
              Lifetime PI
            </div>
            <div className="font-mono text-2xl text-emerald-300">
              {piLabel}
            </div>
            <div className="mt-1 text-[11px] text-neutral-400">
              Bias intent{" "}
              <span className="font-mono text-neutral-100">
                {biasIntentLabel}
              </span>{" "}
              (0 = neutral, 3 = strong bias)
            </div>
          </div>
        </div>

        {/* Bias profile */}
        <div className="mt-4 space-y-2">
          <div className="text-xs font-semibold text-neutral-200">
            Bias profile (0–3, lower is more neutral)
          </div>

          <BiasRow label="Language" value={outlet.lifetimeLanguage} />
          <BiasRow label="Source" value={outlet.lifetimeSource} />
          <BiasRow label="Framing" value={outlet.lifetimeFraming} />
          <BiasRow label="Context" value={outlet.lifetimeContext} />

          <div className="mt-1 text-[11px] text-neutral-500">
            Last scored: {outlet.lastScoredAt}
          </div>
        </div>

        {/* 90-day trend */}
        <div className="mt-4 space-y-1">
          <div className="text-xs font-semibold text-neutral-200">
            90-day trend
          </div>
          <div className="text-[11px] text-neutral-400">
            {trendLoading
              ? "Loading 90-day trend…"
              : outlet.ninetyDaySummary}
          </div>
        </div>

        {/* Daily snapshots */}
        <div className="mt-4 space-y-1">
          <div className="text-xs font-semibold text-neutral-200">
            Daily PI snapshots (recent days)
          </div>
          {recentSnapshots.length === 0 ? (
            <div className="text-[11px] text-neutral-500">
              No daily snapshots yet for this outlet.
            </div>
          ) : (
            <ul className="mt-1 space-y-0.5 text-[11px] text-neutral-300">
              {recentSnapshots.map((p) => (
                <li
                  key={p.story_day}
                  className="flex justify-between font-mono"
                >
                  <span>{p.story_day.slice(5)}</span>
                  <span>{(p.avg_pi_score * 100).toFixed(1)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer explainer */}
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

function BiasRow({ label, value }: { label: string; value: number }) {
  const width = Math.max(4, Math.min((value / 3) * 100, 100));

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span>{label}</span>
        <span className="font-mono text-neutral-200">
          {value.toFixed(2)} / 3.00
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-neutral-900">
        <div
          className="h-full rounded-full bg-neutral-200"
          style={{ width: `${width.toFixed(1)}%` }}
        />
      </div>
    </div>
  );
}

