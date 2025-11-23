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
  const [trends, setTrends] = useState<OutletTrendPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load outlet overview once
  useEffect(() => {
    let isMounted = true;

    const fetchOutlets = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/news/outlets/overview");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: OverviewResponse = await res.json();
        if (!isMounted) return;
        if (!data.ok) throw new Error("Overview API returned not ok");

        const sortedOutlets = data.outlets.sort(
          (a, b) => a.avg_bias_intent - b.avg_bias_intent
        );

        setOutlets(sortedOutlets);

        // Default to the first outlet if none is selected
        if (!selectedCanonical && sortedOutlets.length > 0) {
          setSelectedCanonical(sortedOutlets[0].canonical_outlet);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load outlet overview.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOutlets();

    return () => {
      isMounted = false;
    };
  }, [selectedCanonical]);

  // Find currently selected outlet overview
  const selectedOutlet: OutletOverview | null = useMemo(() => {
    return selectedCanonical ? outlets.find(o => o.canonical_outlet === selectedCanonical) ?? null : null;
  }, [outlets, selectedCanonical]);

  // Map overview to detail data for the modal
  const detailOutlet: OutletDetailData | null = useMemo(() => {
    if (!selectedOutlet) return null;

    const lifetimePiPercent = selectedOutlet.avg_pi * 100;
    const summary = `Lifetime PI ${lifetimePiPercent.toFixed(1)} based on ${selectedOutlet.total_stories} scored stor${selectedOutlet.total_stories === 1 ? "y" : "ies"}. 90-day trend view coming soon.`;

    return {
      canonical_outlet: selectedOutlet.canonical_outlet,
      display_name: selectedOutlet.canonical_outlet || "Unknown outlet",
      storiesAnalyzed: selectedOutlet.total_stories,
      lifetimePi: lifetimePiPercent,
      lifetimeBiasIntent: selectedOutlet.avg_bias_intent,
      lifetimeLanguage: selectedOutlet.bias_language,
      lifetimeSource: selectedOutlet.bias_source,
      lifetimeFraming: selectedOutlet.bias_framing,
      lifetimeContext: selectedOutlet.bias_context,
      lastScoredAt: selectedOutlet.last_story_day ?? "Unknown",
      ninetyDaySummary: summary,
    };
  }, [selectedOutlet]);

  // Load trend whenever selected outlet changes
  useEffect(() => {
    let isMounted = true;

    if (!selectedCanonical) {
      setTrends(null);
      return;
    }

    const fetchTrends = async () => {
      try {
        setTrendLoading(true);

        const res = await fetch(`/api/news/outlets/trends?outlet=${encodeURIComponent(selectedCanonical)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: TrendsResponse = await res.json();
        if (!isMounted) return;
        if (!data.ok) throw new Error("Trends API returned not ok");

        setTrends(data.points);
      } catch {
        if (!isMounted) return;
        setTrends(null); // Soft-fail: hide chart if trend fails
      } finally {
        if (isMounted) setTrendLoading(false);
      }
    };

    fetchTrends();

    return () => {
      isMounted = false;
    };
  }, [selectedCanonical]);

  return (
    <div className="flex flex-col gap-8">
      {/* Cabinet hero */}
      <section className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Neutrality Cabinet</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-400">Story-level bias Predictability Index</p>
        </div>
        <p className="text-sm text-neutral-300 max-w-3xl">
          This cabinet tracks how predictable and neutral an outlet's <span className="font-medium">story-level bias</span> is over time. We measure <span className="font-medium">how the story is told</span> and compress that into a <span className="font-medium">Predictability Index (PI)</span> from 0.0 to 1.0. Everyone is reaching toward <span className="font-semibold text-emerald-300">1.00</span>.
        </p>
      </section>

      {/* Data region: leaderboard + helper panel */}
      {loading ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">Loading cabinet…</div>
      ) : error ? (
        <div className="rounded-xl border border-red-900/40 bg-red-950/40 p-4 text-sm text-red-300">Error loading cabinet: {error}</div>
      ) : !outlets.length ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">No scored outlets yet. Once the Neutrality Ledger has graded stories, the leaderboard and trends will appear here.</div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)]">
          {/* Left: leaderboard */}
          <Leaderboard
            outlets={outlets}
            selectedCanonical={selectedCanonical}
            onSelect={setSelectedCanonical}
          />

          {/* Right: outlet details */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 flex flex-col justify-between">
            <div className="space-y-2 text-sm text-neutral-200">
              <h2 className="text-sm font-semibold text-neutral-100">Outlet details</h2>
              {selectedOutlet ? (
                <>
                  <p className="text-neutral-300">You're looking at <span className="font-medium">{detailOutlet?.display_name ?? selectedOutlet.canonical_outlet}</span>.</p>
                  <p className="text-xs text-neutral-400">Click the outlet card again to open a full-window breakdown: lifetime Predictability Index, bias intent, component scores (language, source, framing, context), and daily trend.</p>
                </>
              ) : (
                <p className="text-xs text-neutral-400">Select an outlet from the leaderboard to open its detail window. The cabinet shows lifetime PI, component bias scores, and how stable the outlet's storytelling has been over time.</p>
              )}
            </div>
            <div className="mt-4 text-[11px] text-neutral-500">
              PI is computed from a 0–3 bias intent score using <span className="font-mono">PI = 1 − (bias_intent / 3)</span>. Higher PI means more predictable, neutral storytelling patterns.
            </div>
          </div>
        </section>
      )}

      {/* Methodology & explainer */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-100">How the Neutrality Cabinet works</h2>
        <div className="grid gap-4 md:grid-cols-3 text-xs text-neutral-300">
          {/* What we measure */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <h3 className="text-sm font-semibold mb-1">What we measure (bias)</h3>
            <p>Each scored story gets four component scores (0–3). Lower is more neutral:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Language — emotional vs neutral wording</li>
              <li>Source — diverse, credible vs narrow, shaky</li>
              <li>Framing — balanced perspectives vs one-sided</li>
              <li>Context — key facts included vs missing</li>
            </ul>
            <p className="mt-2 text-[11px] text-neutral-400">We only score full articles (400+ characters), not headlines or social posts.</p>
          </div>

          {/* Bias intent → PI */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <h3 className="text-sm font-semibold mb-1">Bias intent → Predictability Index</h3>
            <p>We combine those four components into a <span className="font-medium">bias intent score</span> (0–3), then convert it into a PI:</p>
            <p className="mt-2 font-mono text-xs">PI = 1 − (bias_intent / 3)</p>
            <p className="mt-2 text-[11px] text-neutral-300">Closer to 1.0 → more predictable, neutral storytelling. Closer to 0.0 → strong, consistent bias in how stories are told.</p>
          </div>

          {/* How to read the board */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <h3 className="text-sm font-semibold mb-1">How to read this board</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li><span className="font-medium">Golden Anchors</span> are the highest-scoring outlets by PI with solid story volume.</li>
              <li>The <span className="font-medium">Neutral Band</span> contains outlets with mixed bias patterns but reliable coverage.</li>
              <li>The <span className="font-medium">High Bias Watchlist</span> surfaces outlets whose language, framing, or context are consistently slanted.</li>
            </ul>
            <p className="mt-2 text-[11px] text-neutral-400">This doesn’t tell you what to think. It shows <span className="font-medium">how predictable the bias is</span> in how stories are delivered.</p>
          </div>
        </div>
      </section>

      {/* Detail modal */}
      <OutletDetailModal
        open={!!detailOutlet && !!selectedCanonical}
        outlet={detailOutlet}
        trends={trendLoading ? null : trends}
        onClose={() => setSelectedCanonical(null)} // This is fine
        onOpenChange={(open) => {
          // Define how you want to handle opening/closing here
          if (!open) setSelectedCanonical(null);
        }} // Add this line
      />
    </div>
  );
}
