// /app/api/memory/route.ts
import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import { EMBEDDING_MODEL } from '@/lib/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// --- helpers ---
async function embed(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });
  const j = await res.json();
  return j?.data?.[0]?.embedding ?? [];
}

/**
 * POST /api/memory
 * mode = 'user' | 'workspace'  (default 'user')
 *  - user: writes to public.user_memories (requires content; no workspace_id)
 *  - workspace: writes to mca.memories (requires workspace_id)
 */
export async function POST(req: Request) {
  try {
    const sb = supabaseService();
    const body = await req.json();

    const {
      mode = 'user',
      workspace_id,
      title,
      content,
      kind = 'note',
      user_key = 'owner',
      weight = 1,
      expires_at = null,
    } = body ?? {};

    if (mode === 'workspace') {
      if (!workspace_id) {
        return NextResponse.json({ error: 'workspace_id required' }, { status: 400 });
      }
      const { data, error } = await sb
        .schema('mca')
        .from('memories')
        .insert([{ workspace_id, title: title ?? (content ?? '').slice(0, 80), content }])
        .select('id')
        .single();
      if (error) throw error;
      return NextResponse.json({ id: data.id }, { status: 201 });
    }

    // mode === 'user'
    if (!content) {
      return NextResponse.json({ error: 'content required for user memory' }, { status: 400 });
    }
    const vector = await embed(content);
    const { data, error } = await sb
      .from('user_memories')
      .insert([{ user_key, kind, content, weight, expires_at, embedding: vector }])
      .select('id')
      .single();
    if (error) throw error;
    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

/**
 * GET /api/memory
 * mode=workspace&workspace_id=... -> list mca.memories
 * mode=user&user_key=...&q=...   -> vector search via RPC
 * mode=user&user_key=...         -> latest raw user_memories
 */
export async function GET(req: Request) {
  try {
    const sb = supabaseService();
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') ?? 'workspace';
    const limit = Number(url.searchParams.get('limit') ?? '25');

    if (mode === 'workspace') {
      const workspace_id = url.searchParams.get('workspace_id');
      if (!workspace_id) {
        return NextResponse.json({ error: 'workspace_id required' }, { status: 400 });
      }
      const { data, error } = await sb
        .schema('mca')
        .from('memories')
        .select('id,title,created_at,workspace_id')
        .eq('workspace_id', workspace_id)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return NextResponse.json({ rows: data ?? [] });
    }

    // mode === 'user'
    const user_key = url.searchParams.get('user_key');
    const q = url.searchParams.get('q') ?? '';
    if (!user_key) {
      return NextResponse.json({ error: 'user_key required for mode=user' }, { status: 400 });
    }

    if (!q) {
      const { data, error } = await sb
        .from('user_memories')
        .select('id,kind,content,weight,created_at')
        .eq('user_key', user_key)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return NextResponse.json({ rows: data ?? [] });
    }

    // vector search via RPC match_user_memories
    const qvec = await embed(q);
    const { data, error } = await sb.rpc('match_user_memories', {
      p_user_key: user_key,
      p_query_embedding: qvec,
      p_match_count: limit,
    });
    if (error) throw error;
    return NextResponse.json({ rows: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
