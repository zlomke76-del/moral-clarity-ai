/* app/api/news/refresh/route.ts */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient, type PostgrestError } from '@supabase/supabase-js';
import type OpenAI from 'openai';

import { webSearch } from '@/lib/search';
import { getOpenAI } from '@/lib/openai';

/**
 * This route:
 * - Pulls fresh news via Tavily (webSearch)
 * - Normalizes into "truth_facts" rows (Neutral News Protocol v1.0)
 * - Scores each story for bias + neutrality into "news_neutrality_ledger"
 *
 * It is designed to be called by:
 * - A cron / scheduled job (recommended)
 * - Or manually from the UI / tools
 */

/* ========= ENV / SUPABASE / OPENAI INIT ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[news/refresh] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing – route will return 500 at runtime.'
  );
}

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const REQUEST_TIMEOUT_MS = 25_000;

/* ========= NEUTRAL NEWS CONFIG ========= */

type NewsCategory =
  | 'top'
  | 'politics'
  | 'economy'
  | 'world'
  | 'technology'
  | 'health'
  | 'culture'
  | 'science';

const NEWS_CATEGORIES: NewsCategory[] = [
  'top',
  'politics',
  'economy',
  'world',
  'technology',
  'health',
  'culture',
  'science',
];

const DEFAULT_WORKSPACE_ID = process.env.MCA_WORKSPACE_ID || 'global_news';
const DEFAULT_USER_KEY = 'system-news-anchor';

// Keep this modest to stay within Tavily + OpenAI budget.
const STORIES_PER_CATEGORY = 4;

// How far back we allow the news pull to look (in days)
const NEWS_WINDOW_DAYS = 1;

/* ========= HELPERS ========= */

function jsonError(
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

function normalizeCategoryName(cat: NewsCategory): string {
  switch (cat) {
    case 'top':
      return 'Top Stories';
    case 'economy':
      return 'Economy / Markets';
    case 'world':
      return 'World';
    case 'technology':
      return 'Technology';
    case 'health':
      return 'Health';
    case 'culture':
      return 'Culture';
    case 'science':
      return 'Science';
    case 'politics':
    default:
      return 'Politics';
  }
}

function clampSummary(text: string | undefined, max = 1200): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max) + '\n[...truncated for storage...]';
}

function clampLong(text: string | undefined, max = 4000): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max) + '\n[...truncated...]';
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('Request timed out')), ms);
    p.then((v) => {
      clearTimeout(id);
      resolve(v);
    }).catch((e) => {
      clearTimeout(id);
      reject(e);
    });
  });
}

function extractOutletFromUrl(url: string): string {
  if (!url) return 'unknown';
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    return host.startsWith('www.') ? host.slice(4) : host;
  } catch {
    return 'unknown';
  }
}

/**
 * Given a Tavily-style item, build a truth_facts row.
 * We treat each story as a "research_snapshot" in domain "news".
 */
function buildTruthFactRow(opts: {
  workspaceId: string;
  userKey: string;
  category: NewsCategory;
  query: string;
  title: string;
  url: string;
  content?: string;
}): Record<string, unknown> {
  const {
    workspaceId,
    userKey,
    category,
    query,
    title,
    url,
    content,
  } = opts;

  const summary = clampSummary(content || title);

  // We start news as "hypothesis" / "research_snapshot" until reconciled.
  return {
    workspace_id: workspaceId,
    user_key: userKey,
    user_id: null,
    query,
    summary,

    pi_score: 0.500,
    confidence_level: 'medium',

    scientific_domain: 'news',
    category: 'research_snapshot',
    status: 'hypothesis',

    sources: JSON.stringify([
      {
        kind: 'news',
        title,
        url,
        category,
        fetched_at: new Date().toISOString(),
      },
    ]),
    raw_url: url,
    raw_snapshot: clampLong(content || '', 4000),

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/* ========= BIAS SCORING MODEL ========= */

type BiasScoringResult = {
  neutral_summary: string;
  bias_language_score: number;
  bias_source_score: number;
  bias_framing_score: number;
  bias_context_score: number;
  notes?: string;
};

function sanitizeComponentScore(x: unknown): number {
  const n = typeof x === 'number' ? x : Number(x);
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 3) return 3;
  return Math.round(n * 1000) / 1000;
}

/**
 * Weighted bias intent score:
 *  - language: 30%
 *  - source selection: 25%
 *  - framing: 25%
 *  - context/omission: 20%
 *
 * Range: 0.000–3.000
 */
function computeBiasIntentScore(components: {
  language: number;
  source: number;
  framing: number;
  context: number;
}): number {
  const { language, source, framing, context } = components;
  const raw =
    0.3 * language +
    0.25 * source +
    0.25 * framing +
    0.2 * context;

  const clamped = Math.max(0, Math.min(3, raw));
  return Math.round(clamped * 1000) / 1000;
}

/**
 * Predictability Index (pi_score) for news items:
 *  - 1.000 = fully neutral, low editorial intent
 *  - 0.000 = highly biased / low predictability
 *
 * We derive it deterministically from bias_intent_score:
 *   pi = 1 - (bias_intent_score / 3)
 */
function computePiFromBiasIntent(biasIntent: number): number {
  const pi = 1 - biasIntent / 3;
  const clamped = Math.max(0, Math.min(1, pi));
  return Math.round(clamped * 1000) / 1000;
}

async function scoreStoryWithOpenAI(args: {
  title: string;
  url: string;
  category: NewsCategory;
  rawContent: string;
}): Promise<BiasScoringResult | null> {
  const { title, url, category, rawContent } = args;

  let openai: OpenAI;
  try {
    openai = await getOpenAI();
  } catch (err) {
    console.error('[news/refresh] OpenAI init failed', err);
    return null;
  }

  const clippedStory = clampLong(rawContent || title, 3500);

  const prompt = `
You are an impartial media analyst.

Your job is to:
1) Write a neutral, fact-focused summary of this news article in about 200–300 words.
2) Score its bias intent on four components, each from 0 to 3:
   - bias_language_score: emotionally charged or loaded language (0 = strictly factual, 3 = highly emotional / loaded).
   - bias_source_score: how selectively sources / quotes are chosen (0 = diverse and balanced, 3 = one-sided or anonymous/unclear sourcing).
   - bias_framing_score: framing of the issue or actors (0 = balanced framing, 3 = clearly slanted framing for or against a side).
   - bias_context_score: omission of important context or history (0 = contextually complete, 3 = key context clearly missing).

Guidelines:
- Focus on the article's text as written, not on your own opinion.
- Do not guess the "truth" of the story; only assess how it is told.
- Stay non-partisan and do not take a side.

Return ONLY a single JSON object with this exact shape and no extra keys:

{
  "neutral_summary": string,              // 200–300 words, neutral tone
  "bias_language_score": number,          // 0–3
  "bias_source_score": number,            // 0–3
  "bias_framing_score": number,           // 0–3
  "bias_context_score": number,           // 0–3
  "notes": string                         // brief optional notes on where bias shows up (may be empty)
}

If you are very uncertain about the article (e.g., content is extremely short), still return the JSON with conservative scores near 1 and explain uncertainty in "notes".
`;

  const input = `
METADATA
- Title: ${title}
- URL: ${url}
- Category: ${normalizeCategoryName(category)}

ARTICLE TEXT
"""${clippedStory}"""
`;

  try {
    const resp = await withTimeout(
      openai.responses.create({
        model: MODEL,
        input: `${prompt}\n\n${input}`,
        max_output_tokens: 900,
        temperature: 0,
      }),
      REQUEST_TIMEOUT_MS
    );

    const raw = (resp as any).output_text ?? '';
    const jsonStr = String(raw)
      .trim()
      .replace(/^```json/i, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (err) {
      console.error('[news/refresh] failed to parse scoring JSON', {
        raw: raw?.slice(0, 400),
        error: err,
      });
      return null;
    }

    const result: BiasScoringResult = {
      neutral_summary: String(parsed.neutral_summary || '').trim(),
      bias_language_score: sanitizeComponentScore(parsed.bias_language_score),
      bias_source_score: sanitizeComponentScore(parsed.bias_source_score),
      bias_framing_score: sanitizeComponentScore(parsed.bias_framing_score),
      bias_context_score: sanitizeComponentScore(parsed.bias_context_score),
      notes: parsed.notes ? String(parsed.notes) : '',
    };

    if (!result.neutral_summary) {
      console.warn('[news/refresh] scoring JSON missing neutral_summary; discarding');
      return null;
    }

    return result;
  } catch (err) {
    console.error('[news/refresh] OpenAI scoring failed', err);
    return null;
  }
}

/* ========= CORE REFRESH LOGIC ========= */

async function refreshAllCategories() {
  if (!supabaseAdmin) {
    throw new Error(
      'Supabase admin client not initialized – missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  const workspaceId = DEFAULT_WORKSPACE_ID;
  const userKey = DEFAULT_USER_KEY;

  const perCategoryStats: Record<
    NewsCategory,
    {
      fetched: number;
      inserted_facts: number;
      inserted_neutrality: number;
      failed_facts: number;
      failed_neutrality: number;
    }
  > = {} as any;

  for (const category of NEWS_CATEGORIES) {
    perCategoryStats[category] = {
      fetched: 0,
      inserted_facts: 0,
      inserted_neutrality: 0,
      failed_facts: 0,
      failed_neutrality: 0,
    };

    let query = '';
    switch (category) {
      case 'top':
        query = 'top news in the United States today';
        break;
      case 'politics':
        query = 'top U.S. political news today';
        break;
      case 'economy':
        query = 'top U.S. economy and markets news today';
        break;
      case 'world':
        query = 'top world news today';
        break;
      case 'technology':
        query = 'top technology news today';
        break;
      case 'health':
        query = 'top health and medical news today';
        break;
      case 'culture':
        query = 'top culture, arts, and entertainment news today';
        break;
      case 'science':
        query = 'top science and research news today';
        break;
    }

    let items: any[] = [];
    try {
      items = await webSearch(query, {
        news: true,
        max: STORIES_PER_CATEGORY,
        days: NEWS_WINDOW_DAYS,
      });
    } catch (err) {
      console.error('[news/refresh] webSearch failed for category', category, err);
      continue;
    }

    perCategoryStats[category].fetched = items.length;

    for (const item of items) {
      const title: string = item.title || '(untitled)';
      const url: string = item.url || '';
      const content: string | undefined = item.content;

      if (!url) {
        perCategoryStats[category].failed_facts++;
        perCategoryStats[category].failed_neutrality++;
        continue;
      }

      const factRow = buildTruthFactRow({
        workspaceId,
        userKey,
        category,
        query,
        title,
        url,
        content,
      });

      // 1) Insert into truth_facts
      let truthFactId: string | null = null;
      try {
        const { data, error: insertErr } = await supabaseAdmin
          .from('truth_facts')
          .insert(factRow)
          .select('id')
          .single();

        if (insertErr) {
          console.error('[news/refresh] truth_facts insert error', {
            category,
            url,
            message: (insertErr as PostgrestError).message,
            code: (insertErr as PostgrestError).code,
          });
          perCategoryStats[category].failed_facts++;
        } else {
          truthFactId = data?.id ?? null;
          perCategoryStats[category].inserted_facts++;
        }
      } catch (err) {
        console.error('[news/refresh] unexpected truth_facts insert error', category, url, err);
        perCategoryStats[category].failed_facts++;
      }

      // 2) Score bias + neutrality and insert into news_neutrality_ledger
      try {
        const scoring = await scoreStoryWithOpenAI({
          title,
          url,
          category,
          rawContent: content || title,
        });

        if (!scoring) {
          perCategoryStats[category].failed_neutrality++;
          continue;
        }

        const biasIntentScore = computeBiasIntentScore({
          language: scoring.bias_language_score,
          source: scoring.bias_source_score,
          framing: scoring.bias_framing_score,
          context: scoring.bias_context_score,
        });

        const piScore = computePiFromBiasIntent(biasIntentScore);

        const nowIso = new Date().toISOString();
        const storyId = url; // stable ID for joins/backfills
        const outlet = extractOutletFromUrl(url);

        const neutralityRow = {
          workspace_id: workspaceId,
          user_key: userKey,
          user_id: null,

          story_id: storyId,
          story_title: title,
          story_url: url,
          outlet,

          category: 'news_story',

          neutral_summary: clampSummary(scoring.neutral_summary, 2000),
          raw_story: clampLong(content || scoring.neutral_summary, 6000),

          bias_language_score: scoring.bias_language_score,
          bias_source_score: scoring.bias_source_score,
          bias_framing_score: scoring.bias_framing_score,
          bias_context_score: scoring.bias_context_score,
          bias_intent_score: biasIntentScore,

          pi_score: piScore,
          notes: scoring.notes || '',

          truth_fact_id: truthFactId,

          created_at: nowIso,
          updated_at: nowIso,
        };

        const { error: nErr } = await supabaseAdmin
          .from('news_neutrality_ledger')
          .insert(neutralityRow);

        if (nErr) {
          console.error('[news/refresh] news_neutrality_ledger insert error', {
            category,
            url,
            message: (nErr as PostgrestError).message,
            code: (nErr as PostgrestError).code,
          });
          perCategoryStats[category].failed_neutrality++;
        } else {
          perCategoryStats[category].inserted_neutrality++;
        }
      } catch (err) {
        console.error(
          '[news/refresh] unexpected neutrality_ledger insert error',
          category,
          url,
          err
        );
        perCategoryStats[category].failed_neutrality++;
      }
    }
  }

  return perCategoryStats;
}

/* ========= HANDLER ========= */

export async function GET(_req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return jsonError(
        'Supabase admin client not configured on server (missing env).',
        500,
        { code: 'NO_SUPABASE_ADMIN' }
      );
    }

    const startedAt = new Date().toISOString();
    const stats = await refreshAllCategories();
    const finishedAt = new Date().toISOString();

    const summary = Object.entries(stats).map(
      ([cat, s]) =>
        `${normalizeCategoryName(cat as NewsCategory)}: fetched ${s.fetched}, facts inserted ${s.inserted_facts}, neutrality rows ${s.inserted_neutrality}, fact failures ${s.failed_facts}, neutrality failures ${s.failed_neutrality}`
    );

    return NextResponse.json({
      ok: true,
      startedAt,
      finishedAt,
      stats,
      summary,
    });
  } catch (err: any) {
    console.error('[news/refresh] fatal error', err);
    return jsonError(
      err?.message || 'Unexpected error in news refresh.',
      500,
      { code: 'NEWS_REFRESH_FATAL' }
    );
  }
}

/**
 * Optional: allow POST to trigger the same behavior (e.g., from a dashboard button).
 */
export async function POST(req: NextRequest) {
  return GET(req);
}
