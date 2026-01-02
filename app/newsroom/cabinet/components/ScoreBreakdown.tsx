"use client";
import type { OutletStats } from "../types";

/* ============================================================
   CANONICAL: Outlet → Primary Domain
   ============================================================ */
const OutletDomainMap: Record<string, string> = {
  "Washington Post": "washingtonpost.com",
  "Mother Jones": "motherjones.com",
  PBS: "pbs.org",
  NPR: "npr.org",
  Reuters: "reuters.com",
  Politico: "politico.com",
  "The Hill": "thehill.com",
  "France 24": "france24.com",
  "AP News": "apnews.com",
  "The Guardian": "theguardian.com",
  CNN: "cnn.com",
  "USA Today": "usatoday.com",
  Bloomberg: "bloomberg.com",
  "Fox News": "foxnews.com",
  DW: "dw.com",
  RFERL: "rferl.org",
  Newsmax: "newsmax.com",
  "Washington Examiner": "washingtonexaminer.com",
  Time: "time.com",
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

/* ============================================================
   METRIC EXPLAINERS — CANON SAFE
   Descriptive only. No intent, morality, or credibility claims.
   ============================================================ */
const METRIC_EXPLAINERS: Record<string, string> = {
  avg_pi_weighted:
    "Predictability Index (PI): Measures how structurally consistent and forecastable this outlet’s coverage patterns are over time. Higher values indicate greater structural regularity.",

  avg_bias_intent_weighted:
    "Structural Directionality: Measures the persistence of directional patterns in coverage over time. This signal describes consistency of direction, not motive or intent.",

  avg_bias_language_weighted:
    "Linguistic Polarity Density: Measures the frequency of high-polarity language structures without evaluating meaning, correctness, or sentiment.",

  avg_bias_source_weighted:
    "Source Concentration Pattern: Measures recurrence and diversity patterns of cited sources based on presence only. No assessment of credibility or objectivity is performed.",

  avg_bias_framing_weighted:
    "Framing Persistence Signal: Measures repeated structural framing patterns across related coverage without evaluating viewpoint or correctness.",

  avg_bias_context_weighted:
    "Contextual Inclusion Variance: Measures variance in contextual elements included or omitted across comparable coverage. This signal describes structure, not omission intent.",
};

type Props = {
  outlet: OutletStats | null;
};

/* ============================================================
   ATOMIC STAT
   ============================================================ */
function StatItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      <span className="text-lg font-medium text-neutral-900">
        {value ?? "N/A"}
      </span>
    </div>
  );
}

/* ============================================================
   SCORE BREAKDOWN — CANON COMPLIANT
   ============================================================ */
function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-neutral-100 border border-gray-300 rounded-xl shadow-sm text-center text-gray-500">
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
      <div className="bg-neutral-100 border border-gray-300 rounded-xl shadow-sm p-8 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-gray-300 pb-4">
          <img
            src={logoUrl}
            alt={`${outlet.outlet} logo`}
            className="w-14 h-14 rounded border object-contain bg-white"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/default-favicon.png";
            }}
          />
          <div>
            <div className="text-sm uppercase tracking-wide text-neutral-500">
              Outlet Scorecard (Descriptive)
            </div>
            <div className="font-bold text-2xl text-neutral-900">
              {outlet.outlet}
            </div>
          </div>
        </div>

        {/* PRIMARY SIGNAL */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 space-y-2">
          <div className="text-sm uppercase tracking-wide text-blue-700">
            Predictability Index
          </div>
          <div className="text-4xl font-bold text-blue-900 font-mono">
            {outlet.avg_pi_weighted ?? "N/A"}
          </div>
          <div className="text-sm text-blue-800">
            {METRIC_EXPLAINERS.avg_pi_weighted}
          </div>
        </div>

        {/* OPERATIONAL CONTEXT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatItem label="Total stories" value={outlet.total_stories} />
          <StatItem label="Days active" value={outlet.days_active} />
          <StatItem
            label="Last story day"
            value={outlet.last_story_day ?? "N/A"}
          />
        </div>

        <hr className="border-gray-300" />

        {/* STRUCTURAL ASYMMETRY DIAGNOSTICS */}
        <div className="space-y-4">
          <div className="text-sm uppercase tracking-wide text-neutral-500">
            Structural Asymmetry Diagnostics
          </div>

          {[
            {
              label: "Structural Directionality",
              value: outlet.avg_bias_intent_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_intent_weighted,
            },
            {
              label: "Linguistic Polarity Density",
              value: outlet.avg_bias_language_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_language_weighted,
            },
            {
              label: "Source Concentration Pattern",
              value: outlet.avg_bias_source_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_source_weighted,
            },
            {
              label: "Framing Persistence Signal",
              value: outlet.avg_bias_framing_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_framing_weighted,
            },
            {
              label: "Contextual Inclusion Variance",
              value: outlet.avg_bias_context_weighted,
              explainer: METRIC_EXPLAINERS.avg_bias_context_weighted,
            },
          ].map(({ label, value, explainer }, i) => (
            <div
              key={label}
              className={`p-4 rounded-md border border-gray-200 ${
                i % 2 ? "bg-gray-50" : "bg-white"
              } space-y-1`}
            >
              <div className="font-medium text-neutral-800">{label}</div>
              <div className="text-lg font-mono text-neutral-900">
                {value ?? "N/A"}
              </div>
              <div className="text-xs text-neutral-500">{explainer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ScoreBreakdown;
