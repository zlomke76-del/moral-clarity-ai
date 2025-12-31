"use client";

import type { OutletStats } from "../types";

type Props = {
  outlet: OutletStats | null;
};

export default function ScoreBreakdown({ outlet }: Props) {
  if (!outlet) return <div>No outlet selected.</div>;

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold mb-2">
        Score Breakdown: {outlet.canonical_domain}
      </h3>
      <ul>
        <li>Total stories: {outlet.total_stories}</li>
        <li>Days active: {outlet.days_active}</li>
        <li>Last story day: {outlet.last_story_day ?? "N/A"}</li>
        <li>PI Weighted: {outlet.avg_pi_weighted ?? "N/A"}</li>
        <li>Bias Intent: {outlet.avg_bias_intent_weighted ?? "N/A"}</li>
        <li>Bias Language: {outlet.avg_bias_language_weighted ?? "N/A"}</li>
        <li>Bias Source: {outlet.avg_bias_source_weighted ?? "N/A"}</li>
        <li>Bias Framing: {outlet.avg_bias_framing_weighted ?? "N/A"}</li>
        <li>Bias Context: {outlet.avg_bias_context_weighted ?? "N/A"}</li>
      </ul>
    </section>
  );
}
