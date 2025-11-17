/* app/api/news/score-worker/route.ts */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type OpenAI from 'openai';
import { getOpenAI } from '@/lib/openai';

/* ========= ENV / SUPABASE INIT ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[news/score-worker] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing – route will return 500 at runtime.'
  );
}

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

/* ========= MODEL CONFIG ========= */

const SCORING_MODEL = process.env.OPENAI_SCORING_MODEL || 'gpt-4o';

/* ========= TYPES (LOOSE) ========= */

type TruthFactRow = {
  id: string;
  workspace_id: string | null;
  user_key: string | null;
  user_id: string | null;
  query: string | null;
  summary: string | null;
  scientific_domain: string | null;
  category: string | null;
  status: string | null;
  sources: any;
  raw_url: string | null;
  raw_snapshot: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type ScoringResult = {
  neutral_summary: string;
  bias_language_score: number;
  bias_source_score: number;
  bias_framing_score: number;
  bias_context_score: number;
  bias_intent_score: number;
  pi_score: number;
  notes: string;
};

/* ========= HELPERS ========= */

function jsonError(
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

function safeNumber(v: any, fallback: number, min: number, max: number): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function outletFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./i, '');
  } catch {
    return null;
  }
}

function clampText(text: string | null | undefined, max = 8000): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max) + '\n[...truncated for scoring...]';
}

/**
 * Compute bias_intent_score using the exact weights we defined:
 * - Language: 30%
 * - Source: 25%
 * - Framing: 25%
 * - Context: 20%
 */
function computeBiasIntentScore(parts: {
  language: number;
  source: number;
  framing: number;
  context: number;
}): number {
  const { language, source, framing, context } = parts;
  const raw =
    0.30 * language +
    0.25 * source +
    0.25 * framing +
    0.20 * context;

  // clamp & round to 3 decimals
  const clamped = Math.min(3, Math.max(0, raw));
  return Math.round(clamped * 1000) / 1000;
}

/* ========= OPENAI SCORING LOGIC ========= */

async function scoreNewsStory(fact: TruthFactRow): Promise<ScoringResult | null> {
  const openai: OpenAI = await getOpenAI();

  const title = fact.summary?.split('\n')[0] || '(untitled story)';
  const url = fact.raw_url || '';
  const outlet = outletFromUrl(url) || 'unknown-outlet';

  const body = clampText(fact.raw_snapshot || fact.summary || '', 6000);

  if (!body.trim()) {
    console.warn('[news/score-worker] Empty body for fact id', fact.id);
    return null;
  }

  const scoringInstruction = `
You are a neutral media analyst applying the Neutral News Protocol v1.0.

You will read a news story snapshot and return a JSON object with:
- a neutral, bias-minimized summary, and
- component bias intent scores from 0.0 to 3.0
- a Predictability Index pi_score from 0.0 to 1.0

Definitions (0 = no bias, 3 = strong bias):

1) bias_language_score (0–3)
   - Measures emotionally charged, loaded, or inflammatory language.
   - 0 = strictly neutral wording.
   - 1 = mild emotional shading.
   - 2 = clearly slanted or emotionally loaded.
   - 3 = heavily propagandistic or inflammatory language.

2) bias_source_score (0–3)
   - Measures how balanced and credible the sources appear.
   - 0 = multiple credible, diverse sources; clearly attributed.
   - 1 = mostly credible, mild skew or limited diversity.
   - 2 = few sources, one-sided, or questionable credibility.
   - 3 = no credible sources or extremely one-sided.

3) bias_framing_score (0–3)
   - Measures how the story frames events and actors (heroes/villains, good/evil).
   - 0 = balanced framing with multiple perspectives.
   - 1 = slight tilt in framing.
   - 2 = clearly one-sided framing.
   - 3 = overtly adversarial/cheerleading framing.

4) bias_context_score (0–3)
   - Measures omission or distortion of important context.
   - 0 = context is thorough and fair.
   - 1 = minor missing context.
   - 2 = important context is missing or downplayed.
   - 3 = critical context omitted or the story is highly misleading by omission.

You do NOT need to agree with the story. You are only measuring *intent and framing*,
not whether it is true or false.

Compute:
- bias_language_score
- bias_source_score
- bias_framing_score
- bias_context_score

Then compute bias_intent_score using this exact weighted formula:
  bias_intent_score =
    0.30 * bias_language_score +
    0.25 * bias_source_score +
    0.25 * bias_framing_score +
    0.20 * bias_context_score

Finally, choose:
- pi_score (0–1): how confident you are in your scoring (0.0 = very uncertain, 1.0 = very confident)

Return ONLY a JSON object with this structure:

{
  "neutral_summary": "200-300 word neutral summary with emotional language stripped out.",
  "bias_language_score": 0.0,
  "bias_source_score": 0.0,
  "bias_framing_score": 0.0,
  "bias_context_score": 0.0,
  "bias_intent_score": 0.0,
  "pi_score": 0.5,
  "notes": "One or two sentences explaining your scoring."
}

- neutral_summary MUST be ~200–300 words, concise, factual, and non-partisan.
- All scores must be numeric.
- Do not include any extra keys or commentary.
`.trim();

  const articleBlock = `
ARTICLE_TITLE: ${title}
OUTLET: ${outlet}
URL: ${url || '(none)'}

ARTICLE_BODY_SNAPSHOT:
"""
${body}
"""
`.trim();

  const resp = await openai.responses.create({
    model: SCORING_MODEL,
    input: scoringInstruction + '\n\n' + articleBlock,
    response_format: { type: 'json_object' },
    max_output_tokens: 800,
  });

  const raw = (resp as any).output_text;
  if (!raw || typeof raw !== 'string') {
    console.error('[news/score-worker] No output_text from model for fact id', fact.id);
    return null;
  }

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error('[news/score-worker] Failed to parse JSON for fact id', fact.id, raw);
    return null;
  }

  const bias_language_score = safeNumber(parsed.bias_language_score, 1.5, 0, 3);
  const bias_source_score = safeNumber(parsed.bias_source_score, 1.5, 0, 3);
  const bias_framing_score = safeNumber(parsed.bias_framing_score, 1.5, 0, 3);
  const bias_context_score = safeNumber(parsed.bias_context_score, 1.5, 0, 3);

  // We re-compute bias_intent_score ourselves to guarantee the exact formula.
  const bias_intent_score = computeBiasIntentScore({
    language: bias_language_score,
    source: bias_source_score,
    framing: bias_framing_score,
    context: bias_context_score,
  });

  const neutral_summary: string = String(parsed.neutral_summary || '').trim();
  const notes: string = String(parsed.notes || '').trim();
  const pi_score = safeNumber(parsed.pi_score, 0.5, 0, 1);

  if (!neutral_summary) {
    console.warn('[news/score-worker] Missing neutral_summary for fact id', fact.id);
  }

  return {
    neutral_summary,
    bias_language_score,
    bias_source_score,
    bias_framing_score,
    bias_context_score,
    bias_intent_score,
    pi_score,
    notes,
  };
}

/* ========= CORE WORKFLOW ========= */

/**
 * Fetch a batch of news truth_facts that do NOT yet have a neutrality_ledger row.
 * We keep this simple and defensively coded for our news volumes.
 */
async function fetchUnscoredTruthFacts(limit: number): Promise<TruthFactRow[]> {
  if (!supabaseAdmin) return [];

  // Step 1: grab a recent slice of news facts
  const { data: facts, error } = await supabaseAdmin
    .from('truth_facts')
    .select('*')
    .eq('scientific_domain', 'news')
    .order('created_at', { ascending: false })
    .limit(limit * 3); // oversample, we will skip ones already scored

  if (error) {
    console.error('[news/score-worker] Failed to fetch truth_facts', error);
    return [];
  }

  const result: TruthFactRow[] = [];
  for (const fact of facts as TruthFactRow[]) {
    if (!fact.id) continue;

    // Check if already scored in neutrality_ledger
    const { data: existing, error: existErr } = await supabaseAdmin
      .from('neutrality_ledger')
      .select('id')
      .eq('truth_fact_id', fact.id)
      .maybeSingle();

    if (existErr && existErr.code !== 'PGRST116') {
      console.error('[news/score-worker] neutrality_ledger check error', existErr);
      continue;
    }

    if (existing && existing.id) {
      // already scored
      continue;
    }

    result.push(fact);

    if (result.length >= limit) break;
  }

  return result;
}

async function scoreBatch(limit: number) {
  if (!supabaseAdmin) {
    throw new Error(
      'Supabase admin client not initialized – missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  const toScore = await fetchUnscoredTruthFacts(limit);
  if (!toScore.length) {
    return {
      totalCandidates: 0,
      scored: 0,
      skippedExisting: 0,
      errors: [] as string[],
      details: [] as any[],
    };
  }

  let scored = 0;
  let skippedExisting = 0;
  const errors: string[] = [];
  const details: any[] = [];

  for (const fact of toScore) {
    try {
      const scoring = await scoreNewsStory(fact);
      if (!scoring) {
        errors.push(`No scoring result for truth_fact_id=${fact.id}`);
        continue;
      }

      const outlet = outletFromUrl(fact.raw_url);
      const nowIso = new Date().toISOString();

      const rowToInsert: Record<string, any> = {
        workspace_id: fact.workspace_id || 'global_news',
        user_key: fact.user_key || 'system-news-anchor',
        user_id: fact.user_id || null,

        truth_fact_id: fact.id,
        story_id: fact.raw_url || fact.id,
        story_title: fact.summary || '(untitled story)',
        story_url: fact.raw_url,
        outlet: outlet,

        category: 'news', // you can later refine by decoding sources[0].category if desired

        raw_story: fact.raw_snapshot || fact.summary,
        neutral_summary: scoring.neutral_summary,
        notes: scoring.notes || null,

        pi_score: scoring.pi_score,

        bias_language_score: scoring.bias_language_score,
        bias_source_score: scoring.bias_source_score,
        bias_framing_score: scoring.bias_framing_score,
        bias_context_score: scoring.bias_context_score,
        bias_intent_score: scoring.bias_intent_score,

        created_at: nowIso,
        updated_at: nowIso,
      };

      const { error: insertErr } = await supabaseAdmin
        .from('neutrality_ledger')
        .insert(rowToInsert);

      if (insertErr) {
        console.error('[news/score-worker] insert error', {
          truth_fact_id: fact.id,
          message: insertErr.message,
          code: insertErr.code,
        });
        errors.push(
          `Insert error for truth_fact_id=${fact.id}: ${insertErr.code || ''} ${insertErr.message}`
        );
        continue;
      }

      scored++;
      details.push({
        truth_fact_id: fact.id,
        story_url: fact.raw_url,
        outlet,
        bias_intent_score: scoring.bias_intent_score,
        bias_language_score: scoring.bias_language_score,
        bias_source_score: scoring.bias_source_score,
        bias_framing_score: scoring.bias_framing_score,
        bias_context_score: scoring.bias_context_score,
        pi_score: scoring.pi_score,
      });
    } catch (err: any) {
      console.error('[news/score-worker] Fatal scoring error for fact', fact.id, err);
      errors.push(`Fatal scoring error for truth_fact_id=${fact.id}: ${err?.message || String(err)}`);
    }
  }

  return {
    totalCandidates: toScore.length,
    scored,
    skippedExisting,
    errors,
    details,
  };
}

/* ========= HANDLERS ========= */

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return jsonError(
        'Supabase admin client not configured on server (missing env).',
        500,
        { code: 'NO_SUPABASE_ADMIN' }
      );
    }

    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Math.max(1, Math.min(50, Number(limitParam) || 0)) : 20;

    const startedAt = new Date().toISOString();
    const result = await scoreBatch(limit);
    const finishedAt = new Date().toISOString();

    return NextResponse.json({
      ok: true,
      model: SCORING_MODEL,
      startedAt,
      finishedAt,
      limit,
      ...result,
    });
  } catch (err: any) {
    console.error('[news/score-worker] fatal error', err);
    return jsonError(
      err?.message || 'Unexpected error in news score worker.',
      500,
      { code: 'NEWS_SCORE_FATAL' }
    );
  }
}

export async function POST(req: NextRequest) {
  // Allow POST to trigger the same behavior (e.g., from a dashboard button).
  return GET(req);
}
