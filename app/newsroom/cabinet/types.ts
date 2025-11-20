// app/newsroom/cabinet/types.ts

export type OutletOverview = {
  outlet: string;
  canonical_outlet: string;
  total_stories: number;
  days_active: number;
  avg_bias_intent: number; // 0–3  (lower = less bias)
  avg_pi: number;          // 0–1  (higher = more neutral)
  bias_language: number;
  bias_source: number;
  bias_framing: number;
  bias_context: number;
  last_story_day: string | null;
};

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
