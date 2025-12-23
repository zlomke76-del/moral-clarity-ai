// app/newsroom/cabinet/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  OutletOverview,
  OutletTrendPoint,
  OutletDetailData,
} from "./types";

import Leaderboard from "./components/Leaderboard";
import OutletDetailDialog from "./components/OutletDetailDialog";
import ScoreBreakdown from "./components/ScoreBreakdown";

type OverviewResponse = {
  ok: boolean;
  count: number;
  outlets: OutletOverview[];
};

type TrendsResponse = {
  ok: boolean;
  outlet: string;
  count: number;
  points: OutletTrendPoint[];
};

export default function NewsroomCabinetPage() {
  const [outlets, setOutlets] = useState<OutletOverview[]>([]);
  const [selectedCanonical, setSelectedCanonical] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [trends, setTrends] = useState<OutletTrendPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(false);
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

        // 🔒 SINGLE SOURCE OF TRUTH:
        // Rank by PI (higher = more predictable / neutral)
        const sorted = [...data.outlets].sort(
          (a, b) => b.avg_pi - a.avg_pi
        );

        setOutlets(sorted);

        if (!selectedCanonical && sorted.length > 0) {
          setSelectedCanonical(sorted[0].canonical_outlet);
        }
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load cabinet.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedCanonical]);

  /* ========= Selected outlet ========= */
  const selectedOutlet = useMemo(() => {
    if (!selectedCanonical) return null;
    return (
      outlets.find(
        (o) => o.canonical_outlet === selectedCanonical
      ) ?? null
    );
  }, [outlets, selectedCanonical]);

  /* ========= Modal DTO ========= */
  const detailOutlet: OutletDetailData | null = useMemo(() => {
    if (!selectedOutlet) return null;

    const piPercent = (selectedOutlet.avg_pi * 100).toFixed(2);

    return {
      canonical_outlet: selectedOutlet.canonical_outlet,
      display_name: selectedOutlet.canonical_outlet,
      storiesAnalyzed: selectedOutlet.total_stories,

      lifetimePi: selectedOutlet.avg_pi,

      lifetimeBiasIntent: selectedOutlet.avg_bias_intent,
      lifetimeLanguage: selectedOutlet.bias_language,
      lifetimeSource: selectedOutlet.bias_source,
      lifetimeFraming: selectedOutlet.bias_framing,
      lifetimeContext: selectedOutlet.bias_context,

      lastScoredAt: selectedOutlet.last_story_day ?? "Not yet scored",

      ninetyDaySummary: `Lifetime PI ${piPercent} based on ${selectedOutlet.total_stories} stories.`,
    };
  }, [selectedOutlet]);

  /* ========= Trends ========= */
  useEffect(() => {
    let alive = true;

    if (!selectedCanonical) {
      setTrends(null);
      return;
    }

    (async () => {
      try {
        setTrendLoading(true);
        const res = await fetch(
          `/api/news/outlets/trends?outlet=${encodeURIComponent(
            selectedCanonical
          )}`
        );
        if (!res.ok) throw new Error();
        const data: TrendsResponse = await res.json();
        if (!alive || !data.ok) return;
        setTrends(data.points);
      } catch {
        if (alive) setTrends(null);
      } finally {
        if (alive) setTrendLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedCanonical]);

  return (
    <div className="flex flex-col gap-10">
      {/* ================= CABINET ================= */}
      {loading ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
          Loading cabinet…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-900/40 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : (
        <Leaderboard
          outlets={outlets}
          selectedCanonical={selectedCanonical}
          onSelect={(canon, wasSelected) => {
            if (wasSelected) {
              setDetailOpen(true);
            } else {
              setSelectedCanonical(canon);
              setDetailOpen(false);
            }
          }}
        />
      )}

      {/* ================= INTERPRETATION LAYER ================= */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Explanation */}
        <div className="lg:col-span-1 space-y-3 text-sm text-neutral-400">
          <h3 className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">
            How to read this cabinet
          </h3>

          <p>
            Outlets are ranked by{" "}
            <span className="font-medium text-neutral-200">
              Predictability Index (PI)
            </span>
            , a stability signal derived from how consistently stories are framed
            over time.
          </p>

          <p>
            Lower bias does not mean an outlet is “right.” It means fewer swings
            in language, sourcing, framing, and contextual omission.
          </p>

          <p className="text-xs text-neutral-500">
            Select an outlet to inspect how its score is composed.
          </p>
        </div>

        {/* Score breakdown */}
        <div className="lg:col-span-2">
          <ScoreBreakdown outlet={selectedOutlet} />
        </div>
      </section>

      {/* ================= DETAIL MODAL ================= */}
      <OutletDetailDialog
        open={detailOpen && !!detailOutlet}
        outlet={detailOutlet}
        trends={trendLoading ? null : trends}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
