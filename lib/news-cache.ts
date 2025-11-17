// lib/news-cache.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[news-cache] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set; news cache will be disabled.'
  );
}

const adminClient =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

export type CachedNewsStory = {
  id: string;
  story_date: string; // ISO date string (YYYY-MM-DD)
  source: string | null;
  title: string;
  url: string | null;
  summary: string;
};

export async function getNewsForDate(
  isoDate: string,
  limit = 5
): Promise<CachedNewsStory[]> {
  try {
    if (!adminClient) return [];

    const { data, error } = await adminClient
      .from('news_cache')
      .select('id, story_date, source, title, url, summary')
      .eq('story_date', isoDate)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[news-cache] Supabase error', error);
      return [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data as CachedNewsStory[];
  } catch (err) {
    console.error('[news-cache] Unexpected error', err);
    return [];
  }
}
