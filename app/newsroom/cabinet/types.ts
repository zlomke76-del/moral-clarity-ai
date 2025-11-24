// app/newsroom/cabinet/types.ts

// Overview row used by the Neutrality Cabinet leaderboard
export interface OutletOverview {
  outlet: string;
  canonical_outlet: string;

  total_stories: number;
  days_active: number;

  avg_bias_intent: number;
  avg_pi: number;

  bias_language: number;
  bias_source: number;
  bias_framing: number;
  bias_context: number;

  last_story_day: string | null; // ADD THIS
  first_scored_date?: string | null; // Optional, if you plan to calculate it later
  most_recent_date?: string | null; // Optional, if you plan to calculate it later
}


// Time-series point for the outlet trend chart
export interface OutletTrendPoint {
  story_day: string;          // e.g. "2025-11-23"
  outlet_story_count: number; // how many stories that day
  avg_pi_score: number;       // 0.0–1.0 for that day
  avg_bias_intent: number;    // 0–3 for that day
}

// Shape passed into the OutletDetailModal
export interface OutletDetailData {
  canonical_outlet: string;
  display_name: string;

  storiesAnalyzed: number;

  // Lifetime aggregates
  lifetimePi: number;          // 0.0–100.0 (already multiplied in the page)
  lifetimeBiasIntent: number;  // 0–3
  lifetimeLanguage: number;    // 0–3
  lifetimeSource: number;      // 0–3
  lifetimeFraming: number;     // 0–3
  lifetimeContext: number;     // 0–3

  lastScoredAt: string;        // usually most_recent_date or "Unknown"

  // Short plain-language summary for the 90-day trend strip
  ninetyDaySummary: string;
}
