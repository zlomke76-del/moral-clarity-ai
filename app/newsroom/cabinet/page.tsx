"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutletOverview, OutletStats } from "./types";
import Leaderboard from "./components/Leaderboard";
import ScoreBreakdown from "./components/ScoreBreakdown";

/**
 * Canonical outlet merge map.
 * Keys = raw ingestion identifiers (lowercased).
 * Values = canonical display name ONLY.
 */
const OUTLET_MERGE_CANON: Record<string, string> = {
  // BBC
  "bbc.co.uk": "BBC",
  "bbc.com": "BBC",
  "www.bbc.co.uk": "BBC",
  "www.bbc.com": "BBC",
  "bbc": "BBC",

  // Newsmax
  "ir.newsmax": "Newsmax",
  "ir.newsmax.com": "Newsmax",
  "newsmax.com": "Newsmax",
  "newsmax": "Newsmax",

  // Time
  "nation.time": "Time",
  "newsweek.time": "Time",
  "nation.time.com": "Time",
  "newsfeed.time.com": "Time",
  "time.com": "Time",
  "time": "Time",

  // Bloomberg
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
  "foxnews.com": "Fox News",
  "fox news": "Fox News",
};

function normalizeKey(raw: string): string {
  return (raw || "").trim().toLowerCase();
}

/**
 * Merge duplicate outlets while preserving:
 * - canonical DISPLAY name
 * - stable BACKEND QUERY KEY
 */
function mergeDuplicateOutlets(
  outlets: OutletOverview[]
): (OutletOverview & { __query_key: string })[] {
  const map = new Map<
    string,
    OutletOverview & {
      __stories: number;
      __pi_numerator: number;
      __query_key: string;
    }
  >();

  for (const outlet of outlets) {
    const rawName = outlet.outlet || "";
    const norm = normalizeKey(rawName);
    const canonical = OUTLET_MERGE_CANON[norm] || rawName.trim();
    const key = normalizeKey(canonical);

    const stories = Number(outlet.total_stories) || 0;
    const pi = Number((outlet as any).avg_pi_weighted) || 0;

    if (map.has(key)) {
      const existing = map.get(key)!;

      const combinedStories = existing.__stories + stories;
      const combinedPiNumerator =
        existing.__pi_numerator + pi * stories;

      map.set(key, {
        ...existing,
        outlet: canonical, // display only
        total_stories: combinedStories,
        avg_pi_weighted:
          combinedStories > 0
            ? combinedPiNumerator / combinedStories
            : 0,
        __stories: combinedStories,
        __pi_numerator: combinedPiNumerator,
        // IMPORTANT: keep original __query_key
      });
    } else {
      map.set(key, {
        ...outlet,
        outlet: canonical,          // display name
        __query_key: rawName,       // backend identity (UNMODIFIED)
        __stories: stories,
        __pi_numerator: pi * stories,
      });
    }
  }

  return Array.from(map.values()).map((o) => {
    // strip internal merge helpers ONLY
    // keep __query_key
    const { __stories, __pi_numerator, ...clean } = o;
    return clean;
  });
}

type RankedOutlet = OutletOverview & {
  rank: number;
  __query_key: string;
};

export default function NewsroomCabinetPage() {
  const [rawOutlets, setRawOutlets] = useState<OutletOverview[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<OutletStats | null>(null);

  // Fetch overview
  useEffect(() => {
    fetch("/api/news/outlets/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setRawOutlets(d.outlets);
          setSelected(d.outlets?.[0]?.outlet ?? null);
        }
      });
  }, []);

  const mergedOutlets = useMemo(
    () => mergeDuplicateOutlets(rawOutlets),
    [rawOutlets]
  );

  const ranked: RankedOutlet[] = useMemo(() => {
    return mergedOutlets
      .filter((o) => Number(o.total_stories) >= 5)
      .slice()
      .sort((a, b) => {
        const piA = Number((a as any).avg_pi_weighted) || 0;
        const piB = Number((b as any).avg_pi_weighted) || 0;
        if (piB !== piA) return piB - piA;
        return a.outlet.localeCompare(b.outlet);
      })
      .map((o, i) => ({ ...o, rank: i + 1 }));
  }, [mergedOutlets]);

  // Fetch stats using BACKEND QUERY KEY
  useEffect(() => {
    if (!selected) return;

    const selectedOutlet = ranked.find(
      (o) => o.outlet === selected
    );

    if (!selectedOutlet) {
      setStats(null);
      return;
    }

    fetch(
      `/api/news/outlet-stats?outlet=${encodeURIComponent(
        selectedOutlet.__query_key
      )}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.outlet);
        else setStats(null);
      });
  }, [selected, ranked]);

  const goldenAnchor = ranked.slice(0, 3);
  const neutralField = ranked.slice(3, ranked.length - 3);
  const watchList = ranked.slice(-3);

  const totalStoriesEvaluated = useMemo(
    () =>
      ranked.reduce(
        (sum, o) => sum + (Number(o.total_stories) || 0),
        0
      ),
    [ranked]
  );

  return (
    <div className="flex flex-col gap-12">
      <div className="text-xs text-neutral-400">
        {totalStoriesEvaluated.toLocaleString()} stories evaluated ·
        PI based on lifetime
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
