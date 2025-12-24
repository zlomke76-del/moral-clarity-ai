// app/newsroom/types.ts

/* ============================================================
   NEWS DIGEST (ANCHOR / FEED)
   Source: /api/news/digest
   ============================================================ */

export type NewsDigestStory = {
  id: string;

  outlet: string;
  canonical_outlet?: string;

  title: string;
  url: string;

  category?: string;
  published_at?: string;

  pi_score?: number | null;
  bias_intent_score?: number | null;

  confidence_level?: string | null;
};

/* ============================================================
   NEWSROOM — LEADERBOARD OVERVIEW
   Source: /api/news/outlets/overview
   ============================================================ */

export type OutletOverview = {
  canonical_outlet: string;
  total_stories: number;
  avg_pi: number;
};

/* ============================================================
   NEWSROOM — SCORE BREAKDOWN (DETAILED)
   Source: breakdown view / API
   ============================================================ */

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
