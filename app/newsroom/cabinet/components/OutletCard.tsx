"use client";

import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview;
  rank: number;
  badge: "golden" | "neutral" | "watchlist";
  selected: boolean;
  onSelect: () => void;
};

function formatPI(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return (Math.floor(value * 100) / 100).toFixed(2);
}

function logoUrl(domain: string) {
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}?size=64`;
}

export default function OutletCard({
  outlet,
  rank,
  badge,
  selected,
  onSelect,
}: Props) {
  const domain = outlet.canonical_outlet?.trim() ?? "unknown";
  const pi = formatPI(outlet.avg_pi);
  const stories = outlet.total_stories ?? 0;

  const glow =
    badge === "golden"
      ? "shadow-[0_0_30px_rgba(255,215,128,0.45)]"
      : badge === "watchlist"
      ? "shadow-[0_0_30px_rgba(255,80,80,0.45)]"
      : "";

  return (
    <button
      onClick={onSelect}
      className={`relative w-56 rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-left transition ${
        selected ? "ring-2 ring-neutral-300" : ""
      } ${glow}`}
    >
      <div className="absolute top-1 right-2 text-xs text-neutral-400">
        #{rank}
      </div>

      <div className="flex items-center gap-2 mb-2">
        {logoUrl(domain) && (
          <img
            src={logoUrl(domain)!}
            alt={`${domain} logo`}
            className="h-6 w-6 rounded-sm bg-neutral-900"
            loading="lazy"
          />
        )}
        <div className="text-sm font-semibold text-neutral-100">
          {domain}
        </div>
      </div>

      <div className="text-xs text-neutral-300">
        {stories} stories analyzed
      </div>

      <div className="mt-1 text-sm font-bold text-neutral-100">
        PI {pi}
      </div>
    </button>
  );
}
