"use client";

import React from "react";
import type { OutletOverview } from "../types";

type Badge = "golden" | "neutral" | "watchlist";

type Props = {
  outlet: OutletOverview;
  rank: number;
  badge: Badge;
  selected: boolean;
  onSelect: () => void;
};

/**
 * AUTHORITATIVE PI FORMATTER
 * - Always numeric
 * - Always 2 decimals
 * - Never mutates ranking value
 */
function formatPI(pi: number): string {
  if (Number.isNaN(pi)) return "—";
  return pi.toFixed(2);
}

function formatStories(n: number): string {
  return `${n} stories analyzed`;
}

export default function OutletCard({
  outlet,
  rank,
  badge,
  selected,
  onSelect,
}: Props) {
  const domain = outlet.canonical_outlet.trim();
  const piText = formatPI(outlet.avg_pi);
  const storiesText = formatStories(outlet.total_stories);

  const glow =
    badge === "golden"
      ? "shadow-[0_0_25px_rgba(255,200,80,0.45)]"
      : badge === "watchlist"
      ? "shadow-[0_0_25px_rgba(255,80,80,0.45)]"
      : "";

  return (
    <button
      onClick={onSelect}
      className={[
        "relative w-[220px] rounded-lg border border-neutral-600",
        "bg-neutral-800/90 text-neutral-100",
        "px-3 py-2 text-left transition",
        "hover:border-neutral-400",
        glow,
        selected ? "ring-2 ring-neutral-300" : "",
      ].join(" ")}
    >
      {/* Rank */}
      <div className="absolute top-1 left-2 text-xs text-neutral-400">
        #{rank}
      </div>

      {/* Outlet Logo */}
      <div className="flex justify-center mb-1">
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={domain}
          className="h-6 w-6 object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Domain */}
      <div className="text-xs text-center text-neutral-300 truncate">
        {domain}
      </div>

      {/* Stories */}
      <div className="mt-1 text-[11px] text-neutral-400 text-center">
        {storiesText}
      </div>

      {/* PI — PRIMARY SIGNAL */}
      <div className="mt-1 text-sm font-semibold text-center text-white">
        PI {piText}
      </div>
    </button>
  );
}
