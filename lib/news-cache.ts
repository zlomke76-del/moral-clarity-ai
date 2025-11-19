// lib/news-cache.ts

import { createClient, type PostgrestError } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string | undefined;
const SUPABASE_SERVICE_ROLE_KEY = process.env
  .SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[news-cache] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing – news cache will always return [].'
  );
}

function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('[news-cache] Supabase admin credentials not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Shape returned to callers (e.g. /app/api/chat/route.ts)
 */
export type CachedNewsStory = {
  id: string;
  title: string;
  url: string | null;
  source: string | null;
  outlet: string | null;
  /** Human-readable summary derived from story_text */
  summary: string;
  story_date: string | null; // YYYY-MM-DD
  published_at: string | null;
  fetched_at: string | null;
};

type NewsCacheRow = {
  id: string;
  source: string | null;
  outlet: string | null;
  story_title: string | null;
  story_url: string | null;
  story_text: string | null;
  story_date: string | null;
  published_at: string | null;
  fetched_at: string | null;
  title: string | null;
  url: string | null;
};

/**
 * Small helper to turn a potentially long story_text into
 * a compact summary string safe for prompts.
 */
function buildSummary(text: string | null | undefined): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.length <= 600) return trimmed;
  return trimmed.slice(0, 600).trimEnd() + '…';
}

/**
 * Load cached news stories for a specific date (YYYY-MM-DD).
 *
 * This is used by /app/api/chat/route.ts to answer questions like
 * “what’s the news today?” without hitting Tavily every time.
 */
export async function getNewsForDate(
  isoDate: string,
  limit = 5
): Promise<CachedNewsStory[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  try {
    const supabase = createAdminClient();

    // story_date is a DATE column; isoDate is expected as YYYY-MM-DD
    let query = supabase
      .from('news_cache')
      .select<
        '*',
        NewsCacheRow
      >(
        'id, source, outlet, story_title, story_url, story_text, story_date, published_at, fetched_at, title, url'
      )
      .eq('story_date', isoDate)
      .order('published_at', { ascending: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      const e = error as PostgrestError;
      console.error('[news-cache] Supabase error', {
        code: e.code,
        message: e.message,
        details: e.details,
        hint: e.hint,
      });
      return [];
    }

    const rows = (data || []) as NewsCacheRow[];

    return rows.map((row) => {
      const title = (row.title || row.story_title || '').trim() || '(untitled story)';
      const url = row.url || row.story_url || null;

      return {
        id: row.id,
        title,
        url,
        source: row.source,
        outlet: row.outlet,
        summary: buildSummary(row.story_text),
        story_date: row.story_date,
        published_at: row.published_at,
        fetched_at: row.fetched_at,
      };
    });
  } catch (err) {
    console.error('[news-cache] fatal error', err);
    return [];
  }
}
