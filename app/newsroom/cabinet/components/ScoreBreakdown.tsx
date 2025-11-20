// app/newsroom/cabinet/components/ScoreBreakdown.tsx
"use client";

import type { OutletOverview } from "../types";

type Props = {
  outlet: OutletOverview | null;
};

function describePi(pi: number): string {
  if (pi >= 0.95) return "exceptionally stable and neutral";
  if (pi >= 0.9) return "very stable and neutral";
  if (pi >= 0.8) return "generally balanced with mild bias patterns";
  if (pi >= 0.7) return "mixed, with noticeable bias in some stories";
  return "heavily tilted in tone or context";
}

export default function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
        Select an outlet from the leaderboard to see its detailed score.
      </div>
    );
  }

  const pi = outlet.avg_pi;
  const bias = outlet.avg_bias_intent;
  const piLabel = describePi(pi);

  const parts = [
    {
      key: "Language",
      value: outlet.bias_language,
      help: "How emotionally charged the wording tends to be.",
    },
    {
      key: "Source",
      value: outlet.bias_source,
      help: "How diverse and credible the quoted sources are.",
    },
    {
      key: "Framing",
      value: outlet.bias_framing,
      help: "How the story positions sides, heroes, and villains.",
    },
    {
      key: "Context",
      value: outlet.bias_context,
      help: "How much important background is included vs missing.",
    },
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-4">
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">
            {outlet.canonical_outlet} — Score Breakdown
          </h2>
          <p className="text-xs text-neutral-400">
            {outlet.total_stories} stories across {outlet.days_active} days of
            coverage.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wide text-neutral-400">
            Predictability Index
          </div>
          <div className="flex items-baseline justify-end gap-1">
            <span className="font-mono text-lg text-emerald-300">
              {pi.toFixed(3)}
            </span>
            <span className="text-[11px] text-neutral-500">/ 1.000</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">{piLabel}</div>
        </div>
      </header>

      {/* Bias intent bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>Bias intent (0–3)</span>
          <span className="font-mono text-neutral-200">{bias.toFixed(3)}</span>
        </div>
        <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500"
            style={{
              width: `${Math.max(0, Math.min(bias / 3, 1)) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-neutral-500">
          <span>0 = no visible bias</span>
          <span>3 = strong, consistent bias</span>
        </div>
      </div>

      {/* Component scores */}
      <div className="grid gap-3 sm:grid-cols-2">
        {parts.map((p) => (
          <div
            key={p.key}
            className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{p.key}</span>
              <span className="font-mono text-neutral-100">
                {p.value.toFixed(2)} / 3
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-400"
                style={{
                  width: `${Math.max(0, Math.min(p.value / 3, 1)) * 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-neutral-400">{p.help}</p>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-neutral-500">
        These scores do <span className="font-semibold">not</span> judge who is
        politically “right” or “wrong.” They measure how the story is delivered:
        wording, sources, framing, and context. The goal is simple:{" "}
        <span className="font-semibold">push every outlet toward 1.00 PI</span>{" "}
        by rewarding predictable, neutral storytelling.
      </p>
    </div>
  );
}
