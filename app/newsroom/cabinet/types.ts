/* =======================
   NEWSROOM — TYPE CONTRACTS
   ======================= */

/* ---------- Overview row (lifetime, weighted) ---------- */
export type OutletOverview = {
  canonical_outlet: string;

  /* corpus */
  total_stories: number;
  days_active?: number | null;
  last_story_day?: string | null;

  /* Predictability Index */
  avg_pi_weighted: number;

  /* Bias components (weighted, 0–3) */
  avg_bias_intent_weighted: number | null;
  avg_bias_language_weighted: number | null;
  avg_bias_source_weighted: number | null;
  avg_bias_framing_weighted: number | null;
  avg_bias_context_weighted: number | null;
};

/* ---------- Detail DTO (UI-facing, lifetime) ---------- */
export type OutletDetailData = {
  canonical_outlet: string;
  display_name: string;

  storiesAnalyzed: number;

  lifetimePi: number;
  lifetimeBiasIntent: number | null;
  lifetimeLanguage: number | null;
  lifetimeSource: number | null;
  lifetimeFraming: number | null;
  lifetimeContext: number | null;

  lastScoredAt?: string | null;
  ninetyDaySummary?: string;
};

/* ---------- Trend point (daily) ---------- */
export type OutletTrendPoint = {
  story_day: string;
  avg_pi_weighted: number;
};
