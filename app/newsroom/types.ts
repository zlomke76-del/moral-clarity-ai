export type NewsDigestStory = {
  /** Stable identifier for UI selection */
  ledger_id: string;

  /** Story identity */
  story_id?: string;

  /** Outlet */
  outlet: string;
  canonical_outlet?: string;

  /** Titles */
  story_title?: string;   // ← REQUIRED by AnchorPanel
  title?: string;         // ← allowed fallback if present

  /** URL */
  url: string;

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
