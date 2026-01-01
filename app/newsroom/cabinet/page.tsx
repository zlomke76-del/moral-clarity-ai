"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutletOverview, OutletStats } from "./types";
import Leaderboard from "./components/Leaderboard";
import ScoreBreakdown from "./components/ScoreBreakdown";

/**
 * Canonical outlet merge map.
 * All keys must be lowercase, trimmed, and (if domain) without http(s)://.
 * All values are the desired leaderboard name, as you want it displayed.
 */
const OUTLET_MERGE_CANON: Record<string, string> = {
  // BBC: unify all domains/labels
  "bbc.co.uk": "BBC",
  "bbc.com": "BBC",
  "bbc": "BBC",
  "www.bbc.co.uk": "BBC",
  "www.bbc.com": "BBC",

  // Newsmax: merge all variants
  "ir.newsmax": "Newsmax",         // legacy
  "ir.newsmax.com": "Newsmax",     // add this variant
  "newsmax.com": "Newsmax",
  "newsmax": "Newsmax",

  // Time and related, including .com variants
  "nation.time": "Time",
  "newsweek.time": "Time",
  "time": "Time",
  "nation.time.com": "Time",
  "newsfeed.time.com": "Time",
  "time.com": "Time",

  // Bloomberg, BNA
  "bna.content.cirrus.bloomberg.com": "Bloomberg",
  "bna content - bloomberg": "Bloomberg",
  "bna content": "Bloomberg",
  "bloomberg": "Bloomberg",

  // DW
  "amp.dw.com": "DW",
  "dw.com": "DW",
  "dw": "DW",

  // RFERL
  "about.rferl.org": "RFERL",
  "about.rferl": "RFERL",
  "rferl.org": "RFERL",
  "rferl": "RFERL",

  // Washington Examiner
  "wp.washingtonexaminer.com": "Washington Examiner",
  "washingtonexaminer.com": "Washington Examiner",
  "newsletters.washingtonexaminer.com": "Washington Examiner",
  "washington examiner": "Washington Examiner",

  // Fox News
  "radio.foxnews.com": "Fox News",
  "fox news": "Fox News",
  "foxnews.com": "Fox News",
};

function normalizeKey(raw: string): string {
  return (raw || "").trim().toLowerCase();
}

function mergeDuplicateOutlets(outlets: OutletOverview[]): OutletOverview[] {
  const map = new Map<
    string,
    OutletOverview & { __stories?: number; __pi_numerator?: number }
  >();

  for (const outlet of outlets) {
    const orig = outlet.outlet || "";
    const norm = normalizeKey(orig);
    const canonical = OUTLET_MERGE_CANON[norm] || outlet.outlet.trim();
    const key = normalizeKey(canonical);

    const stories = Number(outlet.total_stories) || 0;
    const pi = Number((outlet as any).avg_pi_weighted) || 0;

    if (map.has(key)) {
      const existing = map.get(key)!;
      const existingStories = Number(existing.total_stories) || 0;
      const existingPiNumerator =
        Number(existing.__pi_numerator) ||
        (Number((existing as any).avg_pi_weighted) * existingStories) ||
        0;

      const combinedStories = existingStories + stories;
      const combinedPiNumerator = existingPiNumerator + pi * stories;

      map.set(key, {
        ...existing,
        outlet: canonical,
        total_stories: combinedStories,
        avg_pi_weighted:
          combinedStories > 0 ? combinedPiNumerator / combinedStories : 0,
        __stories: combinedStories,
        __pi_numerator: combinedPiNumerator,
      });
    } else {
      map.set(key, {
        ...outlet,
        outlet: canonical,
        __stories: stories,
        __pi_numerator: pi * stories,
      });
    }
  }
  // Remove __fields before returning
  return Array.from(map.values()).map((o) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __stories, __pi_numerator, ...clean } = o;
    return clean;
  });
}

type RankedOutlet = OutletOverview & { rank: number };

export default function NewsroomCabinetPage() {
  const [outlets, setOutlets] = useState<OutletOverview[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<OutletStats | null>(null);

  // Fetch all outlet overviews (includes duplicates, if present in API)
  useEffect(() => {
    fetch("/api/news/outlets/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setOutlets(d.outlets);
          setSelected(d.outlets?.[0]?.outlet ?? null);
        }
      });
  }, []);

  // Fetch stats for currently selected outlet
  useEffect(() => {
    if (!selected) return;
    fetch(`/api/news/outlet-stats?outlet=${encodeURIComponent(selected)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.outlet);
        else setStats(null);
      });
  }, [selected]);

  // Merge, filter, sort, and globally rank (all logic in this order)
  const mergedOutlets = useMemo(
    () => mergeDuplicateOutlets(outlets),
    [outlets]
  );

  const ranked: RankedOutlet[] = useMemo(() => {
    return mergedOutlets
      .filter((o) => Number(o.total_stories) >= 5)
      .slice()
      .sort((a, b) => {
        const piA =
          typeof (a as any).avg_pi_weighted === "number"
            ? (a as any).avg_pi_weighted
            : Number((a as any).avg_pi_weighted);
        const piB =
          typeof (b as any).avg_pi_weighted === "number"
            ? (b as any).avg_pi_weighted
            : Number((b as any).avg_pi_weighted);
        if (piB !== piA) return piB - piA;
        return a.outlet.localeCompare(b.outlet);
      })
      .map((o, i) => ({ ...o, rank: i + 1 }));
  }, [mergedOutlets]);

  // Category slices
  const goldenAnchor = ranked.slice(0, 3);
  const neutralField = ranked.slice(3, ranked.length - 3);
  const watchList = ranked.slice(-3);

  const totalStoriesEvaluated = useMemo(
    () => ranked.reduce((sum, o) => sum + (Number(o.total_stories) ?? 0), 0),
    [ranked]
  );

  return (
    <div className="flex flex-col gap-12">
      <div className="text-xs text-neutral-400">
        {totalStoriesEvaluated.toLocaleString()} stories evaluated · PI based on lifetime
      </div>
      {goldenAnchor.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-400">
            Golden Anchor · Top 3 Predictability
          </h2>
          <Leaderboard
            outlets={goldenAnchor}
            selectedOutlet={selected}
            onSelect={setSelected}
          />
        </section>
      )}
      {neutralField.length > 0 && (
        <section className="border-t border-neutral-700 pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Neutral Category · Full Field
          </h2>
          <Leaderboard
            outlets={neutralField}
            selectedOutlet={selected}
            onSelect={setSelected}
          />
        </section>
      )}
      {watchList.length > 0 && (
        <section className="border-t border-neutral-800 pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-red-400">
            Watch List · Lowest Predictability
          </h2>
          <Leaderboard
            outlets={watchList}
            selectedOutlet={selected}
            onSelect={setSelected}
          />
        </section>
      )}
      <ScoreBreakdown outlet={stats} />
    </div>
  );
}
```

---

## 2. OutletCard (Logo/favicons correct for merged names)

```tsx
// app/newsroom/cabinet/components/OutletCard.tsx

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
