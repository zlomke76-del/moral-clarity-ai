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
  canonical_outlet: string; // 🔒 identity
  outlet: string; // display label (may be domain or human name)
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
  canonical_outlet: string;
  outlet: string;
  story_day: string;
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

  // 🔒 canonical-only state
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
          throw new Error(`outlet-overall: ${overallRes.status}`);
        }
        if (!dailyRes.ok) {
          throw new Error(`outlet-daily: ${dailyRes.status}`);
        }

        const overallJson = await overallRes.json();
        const dailyJson = await dailyRes.json();

        if (!cancelled) {
          const outlets: OutletOverall[] = overallJson.outlets ?? [];
          setOverall(outlets);
          setDaily(dailyJson.rows ?? []);

          // 🔒 default selection = canonical_outlet ONLY
          if (!selectedOutlet && outlets.length > 0) {
            setSelectedOutlet(outlets[0].canonical_outlet);
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
      .filter((r) => r.canonical_outlet === selectedOutlet)
      .sort((a, b) => a.story_day.localeCompare(b.story_day));
  }, [daily, selectedOutlet]);

  const selectedOutletOverall = useMemo(
    () => overall.find((o) => o.canonical_outlet === selectedOutlet) || null,
    [overall, selectedOutlet]
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Neutral News • Outlet Bias & Predictability
        </h1>
      </section>

      {/* Snapshot grid */}
      {!loading && !error && overall.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {overall.map((o) => (
            <button
              key={o.canonical_outlet}
              type="button"
              onClick={() => setSelectedOutlet(o.canonical_outlet)}
              className={`rounded-xl border p-4 text-left ${
                selectedOutlet === o.canonical_outlet
                  ? 'border-blue-500/80 bg-blue-950/40'
                  : 'border-neutral-800 bg-neutral-900/60'
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-semibold">{o.outlet}</div>
                  <div className="text-xs text-neutral-400">
                    {o.total_stories} stories graded
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${piBadgeClass(o.avg_pi_score)}`}>
                  PI {formatNumber(o.avg_pi_score, 3)}
                </div>
              </div>
            </button>
          ))}
        </section>
      )}

      {/* Daily trends */}
      {!loading && !error && selectedOutlet && dailyForSelected.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Daily trends for {selectedOutletOverall?.outlet ?? selectedOutlet}
          </h2>

          <div className="h-72 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyForSelected}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="story_day" />
                <YAxis yAxisId="left" domain={[0, 3]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" dataKey="avg_bias_intent" name="Bias intent" />
                <Line yAxisId="right" dataKey="avg_pi_score" name="PI" strokeDasharray="4 2" />
                <Bar yAxisId="right" dataKey="outlet_story_count" name="Stories" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}
