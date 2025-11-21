// app/api/memory/episode/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string | undefined;
const SUPABASE_SERVICE_ROLE_KEY = process.env
  .SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Fail fast at boot if env is missing
  console.warn(
    '[memory/episode] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.'
  );
}

function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('[memory/episode] Supabase admin credentials not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type, X-User-Key');
  h.set('Access-Control-Max-Age', '86400');
  if (origin) h.set('Access-Control-Allow-Origin', origin);
  return h;
}

function pickOrigin(req: NextRequest): string | null {
  const origin = req.headers.get('origin');
  if (!origin) return null;
  try {
    // You can tighten this if you want; for now, echo back same origin.
    // Studio only runs from your own domains anyway.
    return origin;
  } catch {
    return null;
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = pickOrigin(req);
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(req: NextRequest) {
  const origin = pickOrigin(req);
  try {
    const url = new URL(req.url);
    const episodeId = url.searchParams.get('episode_id');
    const limitParam = url.searchParams.get('limit');
    const userKey = req.headers.get('x-user-key') || null;

    if (!episodeId) {
      return NextResponse.json(
        { ok: false, error: 'Missing episode_id query parameter' },
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const limit = Math.max(
      1,
      Math.min(parseInt(limitParam || '500', 10) || 500, 2000)
    );

    const supabase = createAdminClient();

    // 1) Fetch the episode header
    const { data: episode, error: episodeError } = await supabase
      .from('memory_episodes')
      .select('*')
      .eq('id', episodeId)
      .single();

    if (episodeError || !episode) {
      return NextResponse.json(
        {
          ok: false,
          error: episodeError?.message || 'Episode not found',
        },
        { status: 404, headers: corsHeaders(origin) }
      );
    }

    // Optional guard: if a user_key header is supplied, only allow matching episodes.
    if (userKey && episode.user_key && episode.user_key !== userKey) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Forbidden: episode does not belong to this user_key',
        },
        { status: 403, headers: corsHeaders(origin) }
      );
    }

    // 2) Fetch ordered chunks
    const { data: chunks, error: chunksError } = await supabase
      .from('memory_episode_chunks')
      .select('*')
      .eq('episode_id', episodeId)
      .order('seq', { ascending: true })
      .limit(limit);

    if (chunksError) {
      return NextResponse.json(
        {
          ok: false,
          error: chunksError.message,
        },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        episode,
        chunks: chunks || [],
      },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    const msg = err?.message || String(err);
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

