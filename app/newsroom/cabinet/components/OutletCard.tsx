"use client";

import Image from "next/image";
import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview;
  rank: number;
  selected: boolean;
  badge: "golden" | "neutral" | "watchlist";
  onSelect: () => void;
};

export default function OutletCard({
  outlet,
  rank,
  selected,
  badge,
  onSelect,
}: Props) {
  const domain = outlet.canonical_outlet;

  // ✅ SAFE logo source (not blocked by tracking prevention)
  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-lg border px-4 py-3 text-left transition
        ${
          selected
            ? "border-amber-400/60 bg-amber-400/10"
            : "border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900"
        }
      `}
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className="w-6 text-xs text-neutral-400">#{rank}</div>

        {/* Logo */}
        <Image
          src={logoUrl}
          alt={`${domain} logo`}
          width={20}
          height={20}
          className="rounded-sm"
          unoptimized
        />

        {/* Text */}
        <div className="flex-1">
          <div className="text-sm font-medium text-neutral-100">
            {domain}
          </div>
          <div className="text-xs text-neutral-400">
            {outlet.total_stories} stories analyzed · PI{" "}
            {(outlet.avg_pi * 100).toFixed(1)}
          </div>
        </div>
      </div>
    </button>
  );
}
