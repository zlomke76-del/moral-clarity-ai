// app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";

type Ticket = {
  id: string; name: string|null; email: string;
  category: string; status: string; created_at: string; description: string;
};

export default function AdminOverview() {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  const [data, setData] = useState<{
    updatedAt: string;
    support: { open: number; in_progress: number; resolved: number; last7: number; latest: Ticket[] };
    env: { RESEND_API_KEY: boolean; SUPPORT_INBOX: boolean; APP_BASE_URL: boolean };
  } | null>(null);

  async function load() {
    if (!key) return;
    setLoading(true); setErr(null);
    const res = await fetch("/api/admin/metrics", {
      headers: { "x-admin-key": key },
      cache: "no-store",
    });
    if (!res.ok) { setErr(await res.text()); setLoading(false); return; }
    setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [key]);

  function fmt(d: string) { try { return new Date(d).toLocaleString(); } catch { return d; } }

  if (!key) {
    return (
      <main className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-semibold mb-3">Admin Overview</h1>
        <p className="text-gray-400 mb-4">Enter your admin key to view metrics.</p>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="ADMIN_DASH_KEY"
          onChange={(e)=>setKey(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-3">
          You can rotate this key anytime in Vercel → Environment Variables.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <button onClick={load} className="border rounded px-3 py-2">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {err && <div className="border rounded p-3 text-red-400 mb-4">{err}</div>}

      {data && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="border rounded p-4">
              <div className="text-sm text-gray-400">Open Tickets</div>
              <div className="text-3xl font-semibold">{data.support.open}</div>
            </div>
            <div className="border rounded p-4">
              <div className="text-sm text-gray-400">In Progress</div>
              <div className="text-3xl font-semibold">{data.support.in_progress}</div>
            </div>
            <div className="border rounded p-4">
              <div className="text-sm text-gray-400">Resolved</div>
              <div className="text-3xl font-semibold">{data.support.resolved}</div>
            </div>
            <div className="border rounded p-4">
              <div className="text-sm text-gray-400">New (7 days)</div>
              <div className="text-3xl font-semibold">{data.support.last7}</div>
            </div>
          </section>

          <section className="border rounded p-4 mb-8">
            <div className="font-medium mb-3">Latest Tickets</div>
            <ul className="divide-y">
              {data.support.latest.map(t => (
                <li key={t.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">
                        {t.email} • {t.category} • <span className="text-gray-400">{t.status}</span>
                      </div>
                      <div className="text-gray-300 text-sm line-clamp-1">{t.description}</div>
                    </div>
                    <div className="text-gray-400 text-sm">{fmt(t.created_at)}</div>
                  </div>
                </li>
              ))}
              {data.support.latest.length === 0 && (
                <li className="py-3 text-gray-400">No tickets yet.</li>
              )}
            </ul>
          </section>

          <section className="border rounded p-4">
            <div className="font-medium mb-2">Environment sanity</div>
            <ul className="text-sm text-gray-300">
              <li>RESEND_API_KEY: {data.env.RESEND_API_KEY ? "✅" : "❌"}</li>
              <li>SUPPORT_INBOX: {data.env.SUPPORT_INBOX ? "✅" : "❌"}</li>
              <li>APP_BASE_URL: {data.env.APP_BASE_URL ? "✅" : "❌"}</li>
            </ul>
            <div className="text-xs text-gray-500 mt-2">
              Updated: {fmt(data.updatedAt)}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
