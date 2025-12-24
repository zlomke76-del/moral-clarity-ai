// app/newsroom/types.ts

/* ============================================================
   NEWSROOM — SHARED TYPES
   Single source of truth for Newsroom UI contracts
   ============================================================ */

/* =========================
   Outlet Overview (Cabinet)
   ========================= */

export type OutletOverview = {
  canonical_outlet: string;
  total_stories: number;
  avg_pi: number; // 0–1
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

  /** Key factual bullets */
  key_facts?: string[];

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
