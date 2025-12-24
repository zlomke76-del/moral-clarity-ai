// app/newsroom/types.ts

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
