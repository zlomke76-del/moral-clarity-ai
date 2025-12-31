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

function formatOutletDisplay(outlet: string): string {
  if (!outlet) return "UNKNOWN";
  return outlet
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
  const canonical = outlet.outlet;  // FIXED: Use `outlet.outlet`
  const logoUrl = `https://www.google.com/s2/favicons?domain=${canonical}&sz=64`;

  const pi =
    typeof (outlet as any).avg_pi_weighted === "number"
      ? ((outlet as any).avg_pi_weighted * 100).toFixed(2)
      : undefined;

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
          PI {pi ?? "?"}
        </div>
        <div className="text-xs text-neutral-400">
          {Number(outlet.total_stories).toLocaleString()} stories analyzed
        </div>
      </div>
    </button>
  );
}
