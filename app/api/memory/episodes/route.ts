// app/api/memory/episodes/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MCA_USER_KEY } from '@/lib/mca-config';

const SUPABASE_URL = process.env.SUPABASE_URL as string | undefined;
const SUPABASE_SERVICE_ROLE_KEY = process.env
  .SUPABASE_SERVICE_ROLE_KEY as string | undefined;

function adminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('[memory/episodes] Supabase admin credentials not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

function getUserKeyFromReq(req: NextRequest): string {
  return req.headers.get('x-user-key') || MCA_USER_KEY || 'guest';
}

export async function GET(req: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { ok: false, error: 'Memory not configured' },
        { status: 500 }
      );
    }

    const client = adminClient();
    const userKey = getUserKeyFromReq(req);
    const { searchParams } = new URL(req.url);

    const limitRaw = searchParams.get('limit');
    const limit = Math.min(Math.max(Number(limitRaw || 10) || 10, 1), 50);

    const { data, error } = await client
      .from('memory_episodes')
      .select(
        'id, user_key, workspace_id, title, summary, started_at, ended_at, importance, created_at'
      )
      .eq('user_key', userKey)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[memory/episodes] select error', error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        user_key: userKey,
        episodes: data ?? [],
      },
      { status: 200 }
    );
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[memory/episodes] fatal', err);
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
