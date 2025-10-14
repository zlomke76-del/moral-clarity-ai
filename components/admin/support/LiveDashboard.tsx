"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Stats = {
  open_count: number;
  closed_count: number;
  high_open: number;
  medium_open: number;
  low_open: number;
  avg_first_reply_seconds: number | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function secondsToHMS(s?: number | null) {
  if (!s && s !== 0) return "—";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const x = Math.floor(s % 60);
  return `${h}h ${m}m ${x}s`;
}

export default function LiveDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/support/stats");
    const data = await res.json();
    setStats(data);
    setLoading(false);
  }

  useEffect(() => {
    load();

    // Realtime: refresh metrics whenever support_requests change
    const channel = supabase
      .channel("sr_live")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "support_requests" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card label="Open" value={stats?.open_count} loading={loading} />
      <Card label="Closed" value={stats?.closed_count} loading={loading} />
      <Card label="High (open)" value={stats?.high_open} loading={loading} />
      <Card label="Med (open)" value={stats?.medium_open} loading={loading} />
      <Card label="Avg First Reply" value={secondsToHMS(stats?.avg_first_reply_seconds)} loading={loading} />
    </section>
  );
}

function Card({ label, value, loading }:{ label:string; value:any; loading:boolean }) {
  return (
    <div className="rounded-2xl border border-neutral-800 p-4 bg-neutral-950">
      <div className="text-neutral-400 text-sm">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{loading ? "…" : value ?? "—"}</div>
    </div>
  );
}
