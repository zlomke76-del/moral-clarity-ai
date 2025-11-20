// app/newsroom/cabinet/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { OutletOverview, OutletTrendPoint } from "./types";
import Leaderboard from "./components/Leaderboard";
import { OutletDetailDialog } from "./components/OutletDetailDialog";
import type { OutletDetailData } from "./components/OutletDetailDialog";

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
  const [selected, setSelected] = useState<OutletOverview | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [trends, setTrends] = useState<OutletTrendPoint[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================
     Load lifetime outlet overview
     ============================ */
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
  }, []);

  /* ============================
     Load daily trend data
     ============================ */
  useEffect(() => {
    let alive = true;

    if (!selected) {
      setTrends(null);
      return;
    }

    (async () => {
      try {
        setTrendLoading(true);

        const res = await fetch(
          `/api/news/outlets/trends?outlet=${encodeURIComponent(
            selected.canonical_outlet
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
        if (alive) setTrendLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selected?.canonical_outlet]);

  /* ============================
     Convert OutletOverview → OutletDetailData
     ============================ */
  function mapToDetail(outlet: OutletOverview | null): OutletDetailData | null {
    if (!outlet) return null;

    return {
      canonical_outlet: outlet.canonical_outlet,
      display_name: outlet.canonical_outlet,
      tierLabel: getTierLabel(outlet.avg_bias_intent, outlets),

      storiesAnalyzed: outlet.total_stories,

      lifetimePi: outlet.avg_pi,
      lifetimeBiasIntent: outlet.avg_bias_intent,
      lifetimeLanguage: outlet.bias_language,
      lifetimeSource: outlet.bias_source,
      lifetimeFraming: outlet.bias_framing,
      lifetimeContext: outlet.bias_context,

      lastScoredAt: outlet.last_story_day ?? null,

      // Placeholder — can be replaced when you compute 90d PI + trend
      ninetyDayPi: null,
      trendDirection: "flat",
    };
  }

  function getTierLabel(biasIntent: number, all: OutletOverview[]) {
    const sorted = [...all].sort(
      (a, b) => a.avg_bias_intent - b.avg_bias_intent
    );
    const index = sorted.findIndex(
      (o) => o.avg_bias_intent === biasIntent
    );

    if (index === -1) return "Neutral Band";
    if (index < 3) return "Golden Anchor";
    if (index >= sorted.length - 3) return "High Bias Watchlist";
    return "Neutral Band";
  }

  /* ============================
     Render
     ============================ */
  return (
    <div className="flex flex-col gap-8">
      {/* ===== Cabinet Header ===== */}
      <section className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Neutrality Cabinet
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-400">
            Story-level bias predictability index
          </p>
        </div>
        <p className="text-sm text-neutral-300 max-w-3xl">
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

      {/* ===== Data state handling ===== */}
      {loading ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
          Loading cabinet…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-900/40 bg-red-950/40 p-4 text-sm text-red-300">
          Error loading cabinet: {error}
        </div>
      ) : !outlets.length ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
          No scored outlets yet. Once the Neutrality Ledger has graded stories,
          the leaderboard will appear here.
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)]">
          {/* ===== Leaderboard (left) ===== */}
          <Leaderboard
            outlets={outlets}
            selectedCanonical={selected?.canonical_outlet ?? null}
            onSelect={(canon) => {
              const next = outlets.find(
                (o) => o.canonical_outlet === canon
              );
              if (next) {
                setSelected(next);
                setModalOpen(true);
              }
            }}
          />

          {/* Right column unused; modal covers details */}
          <div />
        </section>
      )}

      {/* ===== Modal (Outlet Detail Dialog) ===== */}
      <OutletDetailDialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelected(null);
        }}
        outlet={mapToDetail(selected)}
        trends={trendLoading ? null : trends}
      />

      {/* ===== Methodology Section ===== */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-100">
          How the Neutrality Cabinet works
        </h2>
        <div className="grid gap-4 md:grid-cols-3 text-xs text-neutral-300">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <h3 className="mb-1 text-sm font-semibold">
              What we measure (bias)
            </h3>
            <p>
              Each scored story gets four component scores (0–3). Lower is more
              neutral:
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

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <h3 className="mb-1 text-sm font-semibold">
              Bias intent → Predictability Index
            </h3>
            <p>
              We combine those four components into a{" "}
              <span className="font-medium">bias intent score</span> (0–3), then
              convert it into a PI:
            </p>
            <p className="mt-2 font-mono text-xs">
              PI = 1 − (bias_intent / 3)
            </p>
            <p className="mt-2 text-[11px] text-neutral-300">
              Closer to 1.0 → more predictable, neutral storytelling. Closer to
              0.0 → strong, consistent bias in how stories are told.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <h3 className="mb-1 text-sm font-semibold">
              How to read this board
            </h3>
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
                surfaces outlets whose language, framing, or context show
                stronger bias patterns.
              </li>
            </ul>
            <p className="mt-2 text-[11px] text-neutral-400">
              This doesn&apos;t tell you what to think. It shows{" "}
              <span className="font-medium">how predictable the bias is</span>{" "}
              in how stories are delivered.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
