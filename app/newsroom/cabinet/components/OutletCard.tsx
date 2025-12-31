"use client";

import Image from "next/image";
import type { OutletOverview } from "../types";

// Known outlet-name to actual domain mapping
const OutletDomainMap: Record<string, string> = {
  "Washington Post": "washingtonpost.com",
  "Mother Jones": "motherjones.com",
  "PBS": "pbs.org",
  "NPR": "npr.org",
  "Reuters": "reuters.com",
  "Politico": "politico.com",
  "The Hill": "thehill.com",
  "France 24": "france24.com",
  "AP News": "apnews.com",
  "The Guardian": "theguardian.com",
  "CNN": "cnn.com",
  "USA Today": "usatoday.com",
  "Bloomberg": "bloomberg.com",
  // expand as needed
};

function getDomainForOutlet(outlet: string): string {
  // Heuristic: real domain is easy if it contains a dot, no spaces, and not a URL
  if (
    outlet.includes(".") &&
    !outlet.includes(" ") &&
    !outlet.startsWith("http")
  ) {
    return outlet.trim().toLowerCase();
  }
  // Otherwise, try mapping
  return OutletDomainMap[outlet.trim()] || "";
}

type Props = {
  outlet: OutletOverview;
  rank: number;
  selected: boolean;
  badge: "golden" | "neutral" | "watchlist";
  onSelect: () => void;
};

function formatOutletDisplay(outlet: string): string {
  if (!outlet) return "UNKNOWN";
  // Remove common prefixes and TLDs for display value
  return outlet
    .replace(/^amp\./i, "")
    .replace(/^www\./i, "")
    .replace(/\.co\.uk$/i, "")
    .replace(/\.(com|org|net|gov|edu)$/i, "")
    .replace(/-/g, " ")
    .toUpperCase();
}

export default function OutletCard({
  outlet,
  rank,
  selected,
  badge,
  onSelect,
}: Props) {
  // Find canonical domain
  const domain = getDomainForOutlet(outlet.outlet);
  const logoUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : "/default-favicon.png";

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
          alt={`${outlet.outlet} logo`}
          width={20}
          height={20}
          className="rounded-sm"
          unoptimized
          onError={(e) => {
            // fallback to generic icon if favicon fetch fails
            (e.currentTarget as HTMLImageElement).src = "/default-favicon.png";
          }}
        />
        <div className="text-sm font-medium text-neutral-100">
          {formatOutletDisplay(domain || outlet.outlet)}
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
