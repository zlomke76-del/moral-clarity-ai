"use client";

import { useEffect } from "react";
import type { OutletDetailData, OutletTrendPoint } from "../types";
import TrendChart from "./TrendChart";
import OutletLogo from "./OutletLogo";

type Props = {
  open: boolean;
  onClose: () => void;
  outlet: OutletDetailData | null;
  trends: OutletTrendPoint[] | null;
};

export default function OutletDetailModal({ open, onClose, outlet, trends }: Props) {
  if (!open || !outlet) return null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const {
    canonical_outlet,
    display_name,
    storiesAnalyzed,
    lifetimePi,
    lifetimeBiasIntent,
    lifetimeLanguage,
    lifetimeSource,
    lifetimeFraming,
    lifetimeContext,
    lastScoredAt,
    biasProfileLabel,
    trend90Label,
    trendDirection,
  } = outlet;

  const trendIndicator =
    trendDirection === "up"
      ? "↑"
      : trendDirection === "down"
      ? "↓"
      : trendDirection === "flat"
      ? "→"
      : null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950/95 p-5 shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-[1px] text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
        >
          Esc
        </button>

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <OutletLogo domain={canonical_outlet} name={display_name} />
            <div className="space-y-0.5">
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Outlet
              </div>
              <div className="text-sm font-semibold text-neutral-50">
                {display_name}
              </div>
              <div className="text-xs text-neutral-400">{canonical_outlet}</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
              Predictability Index
            </div>
            <div className="font-mono text-2xl text-emerald-300">
              {lifetimePi.toFixed(1)}
            </div>
            <div className="text-[11px] text-neutral-400">
              {storiesAnalyzed} stories analyzed · PI based on lifetime.
            </div>
          </div>
        </div>

        {/* META */}
        <div className="mt-3 space-y-1 text-xs text-neutral-400">
          <div>
            Bias intent:{" "}
            <span className="font-mono text-neutral-100">
              {lifetimeBiasIntent.toFixed(2)} / 3.0
            </span>{" "}
            ({biasProfileLabel})
          </div>
          <div className="text-neutral-500">Last scored: {lastScoredAt}</div>

          {trend90Label && (
            <div className="text-[11px] text-neutral-500">
              90-day trend:{" "}
              {trendIndicator && (
                <span className="mr-1 font-mono text-neutral-300">
                  {trendIndicator}
                </span>
              )}
              {trend90Label}
            </div>
          )}
        </div>

        {/* COMPONENT SCORES */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <BiasBar label="Language" value={lifetimeLanguage} />
          <BiasBar label="Source" value={lifetimeSource} />
          <BiasBar label="Framing" value={lifetimeFraming} />
          <BiasBar label="Context" value={lifetimeContext} />
        </div>

        {/* TREND CHART */}
        <div className="mt-6">
          <TrendChart points={trends} loading={!trends && !!outlet} />
        </div>

        <p className="mt-4 text-[11px] text-neutral-500 leading-relaxed">
          This cabinet doesn’t decide who is right or wrong. It measures how
          stories are told — language, sourcing, framing, and missing context —
          and turns that into a predictable, auditable signal. Higher PI means
          more stable, neutral storytelling.
        </p>
      </div>
    </div>
  );
}

function BiasBar({ label, value }: { label: string; value: number }) {
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
