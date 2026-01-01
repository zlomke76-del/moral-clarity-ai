"use client";

import { useState } from "react";
import Image from "next/image";
import type { OutletOverview } from "../types";

// Mapping for known org names to domains for favicon fetching
const OutletDomainMap: Record<string, string> = {
  "BBC": "bbc.com",
  "Newsmax": "newsmax.com",
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
  "Fox News": "foxnews.com",
  "DW": "dw.com",
  "RFERL": "rferl.org",
  "Washington Examiner": "washingtonexaminer.com",
  "Time": "time.com",
  // Extend as new canonical names are added in merge logic
};

function getDomainForOutlet(outlet: string): string {
  if (
    outlet.includes(".") &&
    !outlet.includes(" ") &&
    !outlet.startsWith("http")
  ) {
    return outlet.trim().toLowerCase();
  }
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
  const domain = getDomainForOutlet(outlet.outlet);
  const [logoError, setLogoError] = useState(false);
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
          src={logoError ? "/default-favicon.png" : logoUrl}
          alt={`${outlet.outlet} logo`}
          width={20}
          height={20}
          className="rounded-sm"
          unoptimized
          onError={() => setLogoError(true)}
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
