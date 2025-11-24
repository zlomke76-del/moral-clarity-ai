// app/api/news/digest/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Shape of a row from solace_news_digest_view.
 * Keep this in sync with the view definition, but it's intentionally loose
 * so minor column additions won't break the build.
 */
type SolaceDigestRow = {
  id: string;
  outlet: string | null;
  outlet_group: string | null;
  title: string;
  neutral_summary: string | null;
  url: string | null;
  bias_intent_score: number | null;
  pi_score: number | null;
  captured_at: string | null;
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * GET /api/news/digest
 *
 * Returns the latest neutral-news stories from the solace_news_digest_view.
 * This is consumed by getSolaceNewsDigest() and then fed into Solace as NEWS CONTEXT.
 */
export async function GET(req: NextRequest) {
  // 🔒 Build-safe + env-safe guard
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      '[news/digest] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.'
    );

    // Return a harmless empty payload so the build and runtime don't explode
    return NextResponse.json(
      {
        ok: false,
        error: 'Supabase not configured for news digest',
        count: 0,
        stories: [] as SolaceDigestRow[],
      },
      { status: 200 }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { searchParams } = new URL(req.url);
  const limitParam = searchParams.get('limit');
  const limit = Math.min(Math.max(Number(limitParam) || 20, 1), 50);

  const { data, error } = await supabase
    .from<SolaceDigestRow>('solace_news_digest_view')
    .select('*')
    .order('captured_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[news/digest] Supabase error:', error.message);
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        count: 0,
        stories: [] as SolaceDigestRow[],
      },
      { status: 500 }
    );
  }

  const stories = data ?? [];

  return NextResponse.json(
    {
      ok: true,
      count: stories.length,
      stories,
    },
    { status: 200 }
  );
}
