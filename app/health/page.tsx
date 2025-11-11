// app/health/page.tsx
export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

import HealthPanel from './HealthPanel';

export default function HealthPage() {
  // Server component: renders the shell and mounts a client island that
  // does the live polling / rendering.
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">System Health</h1>
        <p className="mt-1 text-sm opacity-70">
          Live status pulled from <code className="opacity-80">/api/health</code>.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <HealthPanel />
        </div>
      </div>
    </main>
  );
}
