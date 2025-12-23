"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { OutletTrendPoint } from "../types";
import OutletLogo from "./OutletLogo";
import TrendChart from "./TrendChart";

export type OutletDetailData = {
  canonical_outlet: string;
  display_name: string;
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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || !outlet || typeof document === "undefined") return null;

  const piPercent = (outlet.lifetimePi * 100).toFixed(1);

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
      <button
        className="absolute inset-0"
        aria-label="Close"
        onClick={() => onOpenChange(false)}
      />

      <div
        className="relative z-10 max-w-3xl w-full rounded-2xl border border-neutral-800 bg-neutral-950/95 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <OutletLogo
              domain={outlet.canonical_outlet}
              name={outlet.display_name}
            />
            <div>
              <div className="text-sm font-semibold">
                {outlet.display_name}
              </div>
              <div className="text-xs text-neutral-500">
                {outlet.canonical_outlet}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-neutral-400">PI</div>
            <div className="font-mono text-xl text-emerald-300">
              {piPercent}
            </div>
            <div className="text-[11px] text-neutral-400">
              {outlet.storiesAnalyzed} stories analyzed
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <BiasBar label="Language" value={outlet.lifetimeLanguage} />
          <BiasBar label="Source" value={outlet.lifetimeSource} />
          <BiasBar label="Framing" value={outlet.lifetimeFraming} />
          <BiasBar label="Context" value={outlet.lifetimeContext} />
        </div>

        <div className="mt-6">
          <TrendChart points={trends} loading={!trends} />
        </div>
      </div>
    </div>,
    document.body
  );
}

function BiasBar({ label, value }: { label: string; value: number }) {
  const width = Math.max(4, Math.min((value / 3) * 100, 100));
  return (
    <div>
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span>{label}</span>
        <span className="font-mono">{value.toFixed(2)} / 3.00</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-neutral-900">
        <div
          className="h-full rounded-full bg-neutral-200"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
