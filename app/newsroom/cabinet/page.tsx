"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import type { OutletOverview, OutletStats } from "./types";
import Leaderboard from "./components/Leaderboard";
import ScoreBreakdown from "./components/ScoreBreakdown";

/**
 * Canonical outlet merge map.
 * Keys = raw ingestion identifiers (lowercased).
 * Values = canonical display name ONLY.
 */
const OUTLET_MERGE_CANON: Record<string, string> = {
  // ----------------------------------------------------------
  // BBC
  // ----------------------------------------------------------
  "bbc.co.uk": "BBC",
  "bbc.com": "BBC",
  "www.bbc.co.uk": "BBC",
  "www.bbc.com": "BBC",
  bbc: "BBC",

  // ----------------------------------------------------------
  // Newsmax
  // ----------------------------------------------------------
  "ir.newsmax": "Newsmax",
  "ir.newsmax.com": "Newsmax",
  "newsmax.com": "Newsmax",
  newsmax: "Newsmax",

  // ----------------------------------------------------------
  // Time
  // ----------------------------------------------------------
  "nation.time": "Time",
  "newsweek.time": "Time",
  "nation.time.com": "Time",
  "newsfeed.time.com": "Time",
  "time.com": "Time",
  time: "Time",

  // ----------------------------------------------------------
  // Bloomberg
  // ----------------------------------------------------------
  "bna.content.cirrus.bloomberg.com": "Bloomberg",
  "bna content - bloomberg": "Bloomberg",
  "bna content": "Bloomberg",
  bloomberg: "Bloomberg",

  // ----------------------------------------------------------
  // DW
  // ----------------------------------------------------------
  "amp.dw.com": "DW",
  "dw.com": "DW",
  dw: "DW",

  // ----------------------------------------------------------
  // RFERL
  // ----------------------------------------------------------
  "about.rferl.org": "RFERL",
  "about.rferl": "RFERL",
  "rferl.org": "RFERL",
  rferl: "RFERL",

  // ----------------------------------------------------------
  // Washington Examiner
  // ----------------------------------------------------------
  "wp.washingtonexaminer.com": "Washington Examiner",
  "washingtonexaminer.com": "Washington Examiner",
  "newsletters.washingtonexaminer.com": "Washington Examiner",
  "washington examiner": "Washington Examiner",

  // ----------------------------------------------------------
  // Fox News
  // ----------------------------------------------------------
  "radio.foxnews.com": "Fox News",
  "foxnews.com": "Fox News",
  "fox news": "Fox News",

  // ----------------------------------------------------------
  // NEW YORK TIMES (including NYT Cooking)
  // ----------------------------------------------------------
  "nytimes.com": "NY Times",
  "www.nytimes.com": "NY Times",
  "nyt.com": "NY Times",
  "ny times": "NY Times",
  "new york times": "NY Times",

  // NYTimes Cooking → NY Times
  "cooking.nytimes.com": "NY Times",
  "nytimes cooking": "NY Times",
  "nyt cooking": "NY Times",
  nytimescooking: "NY Times",
};

function normalizeKey(raw: string): string {
  return (raw || "").trim().toLowerCase();
}

/**
 * Merge duplicate outlets while preserving:
 * - canonical DISPLAY name
 * - stable BACKEND QUERY KEY
 */
function mergeDuplicateOutlets(
  outlets: OutletOverview[]
): (OutletOverview & { __query_key: string })[] {
  const map = new Map<
    string,
    OutletOverview & {
      __stories: number;
      __pi_numerator: number;
      __query_key: string;
    }
  >();

  for (const outlet of outlets) {
    const rawName = outlet.outlet || "";
    const norm = normalizeKey(rawName);
    const canonical = OUTLET_MERGE_CANON[norm] || rawName.trim();
    const key = normalizeKey(canonical);

    const stories = Number(outlet.total_stories) || 0;
    const pi = Number((outlet as any).avg_pi_weighted) || 0;

    if (map.has(key)) {
      const existing = map.get(key)!;

      const combinedStories = existing.__stories + stories;
      const combinedPiNumerator = existing.__pi_numerator + pi * stories;

      map.set(key, {
        ...existing,
        outlet: canonical,
        total_stories: combinedStories,
        avg_pi_weighted:
          combinedStories > 0 ? combinedPiNumerator / combinedStories : 0,
        __stories: combinedStories,
        __pi_numerator: combinedPiNumerator,
      });
    } else {
      map.set(key, {
        ...outlet,
        outlet: canonical,
        __query_key: rawName,
        __stories: stories,
        __pi_numerator: pi * stories,
      });
    }
  }

  return Array.from(map.values()).map((o) => {
    const { __stories, __pi_numerator, ...clean } = o;
    return clean;
  });
}

type RankedOutlet = OutletOverview & {
  rank: number;
  __query_key: string;
};

export default function NewsroomCabinetPage() {
  const [rawOutlets, setRawOutlets] = useState<OutletOverview[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<OutletStats | null>(null);

  useEffect(() => {
    fetch("/api/news/outlets/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setRawOutlets(d.outlets);
          setSelected(d.outlets?.[0]?.outlet ?? null);
        }
      });
  }, []);

  const mergedOutlets = useMemo(
    () => mergeDuplicateOutlets(rawOutlets),
    [rawOutlets]
  );

  const ranked: RankedOutlet[] = useMemo(() => {
    return mergedOutlets
      .filter((o) => Number(o.total_stories) >= 5)
      .slice()
      .sort((a, b) => {
        const piA = Number((a as any).avg_pi_weighted) || 0;
        const piB = Number((b as any).avg_pi_weighted) || 0;
        if (piB !== piA) return piB - piA;
        return a.outlet.localeCompare(b.outlet);
      })
      .map((o, i) => ({ ...o, rank: i + 1 }));
  }, [mergedOutlets]);

  useEffect(() => {
    if (!selected) return;

    const selectedOutlet = ranked.find((o) => o.outlet === selected);

    if (!selectedOutlet) {
      setStats(null);
      return;
    }

    fetch(
      `/api/news/outlet-stats?outlet=${encodeURIComponent(
        selectedOutlet.__query_key
      )}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStats(d.outlet);
        else setStats(null);
      });
  }, [selected, ranked]);

  const goldenAnchor = ranked.slice(0, 3);
  const neutralField = ranked.slice(3, ranked.length - 3);
  const watchList = ranked.slice(-3);

  const totalStoriesEvaluated = useMemo(
    () =>
      ranked.reduce((sum, o) => sum + (Number(o.total_stories) || 0), 0),
    [ranked]
  );

  return (
    <main className="grid h-screen min-h-0 w-screen grid-cols-[260px_minmax(0,1fr)] overflow-hidden bg-transparent text-white">
      <aside className="h-full overflow-y-auto border-r border-white/8 bg-neutral-950/70 backdrop-blur-xl">
        <NeuralSidebar />
      </aside>

      <section className="relative flex min-h-0 h-full w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(250,204,21,0.07),transparent_22%),linear-gradient(180deg,rgba(4,10,24,0.96)_0%,rgba(3,7,18,0.995)_100%)]" />

        <div className="relative z-10 flex h-full min-h-0 w-full flex-col overflow-hidden px-8 py-8">
          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <div className="mx-auto w-full max-w-6xl">
              <header className="mb-10 border-b border-white/8 pb-8 text-center">
                <div className="inline-flex items-center rounded-full border border-amber-300/15 bg-amber-300/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100/80">
                  Newsroom Cabinet
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Moral Clarity Newsroom
                </h1>

                <p className="mt-3 text-sm leading-6 text-white/55 sm:text-base">
                  Powered by Solace — neutral, transparent, ethical journalism
                  tools.
                </p>
              </header>

              <div className="flex flex-col gap-10">
                <div className="rounded-2xl border border-white/8 bg-white/[0.025] px-5 py-4 text-xs text-white/55 shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
                  {totalStoriesEvaluated.toLocaleString()} stories analyzed · PI
                  based on lifetime.
                  <span className="ml-2">
                    ·{" "}
                    <Link
                      href="/newsroom/methodology"
                      className="underline underline-offset-2 transition hover:text-white"
                    >
                      Methodology
                    </Link>
                  </span>
                </div>

                {goldenAnchor.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                      Golden Anchor · Top 3 Predictability
                    </h2>
                    <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
                      <Leaderboard
                        outlets={goldenAnchor}
                        selectedOutlet={selected}
                        onSelect={setSelected}
                      />
                    </div>
                  </section>
                )}

                {neutralField.length > 0 && (
                  <section className="border-t border-white/8 pt-8">
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                      Neutral Category · Full Field
                    </h2>
                    <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
                      <Leaderboard
                        outlets={neutralField}
                        selectedOutlet={selected}
                        onSelect={setSelected}
                      />
                    </div>
                  </section>
                )}

                {watchList.length > 0 && (
                  <section className="border-t border-white/8 pt-8">
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-rose-400">
                      Watch List · Lowest Predictability
                    </h2>
                    <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
                      <Leaderboard
                        outlets={watchList}
                        selectedOutlet={selected}
                        onSelect={setSelected}
                      />
                    </div>
                  </section>
                )}

                <section className="border-t border-white/8 pt-8">
                  <div className="rounded-[28px] border border-white/8 bg-white/[0.02] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
                    <ScoreBreakdown outlet={stats} />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
