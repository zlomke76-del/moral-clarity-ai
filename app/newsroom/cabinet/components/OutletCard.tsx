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
 * Truncate (do NOT round) a number to 1 decimal place.
 * Example: 81.25 -> 81.2 (not 81.3)
 */
function trunc1(n: number): number {
  if (!Number.isFinite(n)) return 0;
  // toward zero
  return Math.trunc(n * 10) / 10;
}

/**
 * avg_pi is 0..1 (canonical). We display PI as 0..100.
 * NO rounding up: truncate to 1 decimal.
 */
function formatPiPercent(avgPi: number): string {
  const percent = avgPi * 100;
  const t = trunc1(percent);
  return t.toFixed(1); // safe: already truncated, this just prints 1 decimal
}

/**
 * Stories line uses whole number.
 */
function formatStories(n: number): string {
  const v = Number.isFinite(n) ? Math.trunc(n) : 0;
  return v.toString();
}

function badgeGlowClass(badge: Badge): string {
  // Glow is behind the card (gold for top 3, red for bottom 3)
  if (badge === "golden") return "mc-outlet-glow-gold";
  if (badge === "watchlist") return "mc-outlet-glow-red";
  return "";
}

function badgeLabel(badge: Badge): string {
  if (badge === "golden") return "Golden Anchor";
  if (badge === "watchlist") return "Watchlist";
  return "Neutral";
}

export default function OutletCard({
  outlet,
  rank,
  selected,
  badge,
  onSelect,
}: Props) {
  const displayDomain =
    outlet.canonical_outlet?.trim() || outlet.outlet?.trim() || "unknown";

  const stories = formatStories(outlet.total_stories);
  const piText = formatPiPercent(outlet.avg_pi);

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
      aria-label={`${badgeLabel(badge)} #${rank}: ${displayDomain}`}
    >
      {/* Rank */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-white/90">#{rank}</div>
        {/* keep space for emblem in your existing design system if present */}
      </div>

      {/* Logo slot (your existing logo rendering should live here; this file does NOT fetch clearbit) */}
      <div className="mt-1 flex items-center justify-center">
        {/* If you already inject a logo image component elsewhere, keep it.
            This placeholder prevents layout jump. */}
        <div className="h-6 w-6 rounded-sm bg-white/10" />
      </div>

      {/* Domain */}
      <div className="mt-1 text-sm font-semibold text-white/95">
        {displayDomain}
      </div>

      {/* Credibility line (your mandated format) */}
      <div className="mt-0.5 text-[12px] leading-tight text-white/90">
        {stories} stories analyzed · PI based on lifetime.
      </div>

      {/* PI */}
      <div className="mt-0.5 text-[12px] leading-tight text-white/90">
        PI {piText}
      </div>
    </button>
  );
}

/**
 * Minimal glow classes (assumes Tailwind is available).
 * If you already have these in globals.css, remove duplicates there and keep one source of truth.
 *
 * Gold = subtle amber halo
 * Red  = subtle red halo
 */
