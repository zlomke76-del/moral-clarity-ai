// /app/api/memory/route.ts
import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase';
import { EMBEDDING_MODEL } from '@/lib/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Utility: create an embedding via OpenAI
async function embed(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text })
  });
  const j = await res.json();
  return j?.data?.[0]?.embedding ?? [];
}

/**
 * POST /api/memory
 * Body: { workspace_id: string, title?: string, content?: string, kind?: 'profile'|'preference'|'fact'|'task'|'note', user_key?: string, weight?: number, expires_at?: string|null }
 * - If 'content' is present, we compute and store an embedding (for user_memories path).
 * - If only title/content for workspace memory catalog is desired, it inserts into mca.memories.
 *
 * Choose behavior via 'mode':
 *   mode = 'user' (default) => writes to public.user_memories (vector search path).
 *   mode = 'workspace' => writes to mca.memories (simple catalog/listing).
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
      user_key = 'owner', // you can pass a stable per-user key here
      weight = 1,
      expires_at = null
    } = body ?? {};

    if (!workspace_id) {
      return NextResponse.json({ error: 'workspace_id required' }, { status: 400 });
    }

    if (mode === 'workspace') {
      // Insert into schema mca.memories (no vector embedding)
      const { data, error } = await sb
        .schema('mca')
        .from('memories')
        .insert([{ workspace_id, title: title ?? (content ?? '').slice(0, 80), content }])
        .select('id')
        .single();

      if (error) throw error;
      return NextResponse.json({ id: data.id }, { status: 201 });
    }

    // Default: user memory with embedding into public.user_memories
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
 * Query:
 *   mode = 'user' | 'workspace' (default 'workspace' to list mca.memories)
 *   workspace_id (required for workspace mode)
 *   user_key (required for user search)
 *   q = string (optional; if set and mode=user => vector search via RPC; if blank => no-op)
 *   limit (optional; default 25)
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

    // user vector search
    const user_key = url.searchParams.get('user_key');
    const q = url.searchParams.get('q') ?? '';
    if (!user_key) {
      return NextResponse.json({ error: 'user_key required for mode=user' }, { status: 400 });
    }
    if (!q) {
      // No query? Return the most recent raw user_memories
      const { data, error } = await sb
        .from('user_memories')
        .select('id,kind,content,weight,created_at')
        .eq('user_key', user_key)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return NextResponse.json({ rows: data ?? [] });
    }

    // Vector search via RPC
    // NOTE: expects the RPC function `match_user_memories(p_user_key, p_query_embedding, p_match_count)`
    //       to exist in your database (as per your earlier setup).
    const qvec = await (async () => {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: EMBEDDING_MODEL, input: q })
      });
      const j = await res.json();
      return j?.data?.[0]?.embedding ?? [];
    })();

    const { data, error } = await sb.rpc('match_user_memories', {
      p_user_key: user_key,
      p_query_embedding: qvec,
      p_match_count: limit
    });

    if (error) throw error;
    return NextResponse.json({ rows: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
