export type NewsDigestStory = {
  /** Stable identifier for UI selection */
  ledger_id: string;

  /** Story identifiers */
  story_id?: string;

  /** Outlet info */
  outlet: string;
  canonical_outlet?: string;

  /** Titles */
  story_title?: string;
  title?: string;

  /** URLs */
  story_url?: string;
  url?: string;

  /** Content */
  neutral_summary?: string;

  /** Classification */
  category?: string;

  /** Timing */
  published_at?: string;
  created_at?: string;

  /** Scoring */
  pi_score?: number | null;
  bias_intent_score?: number | null;

  /** Confidence */
  confidence_level?: string | null;
};
