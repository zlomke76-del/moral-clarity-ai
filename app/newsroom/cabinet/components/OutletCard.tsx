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
  // 🔒 CANONICAL IDENTIFIER (STATE / ROUTING SAFE)
  const canonical = outlet.canonical_outlet;

  // ✅ SAFE favicon source (display only)
  const logoUrl = `https://www.google.com/s2/favicons?domain=${canonical}&sz=64`;

  // 🔒 PI DISPLAY — OVERVIEW CONTRACT
  const pi =
    typeof outlet.avg_pi === "number"
      ? (outlet.avg_pi * 100).toFixed(2)
      : null;

  return (
    <button
      type="button"
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
        <div className="text-xs text-neutral-400">#{rank}</div>

        <Image
          src={logoUrl}
          alt={`${canonical} logo`}
          width={20}
          height={20}
          className="rounded-sm"
          unoptimized
        />

        <div className="text-sm font-medium text-neutral-100">
          {formatOutletDisplay(canonical)}
        </div>

        <div className="text-xs text-amber-300">
          PI {pi ?? "—"}
        </div>

        <div className="text-xs text-neutral-400">
          {outlet.total_stories.toLocaleString()} stories analyzed
        </div>
      </div>
    </button>
  );
}
