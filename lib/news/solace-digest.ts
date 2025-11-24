// lib/news/solace-digest.ts
// Neutral News Digest loader (view-based)
// Source: solace_news_digest_view

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Core shape used everywhere else (chat route, ledgers, etc.)
export type SolaceDigestStory = {
  ledger_id: string;
  truth_fact_id: string | null;

  // Canonical fields Solace uses
  title: string;
  url: string;
  outlet: string | null;
  outlet_group?: string | null; // not present in the view today, kept for forward compatibility
  neutral_summary: string | null;
  key_facts: string[];

  // Bias / neutrality metrics
  bias_language_score: number | null;
  bias_source_score: number | null;
  bias_framing_score: number | null;
  bias_context_score: number | null;
  bias_intent_score: number | null;
  pi_score: number | null;

  // Timestamps / day bucketing
  created_at: string | null;
  day: string | null;
  day_iso: string | null;
};

function createSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

function normalizeKeyFacts(raw: any): string[] {
  if (!raw) return [];
  // Most likely JSON-encoded array string from the view
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((x) => String(x));
      }
    } catch {
      // Not JSON? Fall through and try a simple split.
      const parts = raw.split(/[;\n]+/).map((s) => s.trim());
      return parts.filter(Boolean);
    }
  }
  if (Array.isArray(raw)) {
    return raw.map((x) => String(x));
  }
  return [];
}

function mapRowToStory(row: any): SolaceDigestStory {
  return {
    ledger_id: String(row.ledger_id),
    truth_fact_id: row.truth_fact_id ? String(row.truth_fact_id) : null,

    title: row.story_title ?? '',
    url: row.story_url ?? '',
    outlet: row.outlet ?? null,
    // The current view doesn’t expose outlet_group; keep the field nullable
    outlet_group: row.outlet_group ?? null,

    neutral_summary: row.neutral_summary ?? null,
    key_facts: normalizeKeyFacts(row.key_facts),

    bias_language_score:
      typeof row.bias_language_score === 'number' ? row.bias_language_score : null,
    bias_source_score:
      typeof row.bias_source_score === 'number' ? row.bias_source_score : null,
    bias_framing_score:
      typeof row.bias_framing_score === 'number' ? row.bias_framing_score : null,
    bias_context_score:
      typeof row.bias_context_score === 'number' ? row.bias_context_score : null,
    bias_intent_score:
      typeof row.bias_intent_score === 'number' ? row.bias_intent_score : null,
    pi_score: typeof row.pi_score === 'number' ? row.pi_score : null,

    created_at: row.created_at ?? null,
    day: row.day ?? null,
    day_iso: row.day_iso ?? null,
  };
}

/**
 * Fetch the current Neutral News Digest from the consolidated view.
 *
 * This function is intentionally defensive:
 * - Returns [] if Supabase is not configured.
 * - Returns [] on any query error, logging to console but not throwing.
 *
 * The chat route and ledgers treat this as the single source of truth
 * for neutral news stories.
 */
export async function getSolaceNewsDigest(
  limit: number = 50
): Promise<SolaceDigestStory[]> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.error(
      '[solace-digest] Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing)'
    );
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('solace_news_digest_view')
      .select(
        `
        ledger_id,
        truth_fact_id,
        story_title,
        story_url,
        outlet,
        neutral_summary,
        key_facts,
        bias_language_score,
        bias_source_score,
        bias_framing_score,
        bias_context_score,
        bias_intent_score,
        pi_score,
        created_at,
        day,
        day_iso
      `
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[solace-digest] select from solace_news_digest_view failed', error);
      return [];
    }

    if (!data || !data.length) return [];

    return data.map(mapRowToStory);
  } catch (err) {
    console.error('[solace-digest] unexpected error', err);
    return [];
  }
}

