// app/newsroom/cabinet/components/OutletDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { OutletDetailData, OutletTrendPoint } from "../types";
import TrendChart from "./TrendChart";
import OutletLogo from "./OutletLogo";

type Props = {
  open: boolean;
  outlet: OutletDetailData | null;
  trends: OutletTrendPoint[] | null;
  onClose: () => void;
};

export default function OutletDetailModal({
  open,
  outlet,
  trends,
  onClose,
}: Props) {
  const [mounted, setMounted] = useState(false);

  // Ensure this only runs on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (!mounted) return;
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, open, onClose]);

  if (!mounted || !open || !outlet) return null;

  // Render into <body> so Solace / layout containers cannot hijack positioning
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950/95 p-4 sm:p-6 shadow-2xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-700/70 bg-neutral-900/80 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
          aria-label="Close details"
        >
          Esc
        </button>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <OutletLogo
              domain={outlet.canonical_outlet}
              name={outlet.display_name}
              className="h-10 w-10"
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
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            {outlet.tierLabel && (
              <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-[2px] text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-300">
                {outlet.tierLabel}
              </span>
            )}
            <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
              Predictability Index
            </div>
            <div className="font-mono text-2xl text-emerald-300">
              {outlet.lifetimePi.toFixed(1)}
            </div>
            <div className="text-[11px] text-neutral-400">
              {outlet.storiesAnalyzed} stories analyzed · PI based on lifetime.
            </div>
          </div>
        </div>

        {/* Bias profile summary */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-200">
              Bias profile (0–3, lower is more neutral)
            </div>
            <div className="text-[11px] text-neutral-400">
              Bias intent:{" "}
              <span className="font-mono text-neutral-100">
                {outlet.lifetimeBiasIntent.toFixed(2)} / 3.00
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-neutral-400">
              <BiasRow label="Language" value={outlet.lifetimeLanguage} />
              <BiasRow label="Source" value={outlet.lifetimeSource} />
              <BiasRow label="Framing" value={outlet.lifetimeFraming} />
              <BiasRow label="Context" value={outlet.lifetimeContext} />
            </div>
            {outlet.lastScoredAt && (
              <div className="mt-1 text-[11px] text-neutral-500">
                Last scored: {outlet.lastScoredAt}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-200">
              90-day trend
            </div>
            <div className="text-[11px] text-neutral-400">
              {outlet.trendDirection === "up" &&
                "PI is trending upward (more predictable, more stable)."}
              {outlet.trendDirection === "down" &&
                "PI is trending downward (less predictable, stronger bias)."}
              {outlet.trendDirection === "flat" &&
                "PI is broadly stable over the last 90 days."}
              {!outlet.trendDirection &&
                "Not enough recent stories to compute a 90-day trend yet."}
            </div>
            <TrendChart points={trends} loading={!trends} />
          </div>
        </div>

        {/* Footer copy */}
        <p className="mt-4 text-[11px] text-neutral-500">
          This cabinet doesn&apos;t decide who is right or wrong. It measures
          how stories are told — language, sourcing, framing, and missing
          context — and turns that into a predictable, auditable signal. Higher
          PI means more stable, neutral storytelling.
        </p>
      </div>
    </div>,
    document.body
  );
}

function BiasRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{label}</span>
      <span className="font-mono text-neutral-100">
        {value.toFixed(2)} / 3.00
      </span>
    </div>
  );
}
