"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutletOverview, OutletStats } from "./types";
import Leaderboard from "./components/Leaderboard";
import ScoreBreakdown from "./components/ScoreBreakdown";

type RankedOutlet = OutletOverview & { rank: number };

export default function NewsroomCabinetPage() {
  const [outlets, setOutlets] = useState<OutletOverview[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<OutletStats | null>(null);

  // Load leaderboard
  useEffect(() => {
    fetch("/api/news/outlets/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setOutlets(d.outlets);
          setSelected(d.outlets?.[0]?.canonical_domain ?? null);
        }
      });
  }, []);

  // Load stats for selected outlet
  useEffect(() => {
    if (!selected) return;
    fetch(`/api/news/outlet-stats?outlet=${encodeURIComponent(selected)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.outlet);
        else setStats(null);
      });
  }, [selected]);

  const totalStoriesEvaluated = useMemo(
    () => outlets.reduce((sum, o) => sum + (o.total_stories ?? 0), 0),
    [outlets]
  );

  const goldenAnchor: RankedOutlet[] = useMemo(
    () => outlets.slice(0, 3).map((o, i) => ({ ...o, rank: i + 1 })),
    [outlets]
  );
  const neutralField: RankedOutlet[] = useMemo(
    () => outlets.slice(3, outlets.length - 3).map((o, i) => ({ ...o, rank: i + 4 })),
    [outlets]
  );
  const watchList: RankedOutlet[] = useMemo(
    () => outlets.slice(-3).map((o, i) => ({ ...o, rank: outlets.length - 2 + i })),
    [outlets]
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
            selectedCanonical={selected}
            onSelect={setSelected}
          />
        </section>
      )}
      <section className="border-t border-neutral-700 pt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Neutral Category · Full Field
        </h2>
        <Leaderboard
          outlets={neutralField}
          selectedCanonical={selected}
          onSelect={setSelected}
        />
      </section>
      {watchList.length > 0 && (
        <section className="border-t border-neutral-800 pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-red-400">
            Watch List · Lowest Predictability
          </h2>
          <Leaderboard
            outlets={watchList}
            selectedCanonical={selected}
            onSelect={setSelected}
          />
        </section>
      )}
      <ScoreBreakdown outlet={stats} />
    </div>
  );
}
