// app/newsroom/cabinet/components/OutletDetailModal.tsx
"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
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

function computeTrendSummary(points: OutletTrendPoint[] | null): string {
  if (!points || points.length < 2) {
    return "Not enough recent stories to compute a 90-day trend yet.";
  }

  const first = points[0];
  const last = points[points.length - 1];
  const delta = last.avg_pi_score - first.avg_pi_score;

  if (delta > 0.015) {
    return "90-day trend: PI is trending upward (more predictable, more neutral).";
  }
  if (delta < -0.015) {
    return "90-day trend: PI is trending downward (less predictable, stronger bias).";
  }
  return "90-day trend: PI is relatively stable over the recent window.";
}

export default function OutletDetailModal({
  open,
  outlet,
  trends,
  trendLoading,
  onClose,
}: Props) {
  // SSR guard
  if (typeof document === "undefined") return null;

  // Close on ESC
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

  // Lock scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !outlet) return null;

  const displayName = outlet.canonical_outlet;
  const lifetimePi = outlet.avg_pi;
  const biasIntent = outlet.avg_bias_intent;

  const lang = outlet.bias_language;
  const src = outlet.bias_source;
  const frm = outlet.bias_framing;
  const ctx = outlet.bias_context;

  const lastScored =
    outlet.last_story_day && outlet.last_story_day.length
      ? outlet.last_story_day
      : "—";

  const tierLabel =
    (outlet as any).tier_label ||
    (outlet as any).tierLabel ||
    (outlet as any).tier ||
    "";

  const trendSummary = computeTrendSummary(trends);

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-3xl rounded-2xl border border-neutral-700/80 bg-neutral-950/95 shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <OutletLogo
              domain={outlet.canonical_outlet}
              name={displayName}
              className="h-10 w-10"
            />
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                Outlet
              </div>
              <div className="text-sm font-semibold text-neutral-100">
                {displayName}
              </div>
              <div className="text-[11px] text-neutral-400">
                {outlet.total_stories} stories analyzed · PI based on lifetime.
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {tierLabel ? (
              <span className="inline-flex rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2 py-[2px] text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300">
                {tierLabel}
              </span>
            ) : null}
            <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
              Lifetime PI
            </div>
            <div className="font-mono text-xl text-emerald-300">
              {(lifetimePi ?? 0).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-4 text-xs text-neutral-200">
          {/* Bias profile */}
          <div>
            <div className="font-semibold text-neutral-100">Bias profile</div>
            <div className="mt-1 text-[11px] text-neutral-400">
              (0–3, lower is more neutral)
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <BiasRow label="Bias intent" value={biasIntent} />
              <BiasRow label="Language" value={lang} />
              <BiasRow label="Source" value={src} />
              <BiasRow label="Framing" value={frm} />
              <BiasRow label="Context" value={ctx} />
            </div>
          </div>

          {/* Meta */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-neutral-300">
                Last scored
              </div>
              <div className="text-[11px] text-neutral-200">{lastScored}</div>
              <div className="text-[11px] text-neutral-400">
                Days active:{" "}
                <span className="font-mono">
                  {outlet.days_active ?? 0} day
                  {outlet.days_active === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-neutral-300">
                90-day trend
              </div>
              <div className="text-[11px] text-neutral-200">
                {trendLoading ? "Loading trend…" : trendSummary}
              </div>
            </div>
          </div>

          {/* Trend chart */}
          <div className="mt-2">
            <TrendChart points={trends} loading={trendLoading} />
          </div>

          {/* Footer explainer */}
          <p className="pt-1 text-[11px] text-neutral-500">
            This cabinet doesn&apos;t decide who is right or wrong. It measures{" "}
            <span className="font-medium">how stories are told</span> — language,
            sourcing, framing, and missing context — and turns that into a
            predictable, auditable signal. Higher PI means more stable, neutral
            storytelling.
          </p>
        </div>

        {/* Close bar */}
        <div className="flex items-center justify-end border-t border-neutral-800/80 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-600 bg-neutral-900 px-3 py-1 text-[11px] font-medium text-neutral-200 hover:border-neutral-400 hover:bg-neutral-800"
          >
            Esc to close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

function BiasRow({ label, value }: { label: string; value: number }) {
  const v = Number.isFinite(value) ? value : 0;

  return (
    <div className="flex items-center justify-between rounded-lg bg-neutral-900/70 px-3 py-1.5">
      <span className="text-[11px] text-neutral-300">{label}</span>
      <span className="font-mono text-[11px] text-neutral-100">
        {v.toFixed(2)} / 3.00
      </span>
    </div>
  );
}

