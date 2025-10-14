"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function CategoryChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/support/stats/by-category");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60000); // refresh every 60 s
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-800 p-4 bg-neutral-950">
      <h2 className="text-lg font-semibold mb-2">Tickets by Category</h2>
      {loading ? (
        <div className="text-neutral-500 text-sm">Loading…</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="open_count" fill="#7aa2ff" />
            <Bar dataKey="closed_count" fill="#00c48c" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
