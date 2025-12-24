"use client";

import { useEffect, useState } from "react";
import type { OutletOverview, OutletStats } from "./types";

import Leaderboard from "./components/Leaderboard";
import ScoreBreakdown from "./components/ScoreBreakdown";

export default function NewsroomCabinetPage() {
  const [outlets, setOutlets] = useState<OutletOverview[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<OutletStats | null>(null);

  /* ========= LOAD LEADERBOARD ========= */
  useEffect(() => {
    fetch("/api/news/outlets/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setOutlets(d.outlets);
          setSelected(d.outlets?.[0]?.canonical_outlet ?? null);
        }
      });
  }, []);

  /* ========= LOAD STATS (ON SELECTION) ========= */
  useEffect(() => {
    if (!selected) return;

    fetch(`/api/news/outlets/${encodeURIComponent(selected)}/stats`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.outlet);
        else setStats(null);
      });
  }, [selected]);

  return (
    <div className="flex flex-col gap-8">
      <Leaderboard
        outlets={outlets}
        selectedCanonical={selected}
        onSelect={(canon) => setSelected(canon)}
      />

      <ScoreBreakdown outlet={stats} />
    </div>
  );
}
