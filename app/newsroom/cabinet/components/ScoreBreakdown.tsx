"use client";
import type { OutletStats } from "../types";

// You may wish to import an icon fallback or use initials instead if logo isn't found

type Props = {
  outlet: (OutletStats & { logoUrl?: string }) | null;
};

const METRIC_EXPLAINERS: Record<string, string> = {
  avg_pi_weighted: "Personal Influence (PI) score reflecting reach and predictive impact.",
  avg_bias_intent_weighted: "Measures intent behind bias: higher means more intentional slant.",
  avg_bias_language_weighted: "Assesses use of biased or loaded language.",
  avg_bias_source_weighted: "Evaluates how credible and unbiased the information sources are.",
  avg_bias_framing_weighted: "Scores how facts/events are framed to promote a narrative.",
  avg_bias_context_weighted: "Checks for selective or out-of-context reporting.",
};

export default function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) return <div>No outlet selected.</div>;

  // Fallback logo/icon/initial if not provided
  const logoUrl = outlet.logoUrl || (
    // Example fallback: get from Google (like cards) or use a placeholder
    typeof window !== "undefined"
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
          (outlet.domain || outlet.outlet).toLowerCase()
        )}&sz=64`
      : "/default-favicon.png"
  );

  // Optionally strip domain logic for display if needed, or pass canonical display name
  return (
    <section className="mt-8 p-4 border rounded-lg bg-white shadow-md max-w-xl mx-auto">
      <header className="flex items-center mb-5">
        <img
          src={logoUrl}
          alt={`${outlet.outlet} logo`}
          className="w-12 h-12 rounded mr-4 border object-contain bg-neutral-50"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/default-favicon.png"; }}
        />
        <h3 className="text-xl font-semibold leading-tight">
          <span className="block">Score Breakdown</span>
          <span className="block text-base text-neutral-600">{outlet.outlet}</span>
        </h3>
      </header>

      <ul className="space-y-3 text-base">
        <li>
          <strong>Total stories:</strong> {outlet.total_stories ?? "N/A"}
        </li>
        <li>
          <strong>Days active:</strong> {outlet.days_active ?? "N/A"}
        </li>
        <li>
          <strong>Last story day:</strong> {outlet.last_story_day ?? "N/A"}
        </li>
        <li>
          <strong>PI Weighted:</strong> <span>{outlet.avg_pi_weighted ?? "N/A"}</span>
          <div className="text-xs text-gray-500">{METRIC_EXPLAINERS.avg_pi_weighted}</div>
        </li>
        <li>
          <strong>Bias Intent:</strong> <span>{outlet.avg_bias_intent_weighted ?? "N/A"}</span>
          <div className="text-xs text-gray-500">{METRIC_EXPLAINERS.avg_bias_intent_weighted}</div>
        </li>
        <li>
          <strong>Bias Language:</strong> <span>{outlet.avg_bias_language_weighted ?? "N/A"}</span>
          <div className="text-xs text-gray-500">{METRIC_EXPLAINERS.avg_bias_language_weighted}</div>
        </li>
        <li>
          <strong>Bias Source:</strong> <span>{outlet.avg_bias_source_weighted ?? "N/A"}</span>
          <div className="text-xs text-gray-500">{METRIC_EXPLAINERS.avg_bias_source_weighted}</div>
        </li>
        <li>
          <strong>Bias Framing:</strong> <span>{outlet.avg_bias_framing_weighted ?? "N/A"}</span>
          <div className="text-xs text-gray-500">{METRIC_EXPLAINERS.avg_bias_framing_weighted}</div>
        </li>
        <li>
          <strong>Bias Context:</strong> <span>{outlet.avg_bias_context_weighted ?? "N/A"}</span>
          <div className="text-xs text-gray-500">{METRIC_EXPLAINERS.avg_bias_context_weighted}</div>
        </li>
      </ul>
    </section>
  );
}
