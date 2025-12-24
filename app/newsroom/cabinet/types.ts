// app/newsroom/cabinet/types.ts

export type OutletOverview = {
  canonical_outlet: string;

  // ===== PRIMARY SCORE =====
  avg_pi: number; // 0–1

  // ===== BIAS AXES (0–3) =====
  avg_bias_intent: number;
  avg_bias_language: number;
  avg_bias_source: number;
  avg_bias_framing: number;
  avg_bias_context: number;

  // ===== META =====
  total_stories: number;
  days_active: number;
  last_story_day: string | null;
};
