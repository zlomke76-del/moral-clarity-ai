// app/newsroom/types.ts

// Top-level newsroom tab identifiers used by the NewsroomPage and Tabs.
export type NewsroomTab = "anchor" | "analyst" | "coach";

/**
 * Shape of a single neutral digest story as returned from
 * /api/public/news-digest (or your Solace news wrapper).
 *
 * You can expand this later to match your actual API response.
 */
export interface NewsDigestStory {
  ledger_id: string;
  truth_fact_id: string | null;
  story_id: string | null;
  story_title: string;
  story_url: string | null;
  outlet: string | null;
  category: string | null;

  neutral_summary: string | null;
  key_facts?: string | null;

  context_background?: string | null;
  stakeholder_positions?: string | null;
  timeline?: string | null;
  disputed_claims?: string | null;
  omissions_detected?: string | null;

  bias_language_score?: number | null;
  bias_source_score?: number | null;
  bias_framing_score?: number | null;
  bias_context_score?: number | null;
  bias_intent_score?: number | null;
  pi_score?: number | null;

  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Shape of a single outlet neutrality aggregate row,
 * compatible with /api/public/outlet-neutrality.
 */
export interface OutletNeutralityRow {
  outlet: string;
  outlet_normalized: string;
  total_stories: number;
  avg_bias_intent_score: number;
  avg_pi_score: number;
  min_bias_intent_score: number;
  max_bias_intent_score: number;
  first_seen_at: string | null;
  last_seen_at: string | null;
}

/**
 * Shape of a single outlet overview row as returned from
 * the `outlet_bias_pi_overview` database view.
 *
 * This is the authoritative contract for the Newsroom Cabinet.
 */
export interface OutletOverview {
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
}

/**
 * Generic shape for a Solace newsroom response, so you can
 * type Anchor / Analyst / Coach calls as you refine them.
 */
export interface SolaceNewsResponse {
  text?: string;
  digest?: string;
  critique?: string;
  rewrite?: string;
  bias_text?: string;
  bias_scores?: Record<string, number>;
}
