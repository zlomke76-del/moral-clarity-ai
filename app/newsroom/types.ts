// app/newsroom/types.ts

/* ============================================================
   NEWSROOM — SHARED TYPES
   Single source of truth for Newsroom UI contracts
   ============================================================ */

/* =========================
   Outlet Overview (Cabinet)
   ========================= */

export type OutletOverview = {
  /** Canonical outlet identifier (domain) */
  canonical_outlet: string;

  /** Total number of scored stories */
  total_stories: number;

  /** Weighted Predictability Index (0–1) */
  avg_pi: number;
};

/* =========================
   News Digest Story (Anchor)
   ========================= */

export type NewsDigestStory = {
  /** Stable ledger identifier */
  ledger_id: string;

  /** Story identity */
  story_id?: string;

  /** Outlet */
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

  /** Scoring */
  pi_score?: number | null;
  bias_intent_score?: number | null;

  /** Confidence */
  confidence_level?: string | null;

  /** Timing */
  published_at?: string;
  created_at?: string;
};
