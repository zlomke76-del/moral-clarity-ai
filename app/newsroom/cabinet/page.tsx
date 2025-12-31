"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutletOverview, OutletStats } from "./types";
import Leaderboard from "./components/Leaderboard";
import ScoreBreakdown from "./components/ScoreBreakdown";

/**
 * A RankedOutlet has all the OutletOverview fields, plus its global PI-based rank.
 */
type RankedOutlet = OutletOverview & { rank: number };

export default function NewsroomCabinetPage() {
  const [outlets, setOutlets] = useState<OutletOverview[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<OutletStats | null>(null);

  // Fetch all outlet overviews once.
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

  // Fetch outlet stats for the selected outlet.
  useEffect(() => {
    if (!selected) return;
    fetch(`/api/news/outlet-stats?outlet=${encodeURIComponent(selected)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.outlet);
        else setStats(null);
      });
  }, [selected]);

  /**
   * Rank all eligible outlets globally by PI (descending).
   * - Must have at least 5 stories.
   * - If PI values tie, order alphabetically by outlet string.
   * - Assign global rank (1...N) once, before category slicing.
   */
  const ranked: RankedOutlet[] = useMemo(() => {
    return outlets
      .filter((o) => Number(o.total_stories) >= 5)
      .slice() // avoid direct mutation
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
      .map((o, i) => ({ ...o, rank: i + 1 })); // Global rank assignment
  }, [outlets]);

  // Slice into categories WITHOUT re-ranking.
  const goldenAnchor = ranked.slice(0, 3); // rank 1,2,3
  const neutralField = ranked.slice(3, ranked.length - 3); // rank 4..(N-3) if exists
  const watchList = ranked.slice(-3); // last 3: rank N-2,N-1,N

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
