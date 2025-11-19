/* app/api/public/outlet-neutrality/route.ts */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[public/outlet-neutrality] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
  );
}

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

function jsonError(
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

type OutletRow = {
  outlet: string;
  story_count: number;
  avg_bias_intent_score: number;
  bias_intent_score_stddev: number | null;
  avg_pi_score: number;
  first_scored_at: string | null;
  last_scored_at: string | null;
};

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return jsonError(
        'Supabase admin client not configured on server.',
        500,
        { code: 'NO_SUPABASE_ADMIN' }
      );
    }

    const url = new URL(req.url);
    const minStoriesParam = url.searchParams.get('min_story_count');
    const limitParam = url.searchParams.get('limit');
    const sortParam = url.searchParams.get('sort'); // "stories" | "neutrality"

    const minStoryCount = minStoriesParam
      ? Math.max(1, Number(minStoriesParam) || 0)
      : 3; // default floor

    const limit = limitParam
      ? Math.max(1, Math.min(Number(limitParam) || 0, 200))
      : 100; // default cap

    const sort = sortParam === 'neutrality' ? 'neutrality' : 'stories';

    let query = supabaseAdmin
      .from<OutletRow>('outlet_neutrality_aggregates')
      .select(
        `
        outlet,
        story_count,
        avg_bias_intent_score,
        bias_intent_score_stddev,
        avg_pi_score,
        first_scored_at,
        last_scored_at
      `
      )
      .gte('story_count', minStoryCount);

    if (sort === 'neutrality') {
      query = query.order('avg_pi_score', { ascending: false });
    } else {
      query = query.order('story_count', { ascending: false });
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error('[public/outlet-neutrality] Supabase error', error);
      return jsonError(
        'Failed to load outlet neutrality aggregates.',
        500,
        { code: error.code, details: error.details }
      );
    }

    return NextResponse.json({
      ok: true,
      min_story_count: minStoryCount,
      sort,
      total: data?.length ?? 0,
      rows: data || [],
    });
  } catch (err: any) {
    console.error('[public/outlet-neutrality] fatal error', err);
    return jsonError(
      err?.message || 'Unexpected error loading outlet neutrality aggregates.',
      500,
      { code: 'OUTLET_NEUTRALITY_FATAL' }
    );
  }
}

export async function POST(req: NextRequest) {
  // read-only API – POST behaves like GET for now
  return GET(req);
}
