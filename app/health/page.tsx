// app/health/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export const metadata = { robots: { index: false, follow: false } };

type Health = {
  ok: boolean;
  message: string;
  memoryEnabled: boolean;
  flags: { webEnabled: boolean };
  timestamps: { server: string };
  env: { NEXT_PUBLIC_SUPABASE_URL: boolean; NEXT_PUBLIC_SUPABASE_ANON_KEY: boolean };
  workspace?: {
    id: string | null;
    memories: number | null;
    userMemories: number | null;
    quotaMb: number | null;
  };
};

export default function HealthPage() {
  const [data, setData] = useState<Health | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ms, setMs] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  async function load() {
    setErr(null);
    const t0 = performance.now();
    try {
      const r = await fetch('/api/health', {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = (await r.json()) as Health;
      setData(j);
      setMs(Math.round(performance.now() - t0));
    } catch (e: any) {
      setErr(e?.message ?? 'failed to load');
      setMs(null);
    }
  }

  useEffect(() => {
    function start() {
      load();
      timer.current = window.setInterval(load, 15000);
    }
    function stop() {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
    }
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const badge = (on: boolean, label: string, extra?: string | number | null) => (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2">
      <span className={`h-2.5 w-2.5 rounded-full ${on ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      <span className="text-sm opacity-90">{label}</span>
      {extra !== undefined && extra !== null && (
        <span className="ml-1 rounded-md bg-white/10 px-2 py-0.5 text-xs opacity-80">{extra}</span>
      )}
    </div>
  );

  const w = data?.workspace;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">System Health</h1>
        <p className="mt-1 text-sm opacity-70">
          Live status pulled from <code className="opacity-80">/api/health</code>
          {ms !== null ? <span className="ml-2 opacity-60">· {ms} ms</span> : null}
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          {err && (
            <div className="mb-4 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-rose-200">
              Failed to load health: {err}
            </div>
          )}

          {!data && !err && <div className="opacity-70">Loading…</div>}

          {data && (
            <>
              {/* Core badges */}
              <div className="flex flex-wrap gap-3">
                {badge(data.ok, 'Backend reachable')}
                {badge(data.memoryEnabled, 'Supabase (SRK)')}
                {badge(data.flags.webEnabled, 'Web search enabled')}
                {badge(data.env.NEXT_PUBLIC_SUPABASE_URL, 'SUPABASE_URL')}
                {badge(data.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'ANON_KEY')}
                {/* Workspace badges */}
                {badge(!!w?.id, 'Workspace', w?.id ? w.id.slice(0, 8) : 'none')}
                {badge(w?.memories !== null, 'Workspace Memories', w?.memories ?? '—')}
                {badge(w?.userMemories !== null, 'User Memories (guest)', w?.userMemories ?? '—')}
                {badge(w?.quotaMb !== null, 'Memory Quota (MB)', w?.quotaMb ?? '—')}
              </div>

              {/* Details */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-wide opacity-60">Message</div>
                  <div className="mt-1 text-sm">{data.message}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-wide opacity-60">Server Time</div>
                  <div className="mt-1 text-sm">
                    {new Date(data.timestamps.server).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={load}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
                >
                  Refresh
                </button>
                <a
                  href="/api/health"
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
                >
                  View JSON
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
