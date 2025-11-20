"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import OutletLogo from "./OutletLogo";
import type { OutletTrendPoint } from "../types";

export type OutletDetailData = {
  canonical_outlet: string;
  display_name: string;
  tierLabel: string;
  storiesAnalyzed: number;
  lifetimePi: number; // 0..1
  lifetimeBiasIntent: number; // 0..3
  lifetimeLanguage: number;
  lifetimeSource: number;
  lifetimeFraming: number;
  lifetimeContext: number;
  lastScoredAt: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outlet: OutletDetailData | null;
  trends: OutletTrendPoint[] | null;
};

export default function OutletDetailDialog({
  open,
  onOpenChange,
  outlet,
  trends,
}: Props) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || !outlet) return null;
  if (typeof document === "undefined") return null;

  const piPercent = (outlet.lifetimePi * 100).toFixed(1);
  const biasIntent = outlet.lifetimeBiasIntent.toFixed(2);

  const canComputeTrend = trends && trends.length >= 3;

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-3 py-6">
      {/* backdrop click */}
      <button
        type="button"
        aria-label="Close outlet detail"
        className="absolute inset-0 cursor-default"
        onClick={() => onOpenChange(false)}
      />

      <div
        className="relative z-10 max-h-full w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-950/95 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
          <div className="flex items-center gap-3">
            <OutletLogo
              domain={outlet.canonical_outlet}
              name={outlet.display_name}
              className="h-9 w-9"
            />
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Outlet
              </div>
              <div className="text-sm font-semibold text-neutral-100">
                {outlet.display_name}
              </div>
              <div className="text-[11px] text-neutral-500">
                {outlet.canonical_outlet}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-neutral-400">PI</span>
              <span className="font-mono text-xl text-emerald-300">
                {piPercent}
              </span>
            </div>
            <div className="text-[11px] text-neutral-400">
              {outlet.storiesAnalyzed} stories analyzed · PI based on lifetime
            </div>
            {outlet.tierLabel && (
              <span className="inline-flex items-center rounded-full bg-neutral-900 px-2 py-[2px] text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-200">
                {outlet.tierLabel}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] text-xs text-neutral-200">
          {/* Left: bias profile */}
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Bias profile
              </div>
              <div className="text-[11px] text-neutral-400">
                (0–3, lower is more neutral)
              </div>
            </div>

            {/* Overall bias intent */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Bias intent</span>
                <span className="font-mono text-neutral-100">
                  {biasIntent} / 3.00
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400"
                  style={{
                    width: `${Math.max(
                      4,
                      Math.min((outlet.lifetimeBiasIntent / 3) * 100, 100)
                    ).toFixed(1)}%`,
                  }}
                />
              </div>
            </div>

            {/* Components */}
            <div className="space-y-2">
              <BiasBar label="Language" value={outlet.lifetimeLanguage} />
              <BiasBar label="Source" value={outlet.lifetimeSource} />
              <BiasBar label="Framing" value={outlet.lifetimeFraming} />
              <BiasBar label="Context" value={outlet.lifetimeContext} />
            </div>

            <div className="pt-1 text-[11px] text-neutral-500">
              {outlet.lastScoredAt && (
                <div className="mb-1">
                  Last scored: {outlet.lastScoredAt}
                </div>
              )}
              <p>
                This cabinet doesn&apos;t decide who is right or wrong. It
                measures how stories are told — language, sourcing, framing, and
                missing context — and turns that into a predictable, auditable
                signal. Higher PI means more stable, neutral storytelling.
              </p>
            </div>
          </div>

          {/* Right: trend summary + mini chart */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                90-day trend
              </div>
              <div className="text-[11px] text-neutral-300">
                {canComputeTrend
                  ? "PI trend over recent scored days. Higher bars mean more predictable, neutral storytelling."
                  : "Not enough recent stories to compute a 90-day trend yet."}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3">
              {trends && trends.length > 0 ? (
                <MiniTrendChart points={trends} />
              ) : (
                <div className="text-[11px] text-neutral-400">
                  Daily PI snapshots will appear here once more stories are
                  scored.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function BiasBar({ label, value }: { label: string; value: number }) {
  const width = Math.max(4, Math.min((value / 3) * 100, 100));

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span>{label}</span>
        <span className="font-mono text-neutral-100">
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

function MiniTrendChart({ points }: { points: OutletTrendPoint[] }) {
  const maxPi = 1;
  const minPi = 0;

  return (
    <div className="h-32 w-full overflow-x-auto">
      <div className="flex h-full items-end gap-1">
        {points.map((p) => {
          const norm = (p.avg_pi_score - minPi) / (maxPi - minPi || 1); // 0..1
          const height = 20 + norm * 80; // px

          return (
            <div key={p.story_day} className="flex flex-col items-center">
              <div
                className="w-3 rounded-t-md bg-emerald-400/80"
                style={{ height: `${height}px` }}
                title={`${p.story_day}: PI ${p.avg_pi_score.toFixed(3)}`}
              />
              <div className="mt-1 w-6 rotate-90 whitespace-nowrap text-[9px] text-neutral-500">
                {p.story_day.slice(5)} {/* MM-DD */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
