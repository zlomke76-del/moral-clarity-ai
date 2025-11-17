/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { webSearch } from '@/lib/search';
import { getOpenAI } from '@/lib/openai';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const NEWS_CRON_TOKEN = process.env.NEWS_CRON_TOKEN as string | undefined;

/* ========= Supabase admin client ========= */
function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase admin credentials not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

/* ========= Category queries (v1) ========= */

type CategoryConfig = {
  key: string;
  category: string;
  query: string;
  max: number;
};

const CATEGORY_QUERIES: CategoryConfig[] = [
  {
    key: 'us-top',
    category: 'us',
    query: 'top US news headlines today',
    max: 8,
  },
  {
    key: 'world',
    category: 'world',
    query: 'top world news headlines today',
    max: 8,
  },
  {
    key: 'politics',
    category: 'politics',
    query: 'top US politics news headlines today',
    max: 6,
  },
  {
    key: 'economy',
    category: 'economy',
    query: 'top business and economy news headlines today',
    max: 6,
  },
  {
    key: 'technology',
    category: 'technology',
    query: 'top technology and AI news headlines today',
    max: 6,
  },
  {
    key: 'health',
    category: 'health',
    query: 'top health and science news headlines today',
    max: 4,
  },
];

/* ========= Bias scoring & neutral summary via OpenAI ========= */

type BiasScoreResult = {
  neutral_summary: string;
  language_use: number;
  source_selection: number;
  framing: number;
  omission: number;
  bias_intent_score: number;
  bias_direction: string;
  pi_score: number;
  confidence_level: string;
};

async function scoreBiasAndSummarize(article: {
  title: string;
  content?: string | null;
  url: string;
  category: string;
}) {
  const openai = await getOpenAI();

  const systemPrompt = `
You are a strictly neutral news auditor.

TASK:
- Read the article details.
- Write a 200–300 word neutral, bias-minimized summary suitable for the general public.
- Then assign bias intent scores using this model:

  language_use: 0–3   (0 = neutral wording, 3 = highly emotive / loaded)
  source_selection: 0–3 (0 = diverse, credible sources; 3 = cherry-picked / opaque)
  framing: 0–3        (0 = balanced framing; 3 = clearly slanted toward one side)
  omission: 0–3       (0 = context is complete; 3 = key context is missing / distorted)

  bias_intent_score = weighted sum:
    0.30 * language_use
    + 0.25 * source_selection
    + 0.25 * framing
    + 0.20 * omission

  bias_direction: "neutral", "left", "right", "populist", "establishment", or "other".

  pi_score: Predictability Index (0.000–1.000). For news, usually 0.400–0.800.
  confidence_level: "low", "medium", or "high".

RULES:
- The summary must NOT speculate, editorialize, or infer motives.
- No emotional adjectives, no insults, no praise. Just facts and key context.
- If the article itself is extremely biased, you still write a neutral summary and reflect that bias only in the scores.

OUTPUT:
Return a single JSON object with keys:
  neutral_summary (string, 200–300 words),
  language_use (number),
  source_selection (number),
  framing (number),
  omission (number),
  bias_intent_score (number),
  bias_direction (string),
  pi_score (number),
  confidence_level (string).
`.trim();

  const userPrompt = `
ARTICLE:
Title: ${article.title}
URL: ${article.url}

Category: ${article.category}

Body (may be truncated or short):
${article.content || '[no body content available; use title and URL only]'}
`.trim();

  const resp = await openai.responses.create({
    model: MODEL,
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_output_tokens: 700,
    temperature: 0.1,
  } as any);

  const raw = (resp as any).output_text ?? '';
  let parsed: BiasScoreResult;

  try {
    parsed = JSON.parse(raw) as BiasScoreResult;
  } catch (e) {
    throw new Error(`Failed to parse bias JSON: ${String(e)} | raw=${raw.slice(0, 400)}`);
  }

  return parsed;
}

/* ========= Helper: normalize domain ========= */

function getDomain(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./i, '');
  } catch {
    return null;
  }
}

/* ========= MAIN GET (cron) ========= */

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!NEWS_CRON_TOKEN || token !== NEWS_CRON_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const now = new Date();

    // 1) Start a refresh run record
    const { data: runRow, error: runErr } = await supabase
      .from('news_refresh_runs')
      .insert({
        engine: 'tavily',
        run_label: 'auto-refresh',
        status: 'running',
        started_at: now.toISOString(),
      })
      .select()
      .single();

    if (runErr || !runRow) {
      throw new Error(`Failed to create news_refresh_runs row: ${runErr?.message}`);
    }

    const refreshRunId = runRow.id as string;

    let totalResults = 0;
    let totalNewStories = 0;
    let totalUpdatedStories = 0;

    // 2) For each category, pull news and process
    for (const cfg of CATEGORY_QUERIES) {
      const results = await webSearch(cfg.query, { news: true, max: cfg.max });
      if (!Array.isArray(results) || !results.length) continue;

      for (const item of results) {
        const url = item.url || '';
        const domain = getDomain(url);
        if (!url || !domain) continue;

        totalResults++;

        // 2a) Upsert outlet
        const { data: outlet, error: outletErr } = await supabase
          .from('news_outlets')
          .upsert(
            {
              domain,
              name: domain, // can be refined later
            },
            { onConflict: 'domain' }
          )
          .select()
          .single();

        if (outletErr || !outlet) {
          console.error('Failed to upsert news_outlets', outletErr);
          continue;
        }

        const outletId = outlet.id as string;

        // 2b) Upsert story
        const published_at = item.published_date
          ? new Date(item.published_date).toISOString()
          : null;

        const { data: story, error: storyErr } = await supabase
          .from('news_stories')
          .upsert(
            {
              outlet_id: outletId,
              source_url: url,
              source_domain: domain,
              title: item.title || '(untitled)',
              category: cfg.category,
              raw_text: item.content || null,
              published_at,
            },
            { onConflict: 'outlet_id,source_url' }
          )
          .select()
          .single();

        if (storyErr || !story) {
          console.error('Failed to upsert news_stories', storyErr);
          continue;
        }

        const storyId = story.id as string;

        if (storyErr?.code === 'PGRST116' /* duplicate */) {
          totalUpdatedStories++;
        } else {
          totalNewStories++;
        }

        // 2c) Score bias + produce neutral summary
        let bias: BiasScoreResult;
        try {
          bias = await scoreBiasAndSummarize({
            title: story.title,
            content: item.content,
            url,
            category: cfg.category,
          });
        } catch (e: any) {
          console.error('Bias scoring failed for story', storyId, e?.message || e);
          continue;
        }

        // clamp scores to [0, 3]
        const clamp = (x: number) => Math.max(0, Math.min(3, x));

        const language_use = clamp(bias.language_use);
        const source_selection = clamp(bias.source_selection);
        const framing = clamp(bias.framing);
        const omission = clamp(bias.omission);
        const bias_intent_score = Math.max(
          0,
          Math.min(
            3,
            bias.bias_intent_score ??
              0.3 * language_use +
                0.25 * source_selection +
                0.25 * framing +
                0.2 * omission
          )
        );

        // 2d) Insert story_bias_scores
        const { error: scoreErr } = await supabase.from('story_bias_scores').insert({
          story_id: storyId,
          outlet_id: outletId,
          bias_intent_score,
          language_use,
          source_selection,
          framing,
          omission,
          bias_direction: bias.bias_direction || 'neutral',
          pi_score: bias.pi_score ?? 0.5,
          confidence_level: bias.confidence_level || 'medium',
          scorer_type: 'system',
          scorer_version: 'nnp-v1.0',
        });

        if (scoreErr) {
          console.error('Failed to insert story_bias_scores', scoreErr);
        }

        // 2e) Mark older snapshots of this story+prompt as not current
        const defaultPromptKey = 'headline-today'; // v1: single key for "news today"

        await supabase
          .from('news_snapshots')
          .update({ is_current: false })
          .eq('story_id', storyId)
          .eq('prompt_fingerprint', defaultPromptKey)
          .eq('is_current', true);

        // 2f) Insert new neutral snapshot
        const { error: snapErr } = await supabase.from('news_snapshots').insert({
          story_id: storyId,
          refresh_run_id: refreshRunId,
          workspace_id: null,
          user_key: null,
          user_id: null,
          prompt_fingerprint: defaultPromptKey,
          neutral_summary: bias.neutral_summary,
          bias_intent_score,
          category: cfg.category,
          subcategory: null,
          pi_score: bias.pi_score ?? 0.5,
          confidence_level: bias.confidence_level || 'medium',
          source_urls: [url],
          sources: [
            {
              title: story.title,
              url,
              domain,
              category: cfg.category,
            },
          ],
          is_current: true,
        });

        if (snapErr) {
          console.error('Failed to insert news_snapshots', snapErr);
        }
      }
    }

    // 3) Finish refresh run row
    const finishedAt = new Date().toISOString();

    await supabase
      .from('news_refresh_runs')
      .update({
        status: 'success',
        finished_at: finishedAt,
        total_results,
        total_new_stories,
        total_updated_stories,
      })
      .eq('id', refreshRunId);

    // 4) Optionally kick outlet bias aggregation for *today*
    await supabase.rpc('refresh_outlet_bias_daily', {
      target_day: new Date().toISOString().slice(0, 10),
    });

    return NextResponse.json({
      ok: true,
      engine: 'tavily',
      total_results,
      total_new_stories,
      total_updated_stories,
      refresh_run_id: refreshRunId,
    });
  } catch (err: any) {
    console.error('news/refresh error', err);

    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
