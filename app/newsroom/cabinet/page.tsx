// app/newsroom/cabinet/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import type { OutletOverview, OutletTrendPoint } from "./types";
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
  const [selectedCanonical, setSelectedCanonical] = useState<string | null>(
    null
  );

  const [selectedOutlet, setSelectedOutlet] = useState<OutletOverview | null>(
    null
  );
  const [trends, setTrends] = useState<OutletTrendPoint[] | null>(null);

  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);

  /* ========= Load overview once ========= */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingOverview(true);
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

        if (sorted.length > 0) {
          const first = sorted[0];
          setSelectedCanonical(first.canonical_outlet);
          setSelectedOutlet(first);
        } else {
          setSelectedCanonical(null);
          setSelectedOutlet(null);
        }
      } catch (err: any) {
        if (!alive) return;
        setError(err?.message || "Failed to load outlet overview.");
      } finally {
        if (alive) setLoadingOverview(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* ========= Load trends whenever selected outlet changes ========= */
  useEffect(() => {
    let alive = true;

    if (!selectedCanonical || !outlets.length) {
      setSelectedOutlet(null);
      setTrends(null);
      return;
    }

    const outlet =
      outlets.find((o) => o.canonical_outlet === selectedCanonical) || null;
    setSelectedOutlet(outlet);

    if (!outlet) {
      setTrends(null);
      return;
    }

    (async () => {
      try {
        setLoadingTrends(true);

        const res = await fetch(
          `/api/news/outlets/trends?outlet=${encodeURIComponent(
            outlet.canonical_outlet
          )}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: TrendsResponse = await res.json();
        if (!alive) return;
        if (!data.ok) throw new Error("Trends API returned not ok");

        setTrends(data.points);
      } catch {
        if (!alive) return;
        setTrends(null);
      } finally {
        if (alive) setLoadingTrends(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedCanonical, outlets]);

  const handleSelectOutlet = (canonical: string) => {
    setSelectedCanonical(canonical);
    setDetailOpen(true);
  };

  return (
    <>
      {/* ===== Detail modal overlay ===== */}
      <OutletDetailModal
        open={detailOpen && !!selectedOutlet}
        outlet={selectedOutlet}
        trends={trends}
        trendLoading={loadingTrends}
        onClose={() => setDetailOpen(false)}
      />

      <div className="flex flex-col gap-8">
        {/* ===== Cabinet hero (Newsroom hero comes from shell) ===== */}
        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Neutrality Cabinet
            </h2>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-400">
              Story-level bias predictability index
            </p>
          </div>
          <p className="max-w-3xl text-sm text-neutral-300">
            This cabinet tracks how predictable and neutral an outlet&apos;s{" "}
            <span className="font-medium">story-level bias</span> is over time.
            We don&apos;t score left vs right. We measure{" "}
            <span className="font-medium">how the story is told</span> and
            compress that into a{" "}
            <span className="font-medium">Predictability Index (PI)</span> from
            0.0 to 1.0. Everyone is reaching toward{" "}
            <span className="font-semibold text-emerald-300">1.00</span>.
          </p>
        </section>

        {/* ===== Data region: leaderboard only ===== */}
        {loadingOverview ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
            Loading cabinet…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-900/40 bg-red-950/40 p-4 text-sm text-red-300">
            Error loading cabinet: {error}
          </div>
        ) : !outlets.length ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
            No scored outlets yet. Once the Neutrality Ledger has graded
            stories, the leaderboard and trends will appear here.
          </div>
        ) : (
          <section className="space-y-4">
            <Leaderboard
              outlets={outlets}
              selectedCanonical={selectedCanonical}
              onSelect={handleSelectOutlet}
            />
            <p className="text-[11px] text-neutral-500">
              Click any outlet card to open a detailed Predictability Index and
              bias breakdown.
            </p>
          </section>
        )}

        {/* ===== Methodology & explainer (below leaderboard) ===== */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-100">
            How the Neutrality Cabinet works
          </h3>
          <div className="grid gap-4 text-xs text-neutral-300 md:grid-cols-3">
            {/* What we measure */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
              <h4 className="mb-1 text-sm font-semibold">
                What we measure (bias)
              </h4>
              <p>
                Each scored story gets four component scores (0–3). Lower is
                more neutral:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Language — emotional vs neutral wording</li>
                <li>Source — diverse, credible vs narrow, shaky</li>
                <li>Framing — balanced perspectives vs one-sided</li>
                <li>Context — key facts included vs missing</li>
              </ul>
              <p className="mt-2 text-[11px] text-neutral-400">
                We only score full articles, not headlines or social posts.
              </p>
            </div>

            {/* Bias intent → PI */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
              <h4 className="mb-1 text-sm font-semibold">
                Bias intent → Predictability Index
              </h4>
              <p>
                We combine those four components into a{" "}
                <span className="font-medium">bias intent score</span> (0–3),
                then convert it into a PI:
              </p>
              <p className="mt-2 font-mono text-xs">PI = 1 − (bias_intent / 3)</p>
              <p className="mt-2 text-[11px] text-neutral-300">
                Closer to 1.0 → more predictable, neutral storytelling. Closer
                to 0.0 → strong, consistent bias in how stories are told.
              </p>
            </div>

            {/* How to read the board */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
              <h4 className="mb-1 text-sm font-semibold">
                How to read this board
              </h4>
              <ul className="list-inside list-disc space-y-1">
                <li>
                  <span className="font-medium">Golden Anchors</span> are the
                  highest-scoring outlets by PI with solid story volume.
                </li>
                <li>
                  The <span className="font-medium">Neutral Band</span> contains
                  outlets with mixed bias patterns but reliable coverage.
                </li>
                <li>
                  The{" "}
                  <span className="font-medium">High Bias Watchlist</span>{" "}
                  surfaces outlets whose language, framing, or context are
                  consistently slanted.
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-neutral-400">
                This doesn&apos;t tell you what to think. It shows{" "}
                <span className="font-medium">
                  how predictable the bias is
                </span>{" "}
                in how stories are delivered.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
