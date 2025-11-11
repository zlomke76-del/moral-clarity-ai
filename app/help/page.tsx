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
        headers: { 'Accept': 'application/json' },
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
    // start/stop with tab visibility
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const badge = (on: boolean, label: string) => (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2">
      <span className={`h-2.5 w-2.5 rounded-full ${on ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      <span className="text-sm opacity-90">{label}</span>
    </div>
  );

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

          {!data && !err && <div className="
