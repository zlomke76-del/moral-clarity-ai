// app/api/news/refresh/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { runNewsFetchRefresh } from '@/lib/news/fetcher';
import { buildNewsNeutralityLedger } from '@/lib/news/ledgerBuilder';

const NEWS_REFRESH_SECRET = process.env.NEWS_REFRESH_SECRET || '';

/* ================= CORS ================= */

function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  h.set('Access-Control-Max-Age', '86400');
  if (origin) h.set('Access-Control-Allow-Origin', origin);
  return h;
}

function pickOrigin(req: NextRequest): string | null {
  const origin = req.headers.get('origin');
  if (!origin) return null;

  try {
    const u = new URL(origin);
    if (
      u.hostname.endsWith('moralclarity.ai') ||
      u.hostname.endsWith('moralclarityai.com') ||
      u.hostname === 'localhost'
    ) {
      return origin;
    }
  } catch {
    // ignore
  }
  return null;
}

/* ================= HANDLER ================= */

async function handleRefresh(req: NextRequest) {
  const origin = pickOrigin(req);

  // ---- Shared secret gate ----
  if (NEWS_REFRESH_SECRET) {
    const url = new URL(req.url);
    const token =
      url.searchParams.get('secret') || req.headers.get('x-news-secret');

    if (token !== NEWS_REFRESH_SECRET) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401, headers: corsHeaders(origin) }
      );
    }
  }

  try {
    // ================= Phase 1: Fetch / Ingest =================
    console.log('[news/refresh] phase 1: fetch start');
    const fetchResult = await runNewsFetchRefresh();

    if (!fetchResult.ok) {
      throw new Error('[news/refresh] fetch failed');
    }

    if (fetchResult.totalInserted === 0) {
      throw new Error(
        '[news/refresh] fetch completed with ZERO inserts — aborting'
      );
    }

    console.log('[news/refresh] phase 1 complete', {
      totalInserted: fetchResult.totalInserted,
    });

    // ================= Phase 2: Ledger Build =================
    console.log('[news/refresh] phase 2: ledger build start');
    const ledgerResult = await buildNewsNeutralityLedger({ limit: 500 });

    if (!ledgerResult || ledgerResult.inserted === 0) {
      throw new Error(
        '[news/refresh] ledger build produced ZERO inserts — aborting'
      );
    }

    console.log('[news/refresh] phase 2 complete', {
      ledgerInserted: ledgerResult.inserted,
    });

    // ================= Success =================
    console.log('[news/refresh] completed successfully');

    return NextResponse.json(
      {
        ok: true,
        status: 'refresh_completed',
        fetchInserted: fetchResult.totalInserted,
        ledgerInserted: ledgerResult.inserted,
      },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    console.error('[news/refresh] FAILURE', err);

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || 'refresh_failed',
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

/* ================= METHODS ================= */

export async function POST(req: NextRequest) {
  return handleRefresh(req);
}

export async function GET(req: NextRequest) {
  return handleRefresh(req);
}

export async function OPTIONS(req: NextRequest) {
  const origin = pickOrigin(req);
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
