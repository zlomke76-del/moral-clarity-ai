"use client";

import { useEffect, useMemo, useState } from "react";
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

  /* ========= DERIVED, NON-OVERLAPPING SLICES ========= */
  const goldenAnchor = useMemo(
    () => outlets.slice(0, 3),
    [outlets]
  );

  const watchList = useMemo(
    () => outlets.slice(-3),
    [outlets]
  );

  const middleLeaderboard = useMemo(
    () => outlets.slice(3, Math.max(outlets.length - 3, 3)),
    [outlets]
  );

  return (
    <div className="flex flex-col gap-10">

      {/* ================= GOLDEN ANCHOR ================= */}
      {goldenAnchor.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Golden Anchor · Top 3 Predictability
          </h2>

          <Leaderboard
            outlets={goldenAnchor}
            selectedCanonical={selected}
            onSelect={(canon) => setSelected(canon)}
          />
        </section>
      )}

      {/* ================= MAIN LEADERBOARD ================= */}
      <section>
        <Leaderboard
          outlets={middleLeaderboard}
          selectedCanonical={selected}
          onSelect={(canon) => setSelected(canon)}
        />
      </section>

      {/* ================= WATCH LIST ================= */}
      {watchList.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Watch List · Lowest Predictability
          </h2>

          <Leaderboard
            outlets={watchList}
            selectedCanonical={selected}
            onSelect={(canon) => setSelected(canon)}
          />
        </section>
      )}

      {/* ================= SCORE BREAKDOWN ================= */}
      <ScoreBreakdown outlet={stats} />
    </div>
  );
}
