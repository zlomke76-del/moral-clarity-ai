// app/newsroom/cabinet/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  OutletOverview,
  OutletTrendPoint,
  OutletDetailData,
} from "./types";

import Leaderboard from "./components/Leaderboard";
import OutletDetailModal from "./components/OutletDetailModal";

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

  /* ========= Load outlet overview once ========= */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/news/outlets/overview");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: OverviewResponse = await res.json();
        if (!alive) return;
        if (!data.ok) throw new Error("Overview API returned not ok");

        const sorted = [...data.outlets].sort(
          (a, b) => a.avg_bias_intent - b.avg_bias_intent
        );

        setOutlets(sorted);

        if (!selectedCanonical && sorted.length > 0) {
          setSelectedCanonical(sorted[0].canonical_outlet);
        }
      } catch (err: any) {
        if (!alive) return;
        setError(err?.message || "Failed to load outlet overview.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ========= Selected outlet ========= */
  const selectedOutlet = useMemo(() => {
    if (!selectedCanonical) return null;
    return outlets.find(o => o.canonical_outlet === selectedCanonical) ?? null;
  }, [outlets, selectedCanonical]);

  /* ========= Detail data ========= */
  const detailOutlet: OutletDetailData | null = useMemo(() => {
    if (!selectedOutlet) return null;

    const lifetimePiPercent = selectedOutlet.avg_pi * 100;

    return {
      canonical_outlet: selectedOutlet.canonical_outlet,
      display_name: selectedOutlet.canonical_outlet,
      storiesAnalyzed: selectedOutlet.total_stories,
      lifetimePi: lifetimePiPercent,
      lifetimeBiasIntent: selectedOutlet.avg_bias_intent,
      lifetimeLanguage: selectedOutlet.bias_language,
      lifetimeSource: selectedOutlet.bias_source,
      lifetimeFraming: selectedOutlet.bias_framing,
      lifetimeContext: selectedOutlet.bias_context,
      lastScoredAt: selectedOutlet.last_story_day ?? "Unknown",
      ninetyDaySummary: `Lifetime PI ${lifetimePiPercent.toFixed(
        1
      )} based on ${selectedOutlet.total_stories} stories.`,
    };
  }, [selectedOutlet]);

  /* ========= Load trends ========= */
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
    <div className="flex flex-col gap-8">
      {/* Leaderboard */}
      <Leaderboard
        outlets={outlets}
        selectedCanonical={selectedCanonical}
        onSelect={(canon) => {
          if (canon === selectedCanonical) {
            setDetailOpen(true);
          } else {
            setSelectedCanonical(canon);
            setDetailOpen(false);
          }
        }}
      />

      {/* Detail modal */}
      <OutletDetailModal
        open={detailOpen && !!detailOutlet}
        outlet={detailOutlet}
        trends={trendLoading ? null : trends}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
