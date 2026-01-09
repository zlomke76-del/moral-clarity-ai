"use client";

import { useState } from "react";
import Image from "next/image";
import type { OutletOverview } from "../types";

/**
 * Canonical mapping: outlet display name → primary domain
 * Used only when outlet name is NOT already a domain.
 */
const OUTLET_DOMAIN_MAP: Record<string, string> = {
  // Core outlets
  BBC: "bbc.com",
  Reuters: "reuters.com",
  PBS: "pbs.org",
  NPR: "npr.org",
  Bloomberg: "bloomberg.com",
  "Washington Post": "washingtonpost.com",
  "USA Today": "usatoday.com",
  CNN: "cnn.com",
  "Fox News": "foxnews.com",
  Politico: "politico.com",
  "The Guardian": "theguardian.com",
  "The Hill": "thehill.com",
  "France 24": "france24.com",
  "AP News": "apnews.com",
  DW: "dw.com",
  RFERL: "rferl.org",
  "Washington Examiner": "washingtonexaminer.com",
  Time: "time.com",
  Newsmax: "newsmax.com",
  "Mother Jones": "motherjones.com",

  // ✅ NY Times canonical (includes Cooking, Wirecutter, etc.)
  "NY Times": "nytimes.com",
  "New York Times": "nytimes.com",
};

/**
 * Detect whether a string already looks like a domain.
 */
function isDomain(value: string): boolean {
  return /\./.test(value) && !value.includes(" ");
}

/**
 * Resolve domain for favicon usage only.
 */
function resolveDomain(outlet: string): string {
  const trimmed = outlet.trim();
  if (isDomain(trimmed)) return trimmed.toLowerCase();
  return OUTLET_DOMAIN_MAP[trimmed] || "";
}

/**
 * Derive a human-readable label from a domain.
 * Purely cosmetic.
 */
function formatDomainLabel(domain: string): string {
  return domain
    .replace(/^www\./, "")
    .replace(/^amp\./, "")
    .replace(/\.(com|org|net|gov|edu|co\.uk)$/, "")
    .replace(/[-.]/g, " ")
    .toUpperCase();
}

type Props = {
  outlet: OutletOverview;
  rank: number;
  selected: boolean;
  badge: "golden" | "neutral" | "watchlist"; // structural only
  onSelect: () => void;
};

/**
 * OutletCard
 * Strictly descriptive UI.
 * No evaluative semantics.
 */
export default function OutletCard({
  outlet,
  rank,
  selected,
  onSelect,
}: Props) {
  const [logoError, setLogoError] = useState(false);

  const rawName = outlet.outlet || "UNKNOWN";
  const domain = resolveDomain(rawName);

  const displayName = isDomain(rawName)
    ? formatDomainLabel(rawName)
    : rawName;

  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : "/default-favicon.png";

  const rawPi =
    typeof (outlet as any).avg_pi_weighted === "number"
      ? (outlet as any).avg_pi_weighted
      : null;

  const displayPi = rawPi !== null ? (rawPi * 100).toFixed(2) : "?";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
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
          src={logoError ? "/default-favicon.png" : faviconUrl}
          alt={`${displayName} favicon`}
          width={20}
          height={20}
          className="rounded-sm"
          unoptimized
          onError={() => setLogoError(true)}
        />

        <div className="text-sm font-medium text-neutral-100">
          {displayName}
        </div>

        <div className="text-xs text-amber-300">
          PI {displayPi}
        </div>

        <div className="text-xs text-neutral-400">
          {Number(outlet.total_stories).toLocaleString()} stories analyzed
        </div>
      </div>
    </button>
  );
}
