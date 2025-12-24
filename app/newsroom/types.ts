// app/newsroom/types.ts

/* ============================================================
   OUTLET OVERVIEW (CABINET / LEADERBOARD)
   Source: /api/news/outlets/overview
   Backed by: outlet_canonical_overview (VIEW)
   ============================================================ */

export type OutletOverview = {
  /** Canonical outlet domain (collapsed, stable) */
  canonical_outlet: string;

  /** Lifetime story count */
  total_stories: number;

  /** Predictability Index (weighted, 0–1) */
  avg_pi: number;
};

/* ============================================================
   OUTLET STATS (DETAILED BREAKDOWN)
   Source: /api/news/outlets/stats
   Backed by: outlet_bias_pi_overview (VIEW)
   ============================================================ */

export type OutletStats = {
  outlet: string;
  canonical_outlet?: string;

  total_stories: number;
  days_active?: number;

  avg_pi_weighted?: number | null;

  avg_bias_intent_weighted?: number | null;
  avg_bias_language_weighted?: number | null;
  avg_bias_source_weighted?: number | null;
  avg_bias_framing_weighted?: number | null;
  avg_bias_context_weighted?: number | null;

  last_story_day?: string | null;
};

/* ============================================================
   NEWS DIGEST (ANCHOR / FEED)
   Source: /api/news/digest
   Backed by: news_neutrality_ledger / truth_facts
   ============================================================ */

export type NewsDigestStory = {
  /** Stable identifier for UI selection */
  ledger_id: string;

  /** Story identity */
  story_id?: string;
  outlet: string;
  canonical_outlet?: string;

  /** Content */
  title: string;
  url: string;
  category?: string;

  /** Timing */
  published_at?: string;
  created_at?: string;

  /** Scoring */
  pi_score?: number | null;
  bias_intent_score?: number | null;

  /** Confidence / metadata */
  confidence_level?: string | null;
};
