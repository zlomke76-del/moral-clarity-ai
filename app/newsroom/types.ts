// SUMMARY TYPE — LEADERBOARD ONLY
export type OutletOverview = {
  canonical_outlet: string;
  total_stories: number;
  avg_pi: number;
};

// FULL ANALYTICS — SCORE BREAKDOWN ONLY
export type OutletStats = {
  outlet: string;
  total_stories: number;
  days_active: number;
  last_story_day: string | null;

  avg_pi_weighted: number | null;

  avg_bias_intent_weighted: number | null;
  avg_bias_language_weighted: number | null;
  avg_bias_source_weighted: number | null;
  avg_bias_framing_weighted: number | null;
  avg_bias_context_weighted: number | null;
};
