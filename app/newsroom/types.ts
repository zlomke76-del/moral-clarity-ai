/* ============================================================
   NEWSROOM — CANONICAL TYPES
   ============================================================ */

/* ================= OUTLET OVERVIEW (CABINET / LEADERBOARD) ================= */

export type OutletOverview = {
  /** Canonical outlet domain */
  canonical_outlet: string;

  /** Total stories scored (lifetime) */
  total_stories: number;

  /** Predictability Index (0–1, lifetime weighted) */
  avg_pi: number;
};

/* ================= NEWS DIGEST STORY (ANCHOR PANEL) ================= */

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

  /** URLs (both are intentionally supported) */
  story_url?: string;
  url?: string;

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
