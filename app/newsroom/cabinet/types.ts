// app/newsroom/cabinet/types.ts

/**
 * AUTHORITATIVE CABINET TYPE
 * Source: outlet_bias_pi_overview (Supabase view)
 *
 * Lifetime aggregates only.
 * No trends. No temporal inference.
 * No derived UI math that Supabase already computed.
 */
export type OutletOverview = {
  canonical_outlet: string;

  // Lifetime counts
  total_stories: number;
  days_active: number;
  last_story_day: string | null;

  // Predictability Index (0–1, lifetime)
  avg_pi: number;

  // Bias components (0–3, lifetime directional magnitude)
  avg_bias_intent: number;
  bias_language: number;
  bias_source: number;
  bias_framing: number;
  bias_context: number;
};
