"use client";

import { useEffect, useState } from "react";
import { fetchBiasDashboard } from "@/lib/newsroom/bias-api";
import Leaderboard from "./components/Leaderboard";
import TrendChart from "./components/TrendChart";
import ScoreBreakdown from "./components/ScoreBreakdown";

export default function CabinetPage() {
  const [data, setData] = useState<any>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const d = await fetchBiasDashboard();
      setData(d);
    })();
  }, []);

  if (!data) {
    return <div className="text-neutral-400">Loading dashboard…</div>;
  }

  const selected = selectedOutlet
    ? data.outlets.find((o: any) => o.outlet === selectedOutlet)
    : null;

  return (
    <div className="flex flex-col gap-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Moral Clarity AI — Bias Cabinet
        </h1>
        <p className="text-neutral-400 mt-2 max-w-2xl">
          A real-time, outlet-level view of bias intent, predictability index, 
          and methodological transparency — designed to help elevate journalism 
          toward a PI of 1.0.
        </p>
      </header>

      <Leaderboard
        outlets={data.outlets}
        onSelect={setSelectedOutlet}
        selectedOutlet={selectedOutlet}
      />

      {selected ? (
        <div className="flex flex-col gap-10">
          <TrendChart outlet={selected} />
          <ScoreBreakdown outlet={selected} />
        </div>
      ) : (
        <div className="text-neutral-400">
          Select an outlet from the leaderboard to view detailed scoring.
        </div>
      )}
    </div>
  );
}
