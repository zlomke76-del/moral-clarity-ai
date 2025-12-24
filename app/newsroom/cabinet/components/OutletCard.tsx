"use client";

import Image from "next/image";
import type { OutletOverview } from "../../types";

type Props = {
  outlet: OutletOverview;
  rank: number;
  selected: boolean;
  badge: "golden" | "neutral" | "watchlist";
  onSelect: () => void;
};

/* ========= DISPLAY HELPERS (UI ONLY) ========= */

/**
 * Human-readable outlet name.
 * Display-only. Does not affect canonical identity.
 */
function formatOutletDisplay(domain: string): string {
  if (!domain) return "UNKNOWN";

  return domain
    .replace(/^amp\./i, "")
    .replace(/^www\./i, "")
    .replace(/\.co\.uk$/i, "")
    .replace(/\.(com|org|net)$/i, "")
    .toUpperCase();
}

export default function OutletCard({
  outlet,
  rank,
  selected,
  badge,
  onSelect,
}: Props) {
  // 🔒 CANONICAL DOMAIN (single source of truth)
  const domain = outlet.canonical_outlet;

  // ✅ SAFE favicon source
  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  // 🔒 PI DISPLAY (weighted, percent)
  const pi =
    typeof outlet.avg_pi_weighted === "number"
      ? (outlet.avg_pi_weighted * 100).toFixed(2)
      : null;

  return (
    <button
      onClick={onSelect}
      className={`rounded-lg border px-4 py-3 text-left transition
        ${
          selected
            ? "border-amber-400/60 bg-amber-400/10"
            : "border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900"
        }
      `}
    >
      <div className="flex flex-col items-start gap-1">
        {/* Rank */}
        <div className="text-xs text-neutral-400">#{rank}</div>

        {/* Logo */}
        <Image
          src={logoUrl}
          alt={`${domain} logo`}
          width={20}
          height={20}
          className="rounded-sm"
          unoptimized
        />

        {/* Outlet Name */}
        <div className="text-sm font-medium text-neutral-100">
          {formatOutletDisplay(domain)}
        </div>

        {/* PI */}
        <div className="text-xs text-amber-300">
          PI {pi ?? "—"}
        </div>

        {/* Story Count */}
        <div className="text-xs text-neutral-400">
          {outlet.total_stories.toLocaleString()} stories analyzed
        </div>
      </div>
    </button>
  );
}
