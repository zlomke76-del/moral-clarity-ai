/* ===============================
   Newsroom Cabinet — Types
   =============================== */

/* ---------- OVERVIEW (RANKING) ---------- */
export type OutletOverview = {
  canonical_outlet: string;

  avg_pi: number;
  avg_bias_intent: number;

  bias_language: number | null;
  bias_source: number | null;
  bias_framing: number | null;
  bias_context: number | null;

  total_stories: number;
  days_active?: number | null;
  last_story_day?: string | null;
};

/* ---------- DETAIL (AUTHORITATIVE / LIFETIME) ---------- */
export type OutletDetailData = {
  canonical_outlet: string;
  display_name: string;

  storiesAnalyzed: number;

  /* Lifetime / authoritative — may be NULL */
  lifetimePi: number | null;
  lifetimeBiasIntent: number | null;
  lifetimeLanguage: number | null;
  lifetimeSource: number | null;
  lifetimeFraming: number | null;
  lifetimeContext: number | null;

  lastScoredAt: string | null;
  ninetyDaySummary: string;
};

/* ---------- TRENDS ---------- */
export type OutletTrendPoint = {
  day: string;
  avg_pi: number;
};
