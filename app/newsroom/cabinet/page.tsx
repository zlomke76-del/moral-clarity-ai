"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutletOverview } from "../types";

import Leaderboard from "./components/Leaderboard";
import ScoreBreakdown from "./components/ScoreBreakdown";

type OverviewResponse = {
  ok: boolean;
  count: number;
  outlets: OutletOverview[];
};

export default function NewsroomCabinetPage() {
  const [outlets, setOutlets] = useState<OutletOverview[]>([]);
  const [focusedOutletName, setFocusedOutletName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ========= Load overview ========= */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/news/outlets/overview");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: OverviewResponse = await res.json();
        if (!alive || !data.ok) return;

        // 🔒 AUTHORITATIVE SORT — PI DESC (WEIGHTED, LIFETIME)
        const sorted = [...data.outlets].sort((a, b) => {
          const aPi = a.avg_pi_weighted ?? -1;
          const bPi = b.avg_pi_weighted ?? -1;
          return bPi - aPi;
        });

        setOutlets(sorted);

        if (!focusedOutletName && sorted.length > 0) {
          setFocusedOutletName(sorted[0].outlet);
        }
      } catch (e: any) {
        if (alive) {
          setError(e?.message ?? "Failed to load newsroom cabinet.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [focusedOutletName]);

  /* ========= Focused outlet ========= */
  const focusedOutlet = useMemo(() => {
    if (!focusedOutletName) return null;
    return outlets.find((o) => o.outlet === focusedOutletName) ?? null;
  }, [outlets, focusedOutletName]);

  return (
    <div className="flex flex-col gap-8">
      {loading ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
          Loading newsroom…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-900/40 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : (
        <Leaderboard
          outlets={outlets}
          selectedCanonical={focusedOutletName}
          onSelect={(name) => {
            setFocusedOutletName(name);
          }}
        />
      )}

      {/* ================= SCORE BREAKDOWN (FOCUSED & GUARDED) ================= */}
      {focusedOutlet && (
        <div className="mt-2">
          <ScoreBreakdown outlet={focusedOutlet} />
        </div>
      )}
    </div>
  );
}
