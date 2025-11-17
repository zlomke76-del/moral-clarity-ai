/* app/api/news/refresh/route.ts */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient, type PostgrestError } from '@supabase/supabase-js';
import { webSearch } from '@/lib/search';

/**
 * This route:
 * - Pulls fresh news via Tavily (webSearch)
 * - Normalizes into "truth_facts" rows (Neutral News Protocol v1.0)
 * - Logs basic stats in the JSON response
 *
 * It is designed to be called by:
 * - A cron / scheduled job (recommended)
 * - Or manually from the UI / tools
 */

/* ========= ENV / SUPABASE INIT ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // NOTE: Next.js will tree-shake this in some contexts, but keeping it explicit.
  console.warn(
    '[news/refresh] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing – route will return 500 at runtime.'
  );
}

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

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

// We’ll keep this small to stay under Tavily’s free tier.
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

/**
 * Given a Tavily-style item, build a truth_facts row.
 * We treat each story as a "research_snapshot" in a domain "news".
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
    raw_snapshot: clampSummary(content || '', 4000),

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
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
    { fetched: number; inserted: number; failed: number }
  > = {} as any;

  for (const category of NEWS_CATEGORIES) {
    perCategoryStats[category] = { fetched: 0, inserted: 0, failed: 0 };

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
        perCategoryStats[category].failed++;
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

      try {
        /**
         * We intentionally keep this simple:
         * - If you later add a UNIQUE index on (raw_url) you can switch to .upsert with onConflict: 'raw_url'.
         * - For now, plain insert is fine and avoids PostgREST error-code gymnastics.
         */
        const { error: insertErr } = await supabaseAdmin
          .from('truth_facts')
          .insert(factRow);

        if (insertErr) {
          // We no longer inspect insertErr.code to dodge the TS "never" problem.
          console.error('[news/refresh] insert error', {
            category,
            url,
            message: (insertErr as PostgrestError).message,
            code: (insertErr as PostgrestError).code,
          });
          perCategoryStats[category].failed++;
        } else {
          perCategoryStats[category].inserted++;
        }
      } catch (err) {
        console.error('[news/refresh] unexpected insert error', category, url, err);
        perCategoryStats[category].failed++;
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
        `${normalizeCategoryName(cat as NewsCategory)}: fetched ${s.fetched}, inserted ${s.inserted}, failed ${s.failed}`
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
