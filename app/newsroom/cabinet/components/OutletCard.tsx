"use client";

import { useState } from "react";
import Image from "next/image";
import type { OutletOverview } from "../types";

/**
 * Canonical mapping: outlet display name → primary domain
 * Used exclusively for favicon retrieval.
 * No semantic meaning is inferred from domain choice.
 */
const OUTLET_DOMAIN_MAP: Record<string, string> = {
  BBC: "bbc.com",
  Newsmax: "newsmax.com",
  "Washington Post": "washingtonpost.com",
  "Mother Jones": "motherjones.com",
  PBS: "pbs.org",
  NPR: "npr.org",
  Reuters: "reuters.com",
  Politico: "politico.com",
  "The Hill": "thehill.com",
  "France 24": "france24.com",
  "AP News": "apnews.com",
  "The Guardian": "theguardian.com",
  CNN: "cnn.com",
  "USA Today": "usatoday.com",
  Bloomberg: "bloomberg.com",
  "Fox News": "foxnews.com",
  DW: "dw.com",
  RFERL: "rferl.org",
  "Washington Examiner": "washingtonexaminer.com",
  Time: "time.com",
};

/**
 * Resolve a domain for favicon lookup only.
 * Never used for labeling, ranking, or identity.
 */
function resolveDomain(outletName: string): string {
  const trimmed = outletName?.trim();
  if (!trimmed) return "";
  return OUTLET_DOMAIN_MAP[trimmed] || "";
}

type Props = {
  outlet: OutletOverview;
  rank: number; // Global rank only
  selected: boolean;
  badge: "golden" | "neutral" | "watchlist"; // Structural label, non-semantic
  onSelect: () => void;
};

/**
 * OutletCard
 * Descriptive UI component.
 * Displays structural signals only.
 * Emits no recommendation, warning, or evaluative judgment.
 */
export default function OutletCard({
  outlet,
  rank,
  selected,
  badge, // intentionally unused visually (canon-safe)
  onSelect,
}: Props) {
  const [logoError, setLogoError] = useState(false);

  const outletName = outlet.outlet || "UNKNOWN";
  const domain = resolveDomain(outletName);

  const logoUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : "/default-favicon.png";

  /**
   * Display-only formatting.
   * PI is shown as a normalized index for readability.
   * No threshold, judgment, or target is implied.
   */
  const rawPi =
    typeof (outlet as any).avg_pi_weighted === "number"
      ? (outlet as any).avg_pi_weighted
      : null;

  const displayPi =
    rawPi !== null ? (rawPi * 100).toFixed(2) : "?";

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
      aria-pressed={selected}
    >
      <div className="flex flex-col items-start gap-1">
        {/* Global rank — descriptive only */}
        <div className="text-xs text-neutral-400">
          #{rank}
        </div>

        {/* Outlet favicon */}
        <Image
          src={logoError ? "/default-favicon.png" : logoUrl}
          alt={`${outletName} favicon`}
          width={20}
          height={20}
          className="rounded-sm"
          unoptimized
          onError={() => setLogoError(true)}
        />

        {/* Canonical outlet name */}
        <div className="text-sm font-medium text-neutral-100">
          {outletName}
        </div>

        {/* Predictability Index (display only) */}
        <div className="text-xs text-amber-300">
          PI {displayPi}
        </div>

        {/* Sample size context */}
        <div className="text-xs text-neutral-400">
          {Number(outlet.total_stories).toLocaleString()} stories analyzed
        </div>
      </div>
    </button>
  );
}
