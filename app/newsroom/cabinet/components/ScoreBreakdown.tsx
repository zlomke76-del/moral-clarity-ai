"use client";
import type { OutletStats } from "../types";

// Canonical map for outlet → main domain
const OutletDomainMap: Record<string, string> = {
  "Washington Post": "washingtonpost.com",
  "Mother Jones": "motherjones.com",
  "PBS": "pbs.org",
  "NPR": "npr.org",
  "Reuters": "reuters.com",
  "Politico": "politico.com",
  "The Hill": "thehill.com",
  "France 24": "france24.com",
  "AP News": "apnews.com",
  "The Guardian": "theguardian.com",
  "CNN": "cnn.com",
  "USA Today": "usatoday.com",
  "Bloomberg": "bloomberg.com",
  "Fox News": "foxnews.com",
  "DW": "dw.com",
  "RFERL": "rferl.org",
  "Newsmax": "newsmax.com",
  "Washington Examiner": "washingtonexaminer.com",
  "Time": "time.com",
  // Extend as needed
};

function getDomainForOutlet(outlet: string): string {
  if (
    outlet &&
    outlet.includes(".") &&
    !outlet.includes(" ") &&
    !outlet.startsWith("http")
  ) {
    return outlet.trim().toLowerCase();
  }
  return OutletDomainMap[outlet.trim()] || "";
}

// Metric explanations
const METRIC_EXPLAINERS: Record<string, string> = {
  avg_pi_weighted: "Predictability Index (PI): Measures how consistent and forecastable this outlet’s coverage is over time. Higher is more predictable.",
  avg_bias_intent_weighted: "Bias Intent: Measures how purposeful the observed bias is.",
  avg_bias_language_weighted: "Bias Language: Detects use of strongly polarized language.",
  avg_bias_source_weighted: "Bias Source: Evaluates the credibility and objectivity of sources.",
  avg_bias_framing_weighted: "Bias Framing: Scores how coverage favors a particular perspective via framing.",
  avg_bias_context_weighted: "Bias Context: Measures omission or skew in context/presentation.",
};

type Props = {
  outlet: OutletStats | null;
};

// Stateless helper for main stats
function StatItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-gray-600">{label}</span>
      <span className="text-gray-900">{value ?? "N/A"}</span>
    </div>
  );
}

function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white border border-gray-200 rounded-xl shadow text-center text-gray-500">
        No outlet selected.
      </div>
    );
  }

  const domain = getDomainForOutlet(outlet.outlet);
  const logoUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=96`
    : "/default-favicon.png";

  return (
    <section className="max-w-2xl mx-auto my-10 px-2">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 flex flex-col gap-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-300 pb-4 mb-2">
          <img
            src={logoUrl}
            alt={`${outlet.outlet} logo`}
            className="w-14 h-14 rounded border object-contain bg-neutral-50"
            onError={e => {
              (e.currentTarget as HTMLImageElement).src = "/default-favicon.png";
            }}
          />
          <div>
            <div className="font-bold text-2xl">Score Breakdown</div>
            <div className="text-lg text-neutral-700">{outlet.outlet}</div>
          </div>
        </div>
        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
          <StatItem label="Total stories" value={outlet.total_stories} />
          <StatItem label="Days active" value={outlet.days_active} />
          <StatItem label="Last story day" value={outlet.last_story_day ?? "N/A"} />
        </div>
        <hr className="my-2 border-gray-200" />
        {/* Metrics */}
        <div className="space-y-4">
          {[
            {
              label: "PI Weighted",
              value: outlet.avg_pi_weighted,
              explainer: METRIC_EXPLAINERS.avg_pi_weighted,
            },
            {
              label: "Bias Intent",
              value: outlet.avg_bias_intent_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_intent_weighted,
            },
            {
              label: "Bias Language",
              value: outlet.avg_bias_language_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_language_weighted,
            },
            {
              label: "Bias Source",
              value: outlet.avg_bias_source_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_source_weighted,
            },
            {
              label: "Bias Framing",
              value: outlet.avg_bias_framing_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_framing_weighted,
            },
            {
              label: "Bias Context",
              value: outlet.avg_bias_context_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_context_weighted,
            },
          ].map(({ label, value, explainer }, i) => (
            <div
              key={label}
              className={`p-4 rounded-md ${i % 2 ? "bg-gray-50" : ""} flex flex-col space-y-1`}
            >
              <span className="font-semibold text-gray-800">{label}:</span>
              <span className="text-lg text-blue-900 font-mono">{value ?? "N/A"}</span>
              <span className="text-xs text-gray-500">{explainer}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ScoreBreakdown;
