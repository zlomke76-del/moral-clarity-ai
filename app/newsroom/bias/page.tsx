// app/newsroom/bias/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type OutletOverall = {
  outlet: string;
  total_stories: number;
  first_scored_at: string | null;
  last_scored_at: string | null;
  avg_bias_language: number | null;
  avg_bias_source: number | null;
  avg_bias_framing: number | null;
  avg_bias_context: number | null;
  avg_bias_intent: number | null;
  avg_pi_score: number | null;
  last_story_title: string | null;
  last_story_url: string | null;
  last_story_bias_intent: number | null;
  last_story_pi_score: number | null;
  last_story_created_at: string | null;
};

type DailyTrendRow = {
  outlet: string;
  story_day: string; // YYYY-MM-DD
  outlet_story_count: number;
  avg_bias_language: number | null;
  avg_bias_source: number | null;
  avg_bias_framing: number | null;
  avg_bias_context: number | null;
  avg_bias_intent: number | null;
  avg_pi_score: number | null;
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString();
}

function formatNumber(n: number | null | undefined, digits = 2) {
  if (n === null || n === undefined) return '—';
  return n.toFixed(digits);
}

function piBadgeClass(pi: number | null | undefined) {
  if (pi === null || pi === undefined) return 'bg-neutral-800 text-neutral-300';
  if (pi >= 0.8) return 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/60';
  if (pi >= 0.6) return 'bg-amber-900/60 text-amber-200 border border-amber-700/60';
  return 'bg-rose-900/60 text-rose-200 border border-rose-700/60';
}

function biasBucketLabel(bias: number | null | undefined) {
  if (bias === null || bias === undefined) return 'Unknown';
  if (bias <= 0.6) return 'Very low framing';
  if (bias <= 0.85) return 'Mild framing';
  if (bias <= 1.1) return 'Clear framing';
  return 'Heavy framing';
}

export default function NewsroomBiasPage() {
  const [overall, setOverall] = useState<OutletOverall[]>([]);
  const [daily, setDaily] = useState<DailyTrendRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [days, setDays] = useState<number>(30);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [overallRes, dailyRes] = await Promise.all([
          fetch('/api/news/outlet-overall'),
          fetch(`/api/news/outlet-daily?days=${days}`),
        ]);

        if (!overallRes.ok) {
          const t = await overallRes.text();
          throw new Error(`outlet-overall: ${overallRes.status} ${t}`);
        }
        if (!dailyRes.ok) {
          const t = await dailyRes.text();
          throw new Error(`outlet-daily: ${dailyRes.status} ${t}`);
        }

        const overallJson = await overallRes.json();
        const dailyJson = await dailyRes.json();

        if (!cancelled) {
          setOverall(overallJson.outlets ?? []);
          setDaily(dailyJson.rows ?? []);
          if (!selectedOutlet && (overallJson.outlets?.length ?? 0) > 0) {
            setSelectedOutlet(overallJson.outlets[0].outlet);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('[NewsroomBiasPage] load error', err);
          setError(err?.message || 'Failed to load bias data.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const totalStories = useMemo(
    () => overall.reduce((sum, o) => sum + (o.total_stories || 0), 0),
    [overall]
  );

  const outletMap = useMemo(() => {
    const m = new Map<string, OutletOverall>();
    for (const o of overall) {
      if (o.outlet) m.set(o.outlet, o);
    }
    return m;
  }, [overall]);

  const dailyForSelected = useMemo(() => {
    if (!selectedOutlet) return [];
    return daily
      .filter((r) => r.outlet === selectedOutlet)
      .sort((a, b) => a.story_day.localeCompare(b.story_day));
  }, [daily, selectedOutlet]);

  return (
    <div className="space-y-8">
      {/* Header / Intro */}
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Neutral News • Outlet Bias & Predictability
        </h1>
        <p className="text-sm text-neutral-300 max-w-3xl">
          This page summarizes how Solace scores news outlets over time. Each outlet is evaluated
          story-by-story using the Neutral News Protocol: language, sources, framing, and context.
          We then compute a bias-intent score (0–3) and a Predictability Index (0–1) for each
          outlet, along with a record of the most recent article graded.
        </p>
      </section>

      {/* High-level summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="text-xs uppercase tracking-wide text-neutral-400">
            Outlets analyzed
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {overall.length}
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Each outlet has at least one story graded by the Neutral News Protocol.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="text-xs uppercase tracking-wide text-neutral-400">
            Stories graded
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {totalStories}
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Total stories used to compute outlet bias and PI scores.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-wide text-neutral-400">
              Time window
            </div>
            <select
              className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100"
              value={days}
              onChange={(e) => setDays(Number(e.target.value) || 30)}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <p className="mt-3 text-xs text-neutral-400">
            Daily trends below are limited to the selected window.
          </p>
        </div>
      </section>

      {/* Loading / error states */}
      {loading && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 text-sm text-neutral-300">
          Loading outlet bias and trend data…
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-800 bg-rose-950/60 p-4 text-sm text-rose-100">
          {error}
        </div>
      )}

      {/* Outlet cards */}
      {!loading && !error && overall.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Outlet snapshot
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {overall.map((o) => (
              <button
                key={o.outlet}
                type="button"
                onClick={() => setSelectedOutlet(o.outlet)}
                className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition ${
                  selectedOutlet === o.outlet
                    ? 'border-blue-500/80 bg-blue-950/40'
                    : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {o.outlet || 'Unknown outlet'}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {o.total_stories} stories graded
                    </span>
                  </div>
                  <div
                    className={
                      'rounded-full px-3 py-1 text-xs font-medium ' +
                      piBadgeClass(o.avg_pi_score)
                    }
                  >
                    PI {formatNumber(o.avg_pi_score, 3)}
                  </div>
                </div>

                <div className="text-xs text-neutral-300">
                  <span className="font-medium">
                    Bias intent:
                  </span>{' '}
                  {formatNumber(o.avg_bias_intent, 3)} · {biasBucketLabel(o.avg_bias_intent)}
                </div>

                <div className="mt-1 text-xs text-neutral-400">
                  <span className="font-medium">Last article:</span>{' '}
                  {o.last_story_title ? (
                    <>
                      {o.last_story_url ? (
                        <a
                          href={o.last_story_url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2 hover:text-neutral-200"
                        >
                          {o.last_story_title}
                        </a>
                      ) : (
                        o.last_story_title
                      )}
                      {' · '}
                    </>
                  ) : (
                    'N/A · '
                  )}
                  graded {formatDate(o.last_story_created_at)}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Outlet table */}
      {!loading && !error && overall.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Outlet details
          </h2>
          <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950/60">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-neutral-900/80 text-neutral-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Outlet</th>
                  <th className="px-3 py-2 text-right font-medium">Stories</th>
                  <th className="px-3 py-2 text-right font-medium">Avg PI</th>
                  <th className="px-3 py-2 text-right font-medium">Avg Bias</th>
                  <th className="px-3 py-2 text-right font-medium">Lang</th>
                  <th className="px-3 py-2 text-right font-medium">Source</th>
                  <th className="px-3 py-2 text-right font-medium">Framing</th>
                  <th className="px-3 py-2 text-right font-medium">Context</th>
                  <th className="px-3 py-2 text-left font-medium">Last article (title)</th>
                  <th className="px-3 py-2 text-left font-medium">Last graded</th>
                </tr>
              </thead>
              <tbody>
                {overall.map((o) => (
                  <tr
                    key={`row-${o.outlet}`}
                    className={
                      selectedOutlet === o.outlet
                        ? 'bg-blue-950/40'
                        : 'odd:bg-neutral-950/40 even:bg-neutral-900/30'
                    }
                  >
                    <td className="px-3 py-2 text-left align-top">
                      <button
                        type="button"
                        onClick={() => setSelectedOutlet(o.outlet)}
                        className="text-xs font-medium text-neutral-100 hover:underline"
                      >
                        {o.outlet || 'Unknown'}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-200">
                      {o.total_stories}
                    </td>
                    <td className="px-3 py-2 text-right align-top">
                      {formatNumber(o.avg_pi_score, 3)}
                    </td>
                    <td className="px-3 py-2 text-right align-top">
                      {formatNumber(o.avg_bias_intent, 3)}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-300">
                      {formatNumber(o.avg_bias_language, 2)}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-300">
                      {formatNumber(o.avg_bias_source, 2)}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-300">
                      {formatNumber(o.avg_bias_framing, 2)}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-300">
                      {formatNumber(o.avg_bias_context, 2)}
                    </td>
                    <td className="px-3 py-2 text-left align-top text-neutral-200">
                      {o.last_story_title || '—'}
                    </td>
                    <td className="px-3 py-2 text-left align-top text-neutral-300">
                      {formatDate(o.last_story_created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Trends for selected outlet */}
      {!loading && !error && selectedOutlet && dailyForSelected.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Daily trends for {selectedOutlet}
          </h2>
          <p className="text-xs text-neutral-400 max-w-2xl">
            Bias-intent and Predictability Index (PI) are averaged per day, based on the stories
            we graded from this outlet in the selected window.
          </p>
          <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950/60">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-neutral-900/80 text-neutral-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Day</th>
                  <th className="px-3 py-2 text-right font-medium">Stories</th>
                  <th className="px-3 py-2 text-right font-medium">Avg PI</th>
                  <th className="px-3 py-2 text-right font-medium">Avg Bias</th>
                  <th className="px-3 py-2 text-right font-medium">Language</th>
                  <th className="px-3 py-2 text-right font-medium">Source</th>
                  <th className="px-3 py-2 text-right font-medium">Framing</th>
                  <th className="px-3 py-2 text-right font-medium">Context</th>
                </tr>
              </thead>
              <tbody>
                {dailyForSelected.map((r) => (
                  <tr key={`${r.outlet}-${r.story_day}`} className="odd:bg-neutral-950/40 even:bg-neutral-900/30">
                    <td className="px-3 py-2 text-left align-top text-neutral-200">
                      {r.story_day}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-200">
                      {r.outlet_story_count}
                    </td>
                    <td className="px-3 py-2 text-right align-top">
                      {formatNumber(r.avg_pi_score, 3)}
                    </td>
                    <td className="px-3 py-2 text-right align-top">
                      {formatNumber(r.avg_bias_intent, 3)}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-300">
                      {formatNumber(r.avg_bias_language, 2)}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-300">
                      {formatNumber(r.avg_bias_source, 2)}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-300">
                      {formatNumber(r.avg_framing, 2)}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-300">
                      {formatNumber(r.avg_context, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
