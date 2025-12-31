"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutletOverview, OutletStats } from "./types";
import Leaderboard from "./components/Leaderboard";
import ScoreBreakdown from "./components/ScoreBreakdown";

// Merge rules for known special cases
const OUTLET_MERGE_CANON: Record<string, string> = {
  "BNA Content - Bloomberg": "Bloomberg",
  "BNA Content": "Bloomberg",
  "Bloomberg": "Bloomberg",
  "Newsletters Washington Examiner": "Washington Examiner",
  "Washington Examiner": "Washington Examiner",
  // Extend as needed for new merge rules
};

// General normalization for deduplication
function normalizeOutletKey(outlet: string): string {
  // Special case: explicit canonical mapping first
  if (OUTLET_MERGE_CANON[outlet.trim()]) {
    return OUTLET_MERGE_CANON[outlet.trim()].toLowerCase();
  }
  // Fallback to lower/trim/basic
  return outlet.trim().toLowerCase();
}

// Combines duplicates per canonical outlet key, does PI-weighted average
function mergeDuplicateOutlets(outlets: OutletOverview[]): OutletOverview[] {
  const map = new Map<string, OutletOverview & { _pi_numerator?: number; _stories?: number }>();

  for (const outlet of outlets) {
    const canonicalName = OUTLET_MERGE_CANON[outlet.outlet.trim()] || outlet.outlet.trim();
    const key = normalizeOutletKey(outlet.outlet); // Canonical merge key

    const t = Number(outlet.total_stories) || 0;
    const pi = Number((outlet as any).avg_pi_weighted) || 0;

    if (map.has(key)) {
      const existing = map.get(key)!;
      const existingT = Number(existing.total_stories) || 0;
      const existingNumerator = Number(existing._pi_numerator) || (Number((existing as any).avg_pi_weighted) * existingT) || 0;

      const totalStories = t + existingT;
      const totalNumerator = pi * t + existingNumerator;

      map.set(key, {
        ...existing,
        outlet: canonicalName, // Use readable/canonical
        total_stories: totalStories,
        avg_pi_weighted: totalStories > 0 ? totalNumerator / totalStories : 0,
        _pi_numerator: totalNumerator,
        _stories: totalStories,
      });
    } else {
      map.set(key, {
        ...outlet,
        outlet: canonicalName,
        _pi_numerator: pi * t,
        _stories: t,
      });
    }
  }
  // Clean up helper fields before returning
  return Array.from(map.values()).map(({ _pi_numerator, _stories, ...o }) => o);
}

type RankedOutlet = OutletOverview & { rank: number };

export default function NewsroomCabinetPage() {
  const [outlets, setOutlets] = useState<OutletOverview[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<OutletStats | null>(null);

  // Load data
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

  // Fetch stats for currently selected entry
  useEffect(() => {
    if (!selected) return;
    fetch(`/api/news/outlet-stats?outlet=${encodeURIComponent(selected)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.outlet);
        else setStats(null);
      });
  }, [selected]);

  // Merge/aggregate duplicate outlets per canonical rules FIRST, then filter/sort/rank
  const mergedOutlets = useMemo(() => mergeDuplicateOutlets(outlets), [outlets]);

  // PI sort, rank assignment
  const ranked: RankedOutlet[] = useMemo(() => {
    return mergedOutlets
      .filter((o) => Number(o.total_stories) >= 5)
      .slice()
      .sort((a, b) => {
        const piA = typeof (a as any).avg_pi_weighted === "number"
          ? (a as any).avg_pi_weighted
          : Number((a as any).avg_pi_weighted);
        const piB = typeof (b as any).avg_pi_weighted === "number"
          ? (b as any).avg_pi_weighted
          : Number((b as any).avg_pi_weighted);
        if (piB !== piA) return piB - piA;
        return a.outlet.localeCompare(b.outlet);
      })
      .map((o, i) => ({ ...o, rank: i + 1 })); // Assign global ranking ONCE
  }, [mergedOutlets]);

  // Category slices: no renumbering, preserves correct (e.g. 42-44) for watch list
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
