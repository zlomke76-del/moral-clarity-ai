// app/newsroom/cabinet/types.ts

export type OutletOverview = {
  canonical_outlet: string;
  avg_pi: number;
  avg_bias_intent: number;
  bias_language: number;
  bias_source: number;
  bias_framing: number;
  bias_context: number;
  total_stories: number;
  days_active: number;
  last_story_day: string | null;
};

export type OutletTrendPoint = {
  story_day: string;        // YYYY-MM-DD
  avg_pi_score: number;     // 0.0–1.0
};

export type TrendDirection = "up" | "down" | "flat";

export type OutletDetailData = {
  canonical_outlet: string;
  display_name: string;
  storiesAnalyzed: number;
  lifetimePi: number;           // 0–100 (we'll show with 1 decimal)
  lifetimeBiasIntent: number;   // 0–3
  lifetimeLanguage: number;     // 0–3
  lifetimeSource: number;       // 0–3
  lifetimeFraming: number;      // 0–3
  lifetimeContext: number;      // 0–3
  lastScoredAt: string;         // already formatted as YYYY-MM-DD
  ninetyDaySummary: string;
  trendDirection?: TrendDirection;
};
