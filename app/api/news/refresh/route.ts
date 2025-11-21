// app/api/news/refresh/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { runNewsFetchRefresh } from '@/lib/news/fetcher';

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
    // Loosened a bit; this is an internal maintenance endpoint.
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

async function handleRefresh(req: NextRequest) {
  const origin = pickOrigin(req);

  // Optional: simple shared-secret gate
  if (NEWS_REFRESH_SECRET) {
    const url = new URL(req.url);
    const token = url.searchParams.get('secret') || req.headers.get('x-news-secret');
    if (token !== NEWS_REFRESH_SECRET) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401, headers: corsHeaders(origin) }
      );
    }
  }

  try {
    const result = await runNewsFetchRefresh();
    return NextResponse.json(result, { status: 200, headers: corsHeaders(origin) });
  } catch (err: any) {
    console.error('[news/refresh] fatal error', err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || String(err),
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

export async function POST(req: NextRequest) {
  return handleRefresh(req);
}

// Convenience so you can hit it from the browser
export async function GET(req: NextRequest) {
  return handleRefresh(req);
}

export async function OPTIONS(req: NextRequest) {
  const origin = pickOrigin(req);
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
