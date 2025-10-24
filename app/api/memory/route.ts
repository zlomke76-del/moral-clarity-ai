// app/api/memory/route.ts
import { NextResponse } from 'next/server';
import { remember } from '@/lib/memory';
import { createClient } from '@supabase/supabase-js';

function getUserKey(req: Request) {
  // TODO: replace with real auth; for now, a cookie or header fallback
  return req.headers.get('x-user-key') || 'guest';
}

export async function GET(req: Request) {
  const user_key = getUserKey(req);
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await sb.from('user_memories')
    .select('id, kind, content, weight, created_at, expires_at')
    .eq('user_key', user_key)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) return new NextResponse(error.message, { status: 400 });
  return NextResponse.json({ items: data });
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=> ({}));
  const user_key = getUserKey(req);
  const { kind = 'note', content = '', weight = 1.0, expires_at = null } = body || {};
  if (!content) return new NextResponse('content required', { status: 400 });
  const row = await remember({ user_key, kind, content, weight, expires_at });
  return NextResponse.json(row);
}
