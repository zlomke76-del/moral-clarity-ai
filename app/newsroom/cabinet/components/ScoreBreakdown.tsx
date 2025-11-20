// app/newsroom/cabinet/components/ScoreBreakdown.tsx
"use client";

interface LatestScores {
  bias_language_score: number;
  bias_source_score: number;
  bias_framing_score: number;
  bias_context_score: number;
}

interface OutletWithLatest {
  outlet: string;
  latest?: LatestScores | null;
}

interface ScoreBreakdownProps {
  outlet: OutletWithLatest;
}

export default function ScoreBreakdown({ outlet }: ScoreBreakdownProps) {
  const last = outlet.latest || null;

  if (!last) {
    return (
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
        <h3 className="text-lg font-semibold mb-2">
          Latest Scoring Breakdown — {outlet.outlet}
        </h3>
        <p className="text-neutral-400 text-sm">
          No detailed bias-component scores are available yet for this outlet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-semibold mb-4">
        Latest Scoring Breakdown — {outlet.outlet}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ScoreItem label="Language" value={last.bias_language_score} />
        <ScoreItem label="Source" value={last.bias_source_score} />
        <ScoreItem label="Framing" value={last.bias_framing_score} />
        <ScoreItem label="Context" value={last.bias_context_score} />
      </div>

      <p className="mt-4 text-xs text-neutral-500 max-w-xl">
        Each component is scored from 0.0 (no detectable bias) to 3.0 (strong
        bias). These feed the outlet’s overall Bias Intent and Predictability
        Index scores you see in the leaderboard and trend views.
      </p>
    </div>
  );
}

interface ScoreItemProps {
  label: string;
  value: number;
}

function ScoreItem({ label, value }: ScoreItemProps) {
  const v = Number.isFinite(value) ? value : 0;

  const colorClass =
    v < 1 ? "text-emerald-400"
    : v < 2 ? "text-amber-400"
    : "text-red-400";

  return (
    <div>
      <div className={`text-3xl font-bold ${colorClass}`}>
        {v.toFixed(2)}
      </div>
      <div className="text-neutral-400 text-sm">{label}</div>
    </div>
  );
}
