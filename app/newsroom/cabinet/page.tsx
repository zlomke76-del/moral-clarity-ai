// app/newsroom/cabinet/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { OutletOverview } from "./types";

import Leaderboard from "./components/Leaderboard";
import ScoreBreakdown from "./components/ScoreBreakdown";

type OverviewResponse = {
  ok: boolean;
  count: number;
  outlets: OutletOverview[];
};

export default function NewsroomCabinetPage() {
  const [outlets, setOutlets] = useState<OutletOverview[]>([]);
  const [focusedCanonical, setFocusedCanonical] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ========= LOAD OVERVIEW (MOUNT-ONLY) ========= */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/news/outlets/overview");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: OverviewResponse = await res.json();
        if (!alive || !data.ok) return;

        // 🔒 AUTHORITATIVE SORT — PI DESC (HIGHER = MORE NEUTRAL)
        const sorted = [...data.outlets].sort(
          (a, b) => b.avg_pi - a.avg_pi
        );

        setOutlets(sorted);

        // 🔒 INITIAL FOCUS — SET ONCE, NON-REACTIVE
        if (sorted.length > 0) {
          setFocusedCanonical(sorted[0].canonical_outlet);
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
  }, []); // ⛔ NO STATE DEPENDENCIES — MOUNT ONLY

  /* ========= FOCUSED OUTLET ========= */
  const focusedOutlet = useMemo(() => {
    if (!focusedCanonical) return null;
    return (
      outlets.find((o) => o.canonical_outlet === focusedCanonical) ?? null
    );
  }, [outlets, focusedCanonical]);

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
          selectedCanonical={focusedCanonical}
          onSelect={(canon) => {
            setFocusedCanonical(canon); // 🔒 USER-ONLY CONTROL
          }}
        />
      )}

      {/* ================= SCORE BREAKDOWN (FOCUSED) ================= */}
      <div className="mt-2">
        <ScoreBreakdown outlet={focusedOutlet} />
      </div>
    </div>
  );
}
