// app/newsroom/cabinet/types.ts

// Lifetime outlet aggregates (one row per outlet)
export type OutletOverview = {
  outlet: string;
  canonical_outlet: string;
  total_stories: number;
  days_active: number;
  avg_bias_intent: number;
  avg_pi: number;
  bias_language: number;
  bias_source: number;
  bias_framing: number;
  bias_context: number;
  last_story_day: string | null;
};

// Daily trend points for a single outlet
export type OutletTrendPoint = {
  story_day: string;
  outlet_story_count: number;
  avg_bias_intent: number;
  avg_pi_score: number;
  avg_bias_language: number;
  avg_bias_source: number;
  avg_bias_framing: number;
  avg_bias_context: number;
};

// Simple trend direction for 90-day view
export type TrendDirection = "up" | "down" | "flat";

// Detail data used by the outlet modal
export type OutletDetailData = {
  canonical_outlet: string;
  display_name: string;
  tierLabel: string;
  storiesAnalyzed: number;

  // Lifetime scores (0–1 PI, 0–3 bias)
  lifetimePi: number;
  lifetimeBiasIntent: number;
  lifetimeLanguage: number;
  lifetimeSource: number;
  lifetimeFraming: number;
  lifetimeContext: number;

  // Last scored date (ISO or display string)
  lastScoredAt: string | null;

  // Optional 90-day view (may be null until implemented)
  ninetyDayPi?: number | null;
  ninetyDayBiasIntent?: number | null;
  trendDirection?: TrendDirection;
};
