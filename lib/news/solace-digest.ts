// lib/news/solace-digest.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string | undefined;
const SUPABASE_SERVICE_ROLE_KEY = process.env
  .SUPABASE_SERVICE_ROLE_KEY as string | undefined;

function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('[solace-digest] Supabase admin credentials not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

type SolaceDigestRow = {
  id: string;
  story_id: string | null;
  story_title: string | null;
  story_url: string | null;
  outlet: string | null;
  outlet_group: string | null;
  category: string | null;
  day_iso: string | null;

  neutral_summary: string | null;
  key_facts: unknown; // Supabase may send this as text / array
  context_background: string | null;
  stakeholder_positions: string | null;
  timeline: string | null;
  disputed_claims: string | null;
  omissions_detected: string | null;

  bias_language_score: number | null;
  bias_source_score: number | null;
  bias_framing_score: number | null;
  bias_context_score: number | null;
  bias_intent_score: number | null;
  pi_score: number | null;

  created_at: string | null;
  updated_at: string | null;
};

export type SolaceDigestStory = {
  id: string;
  truth_fact_id: string | null; // not in view, kept for downstream compatibility
  story_id: string | null;
  title: string;
  url: string | null;
  outlet: string | null;
  outlet_group: string | null;
  category: string | null;

  neutral_summary: string;
  key_facts: string[];
  context_background: string;
  stakeholder_positions: string;
  timeline: string;
  disputed_claims: string;
  omissions_detected: string;

  bias_language_score: number | null;
  bias_source_score: number | null;
  bias_framing_score: number | null;
  bias_context_score: number | null;
  bias_intent_score: number | null;
  pi_score: number | null;

  notes: string | null; // not in view, kept as null
  created_at: string | null;
};

function coerceArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? '')).filter((v) => v.length > 0);
  }
  try {
    const parsed = JSON.parse(String(value));
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v ?? '')).filter((v) => v.length > 0);
    }
  } catch {
    // ignore parse errors; fall through
  }
  return [String(value)];
}

function coerceNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

function mapRowToStory(row: SolaceDigestRow): SolaceDigestStory {
  return {
    id: row.id,
    truth_fact_id: null, // view doesn’t expose this; kept for compatibility
    story_id: row.story_id,
    title: (row.story_title || '').trim() || '(untitled story)',
    url: row.story_url,
    outlet: row.outlet,
    outlet_group: row.outlet_group,
    category: row.category,

    neutral_summary: (row.neutral_summary || '').trim(),
    key_facts: coerceArray(row.key_facts),
    context_background: (row.context_background || '').trim(),
    stakeholder_positions: (row.stakeholder_positions || '').trim(),
    timeline: (row.timeline || '').trim(),
    disputed_claims: (row.disputed_claims || '').trim(),
    omissions_detected: (row.omissions_detected || '').trim(),

    bias_language_score: coerceNumber(row.bias_language_score),
    bias_source_score: coerceNumber(row.bias_source_score),
    bias_framing_score: coerceNumber(row.bias_framing_score),
    bias_context_score: coerceNumber(row.bias_context_score),
    bias_intent_score: coerceNumber(row.bias_intent_score),
    pi_score: coerceNumber(row.pi_score),

    notes: null,
    created_at: row.created_at,
  };
}

export async function getSolaceNewsDigest(): Promise<SolaceDigestStory[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[solace-digest] Neutral News Digest requested but Supabase admin env is missing.');
    return [];
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      // KEY WIRE-UP: use the scored digest view
      .from('solace_news_digest_view')
      .select('*')
      .order('day_iso', { ascending: false })
      .order('pi_score', { ascending: false });

    if (error) {
      console.error('[solace-digest] solace_news_digest_view error', error);
      return [];
    }

    const rows = (data || []) as SolaceDigestRow[];
    return rows.map(mapRowToStory);
  } catch (err) {
    console.error('[solace-digest] getSolaceNewsDigest fatal', err);
    return [];
  }
}
