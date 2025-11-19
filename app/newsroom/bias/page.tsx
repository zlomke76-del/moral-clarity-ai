// app/newsroom/bias/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts';

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

  const dailyForSelected = useMemo(() => {
    if (!selectedOutlet) return [];
    return daily
      .filter((r) => r.outlet === selectedOutlet)
      .sort((a, b) => a.story_day.localeCompare(b.story_day));
  }, [daily, selectedOutlet]);

  const selectedOutletOverall = useMemo(
    () => overall.find((o) => o.outlet === selectedOutlet) || null,
    [overall, selectedOutlet]
  );

  return (
    <div className="space-y-10">
      {/* Header / Intro */}
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Neutral News • Outlet Bias & Predictability
        </h1>
        <p className="text-sm text-neutral-300 max-w-3xl">
          This page shows how Solace scores news outlets over time. Each story is graded using the
          Neutral News Protocol across four components — language, sources, framing, and context —
          then combined into a bias-intent score (0–3) and a Predictability Index (PI) between 0
          and 1. The closer PI is to 1.0, the more consistent and predictable the outlet&apos;s
          framing appears based on the stories we&apos;ve seen. How important that is is up to you.
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
            Each outlet below has at least one story graded by the Neutral News Protocol.
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
            Total stories used to compute outlet bias and Predictability Index scores.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-wide text-neutral-400">
              Trend window
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
            Daily trends and charts below are limited to the selected time window.
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

      {/* Outlet snapshot grid */}
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

      {/* Outlet details table */}
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

      {/* Charts + daily trends for selected outlet */}
      {!loading && !error && selectedOutlet && dailyForSelected.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Daily trends for {selectedOutlet}
            </h2>
            {selectedOutletOverall && (
              <div className="text-xs text-neutral-400">
                Lifetime PI:{' '}
                <span className="font-semibold text-neutral-100">
                  {formatNumber(selectedOutletOverall.avg_pi_score, 3)}
                </span>{' '}
                · Lifetime bias intent:{' '}
                <span className="font-semibold text-neutral-100">
                  {formatNumber(selectedOutletOverall.avg_bias_intent, 3)}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-neutral-400 max-w-2xl">
            Each point in the chart represents that day&apos;s average for the outlet based on the
            stories we graded. Bias-intent is a composite of language, source balance, framing, and
            context (0 = no detectable bias, 3 = strong bias). The Predictability Index (PI) is
            derived as <code>1 - bias_intent / 3</code>, where values closer to 1.0 indicate more
            consistent and predictable framing in the stories we have seen.
          </p>

          {/* Combined line + bar chart */}
          <div className="h-72 w-full rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyForSelected}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="story_day"
                  tick={{ fontSize: 10, fill: '#a3a3a3' }}
                  tickMargin={6}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, 3]}
                  tick={{ fontSize: 10, fill: '#a3a3a3' }}
                  tickMargin={4}
                  label={{
                    value: 'Bias intent (0–3)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#a3a3a3',
                    fontSize: 10,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 'auto']}
                  tick={{ fontSize: 10, fill: '#a3a3a3' }}
                  tickMargin={4}
                  label={{
                    value: 'PI / Story count',
                    angle: 90,
                    position: 'insideRight',
                    fill: '#a3a3a3',
                    fontSize: 10,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #27272a',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  labelStyle={{ color: '#e5e5e5' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => (
                    <span className="text-neutral-200">{String(value)}</span>
                  )}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avg_bias_intent"
                  name="Bias intent"
                  dot={{ r: 2 }}
                  activeDot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avg_pi_score"
                  name="PI"
                  strokeDasharray="4 2"
                  dot={{ r: 2 }}
                  activeDot={{ r: 3 }}
                />
                <Bar
                  yAxisId="right"
                  dataKey="outlet_story_count"
                  name="Stories graded"
                  opacity={0.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Daily numbers table */}
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
                  <tr
                    key={`${r.outlet}-${r.story_day}`}
                    className="odd:bg-neutral-950/40 even:bg-neutral-900/30"
                  >
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
                      {formatNumber(r.avg_bias_framing, 2)}
                    </td>
                    <td className="px-3 py-2 text-right align-top text-neutral-300">
                      {formatNumber(r.avg_bias_context, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Methodology explanation */}
      <section className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold tracking-tight">
          How the Neutral News scores are computed
        </h2>
        <p className="text-sm text-neutral-300 max-w-3xl">
          For each story, Solace reads a snapshot of the article and produces a neutral brief plus
          four component scores. These numbers are not &quot;fact-check&quot; labels — they measure
          how the story is told, not whether it&apos;s true.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 text-xs text-neutral-300">
            <h3 className="text-sm font-semibold text-neutral-100">
              1. Four bias components (0–3 each)
            </h3>
            <ul className="space-y-1 list-disc pl-4">
              <li>
                <span className="font-semibold">Language:</span> how emotionally charged or
                inflammatory the wording is.
              </li>
              <li>
                <span className="font-semibold">Source balance:</span> how many perspectives and how
                credible the quoted sources appear.
              </li>
              <li>
                <span className="font-semibold">Framing:</span> how events and actors are framed
                (heroes vs. villains, good vs. evil, etc.).
              </li>
              <li>
                <span className="font-semibold">Context:</span> whether important background
                information is missing or downplayed.
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs text-neutral-300">
            <h3 className="text-sm font-semibold text-neutral-100">
              2. Bias intent & Predictability Index
            </h3>
            <p>
              These four components are combined into a single{' '}
              <span className="font-semibold">bias-intent score</span>:
            </p>
            <pre className="mt-1 rounded-md bg-neutral-900 px-3 py-2 text-[11px] text-neutral-200">
{`bias_intent =
  0.30 · language +
  0.25 · source +
  0.25 · framing +
  0.20 · context`}
            </pre>
            <p className="mt-2">
              From there, we compute a <span className="font-semibold">Predictability Index (PI)</span>:
            </p>
            <pre className="mt-1 rounded-md bg-neutral-900 px-3 py-2 text-[11px] text-neutral-200">
{`pi_score = 1 - (bias_intent / 3)   // range: 0–1`}
            </pre>
            <ul className="mt-2 space-y-1 list-disc pl-4">
              <li>PI closer to 1.0 → more predictable, neutral-style framing in our sample.</li>
              <li>PI closer to 0.0 → stronger, more directional framing in the stories we saw.</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-neutral-400 max-w-3xl">
          These scores are descriptive, not prescriptive. They tell you how an outlet tends to
          present information in the stories we&apos;ve graded so far. It&apos;s up to you to
          decide whether you prefer outlets that read as more neutral and predictable, or whether
          you value a more opinionated voice for certain topics.
        </p>
      </section>
    </div>
  );
}
