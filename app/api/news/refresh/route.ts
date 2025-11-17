/* app/api/news/refresh/route.ts */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { runNewsFetchRefresh } from '@/lib/news/fetcher';

/* ========= HELPERS ========= */

function jsonError(
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/* ========= HANDLERS ========= */

/**
 * GET /api/news/refresh
 *
 * Responsibilities (Phase 1):
 * - Trigger a single fetch cycle using the Neutral News Fetcher Engine
 * - Insert raw snapshots into `truth_facts`
 * - Return per-domain stats and errors for observability
 *
 * It does NOT:
 * - Call OpenAI
 * - Score bias
 * - Write to news_neutrality_ledger
 *
 * Scoring and Neutral Brief generation are handled separately
 * by the score worker route.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const workspaceIdParam = url.searchParams.get('workspace_id') || undefined;
    const userKeyParam = url.searchParams.get('user_key') || undefined;

    const storiesTargetParam = url.searchParams.get('stories_target');
    const perDomainMaxParam = url.searchParams.get('per_domain_max');
    const newsWindowDaysParam = url.searchParams.get('days');

    const storiesTarget = storiesTargetParam
      ? Math.max(1, Math.min(Number(storiesTargetParam) || 0, 200))
      : undefined;

    const perDomainMax = perDomainMaxParam
      ? Math.max(1, Math.min(Number(perDomainMaxParam) || 0, 20))
      : undefined;

    const newsWindowDays = newsWindowDaysParam
      ? Math.max(1, Math.min(Number(newsWindowDaysParam) || 0, 7))
      : undefined;

    const startedAt = new Date().toISOString();

    const result = await runNewsFetchRefresh({
      workspaceId: workspaceIdParam,
      userKey: userKeyParam,
      storiesTarget,
      perDomainMax,
      newsWindowDays,
    });

    const finishedAt = new Date().toISOString();

    // Pass through engine stats, plus top-level timing for this route.
    return NextResponse.json({
      ok: true,
      route_started_at: startedAt,
      route_finished_at: finishedAt,
      ...result,
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
 * Optional: allow POST to trigger the same behavior
 * (e.g., from a dashboard button or admin tool).
 */
export async function POST(req: NextRequest) {
  return GET(req);
}
