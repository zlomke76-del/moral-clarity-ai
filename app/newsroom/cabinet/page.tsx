// app/newsroom/cabinet/page.tsx
"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCanonical, setSelectedCanonical] = useState<string | null>(
    null
  );
  const [selectedOutlet, setSelectedOutlet] = useState<OutletOverview | null>(
    null
  );

  const [trends, setTrends] = useState<OutletTrendPoint[] | null>(null);
  const [trendLoading, setTrendLoading] = useState(false);

  /* ========= Load overview ========= */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/news/outlets/overview");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: OverviewResponse = await res.json();
        if (cancelled) return;
        if (!data.ok) throw new Error("Overview API returned not ok");

        const sorted = [...data.outlets].sort(
          (a, b) => a.avg_bias_intent - b.avg_bias_intent
        );

        setOutlets(sorted);

        // Default selection: top-ranked outlet
        if (!selectedCanonical && sorted.length > 0) {
          setSelectedCanonical(sorted[0].canonical_outlet);
        }
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message || "Failed to load outlet overview.");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedCanonical]);

  /* ========= Sync selected outlet + load trend ========= */
  useEffect(() => {
    let cancelled = false;

    if (!selectedCanonical || outlets.length === 0) {
      setSelectedOutlet(null);
      setTrends(null);
      setTrendLoading(false);
      return;
    }

    const outlet =
      outlets.find((o) => o.canonical_outlet === selectedCanonical) ?? null;

    setSelectedOutlet(outlet);
    setTrends(null);

    if (!outlet) {
      setTrendLoading(false);
      return;
    }

    (async () => {
      try {
        setTrendLoading(true);

        const res = await fetch(
          `/api/news/outlets/trends?outlet=${encodeURIComponent(
            outlet.canonical_outlet
          )}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: TrendsResponse = await res.json();
        if (cancelled) return;
        if (!data.ok) throw new Error("Trends API returned not ok");

        setTrends(data.points);
      } catch {
        if (cancelled) return;
        setTrends(null);
      } finally {
        if (cancelled) return;
        setTrendLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedCanonical, outlets]);

  return (
    <div className="flex flex-col gap-8">
      {/* ===== Page hero (no duplicate newsroom title) ===== */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Neutrality Cabinet
          </h2>
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

      {/* ===== Data region: leaderboard ===== */}
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
        <>
          <section className="space-y-4">
            <Leaderboard
              outlets={outlets}
              selectedCanonical={selectedCanonical}
              onSelect={(canon) => setSelectedCanonical(canon)}
            />
            <p className="text-xs text-neutral-400">
              Click any outlet card to open a detailed Predictability Index and
              bias breakdown.
            </p>
          </section>
        </>
      )}

      {/* ===== Methodology & explainer ===== */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-neutral-100">
          How the Neutrality Cabinet works
        </h2>
        <div className="grid gap-4 md:grid-cols-3 text-xs text-neutral-300">
          {/* What we measure */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <h3 className="text-sm font-semibold mb-1">
              What we measure (bias)
            </h3>
            <p>
              Each scored story gets four component scores (0–3). Lower is more
              neutral:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
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
            <h3 className="text-sm font-semibold mb-1">
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

          {/* How to read the board */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <h3 className="text-sm font-semibold mb-1">
              How to read this board
            </h3>
            <ul className="space-y-1 list-disc list-inside">
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
              <span className="font-medium">how predictable the bias is</span>{" "}
              in how stories are delivered.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Detail modal overlay (centered, on top of everything) ===== */}
      <OutletDetailModal
        open={!!selectedCanonical && !!selectedOutlet}
        outlet={selectedOutlet}
        trends={trends}
        trendLoading={trendLoading}
        onClose={() => setSelectedCanonical(null)}
      />
    </div>
  );
}
