"use client";

import React from "react";
import type { OutletOverview } from "../types";

type Badge = "golden" | "neutral" | "watchlist";

type Props = {
  outlet: OutletOverview;
  rank: number;
  selected: boolean;
  badge: Badge;
  onSelect: () => void;
};

/**
 * Truncate (do NOT round) to 1 decimal place.
 * Example: 78.25 -> 78.2
 */
function trunc1(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.trunc(n * 10) / 10;
}

/**
 * avg_pi is 0..1 → display 0..100
 * Truncated, never rounded.
 */
function formatPiPercent(avgPi: number): string {
  const percent = avgPi * 100;
  const truncated = trunc1(percent);
  return truncated.toFixed(1);
}

function badgeGlowClass(badge: Badge): string {
  if (badge === "golden") return "mc-outlet-glow-gold";
  if (badge === "watchlist") return "mc-outlet-glow-red";
  return "";
}

export default function OutletCard({
  outlet,
  rank,
  selected,
  badge,
  onSelect,
}: Props) {
  const displayDomain = outlet.canonical_outlet.trim();

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "relative",
        "w-[220px]",
        "rounded-md",
        "border",
        "bg-neutral-800/55",
        "px-3",
        "py-2",
        "text-left",
        "transition",
        "hover:bg-neutral-800/70",
        selected ? "border-white/35" : "border-white/20",
        badgeGlowClass(badge),
      ].join(" ")}
      aria-label={`#${rank} ${displayDomain}`}
    >
      {/* Rank */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-white/90">#{rank}</div>
      </div>

      {/* Logo slot — your existing logo renderer can live here */}
      <div className="mt-1 flex items-center justify-center">
        <div className="h-6 w-6 rounded-sm bg-white/10" />
      </div>

      {/* Outlet name */}
      <div className="mt-1 text-sm font-semibold text-white/95">
        {displayDomain}
      </div>

      {/* Credibility line (your required format) */}
      <div className="mt-0.5 text-[12px] leading-tight text-white/90">
        {outlet.total_stories} stories analyzed · PI based on lifetime.
      </div>

      {/* PI */}
      <div className="mt-0.5 text-[12px] leading-tight text-white/90">
        PI {formatPiPercent(outlet.avg_pi)}
      </div>
    </button>
  );
}
