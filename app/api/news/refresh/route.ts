// app/api/news/refresh/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { runNewsFetchRefresh } from '@/lib/news/fetcher';
import { buildNewsNeutralityLedger } from '@/lib/news/ledgerBuilder';

const NEWS_REFRESH_SECRET = process.env.NEWS_REFRESH_SECRET || '';

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
  } catch {}
  return null;
}

async function handleRefresh(req: NextRequest) {
  const origin = pickOrigin(req);

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

  // 🔑 Fire-and-monitor (NOT fire-and-forget)
  Promise.resolve()
    .then(async () => {
      console.log('[news/refresh] phase 1: fetch start');
      const fetchResult = await runNewsFetchRefresh();

      if (!fetchResult.ok || fetchResult.totalInserted === 0) {
        throw new Error('fetch failed or produced zero inserts');
      }

      console.log('[news/refresh] phase 1 complete', fetchResult.totalInserted);

      console.log('[news/refresh] phase 2: ledger build start');
      const ledgerResult = await buildNewsNeutralityLedger({ limit: 500 });

      if (!ledgerResult || ledgerResult.inserted === 0) {
        throw new Error('ledger build failed or empty');
      }

      console.log('[news/refresh] completed successfully');
    })
    .catch((err) => {
      console.error('[news/refresh] async failure', err);
    });

  // ✅ Return immediately
  return NextResponse.json(
    { ok: true, status: 'refresh_started' },
    { status: 202, headers: corsHeaders(origin) }
  );
}

export async function GET(req: NextRequest) {
  return handleRefresh(req);
}

export async function POST(req: NextRequest) {
  return handleRefresh(req);
}

export async function OPTIONS(req: NextRequest) {
  const origin = pickOrigin(req);
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
