"use client";

export default function ScoreBreakdown({ outlet }) {
  const last = outlet.latest;

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
    </div>
  );
}

function ScoreItem({ label, value }) {
  const color =
    value < 1 ? "text-green-400"
    : value < 2 ? "text-yellow-400"
    : "text-red-400";

  return (
    <div>
      <div className={`text-3xl font-bold ${color}`}>{value.toFixed(2)}</div>
      <div className="text-neutral-400 text-sm">{label}</div>
    </div>
  );
}
