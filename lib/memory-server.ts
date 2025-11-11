// /lib/memory-server.ts
// Server-side helpers for memory recall & write.
// No generics on supabase.from() to avoid versioned TS signature conflicts.

import { supabaseService } from '@/lib/supabase';

export type MemoryHit = {
  id?: string;
  content: string;
  purpose?: string | null;
  title?: string | null;
  weight?: number | null;
  created_at?: string | null;
  // optional tagging if present
  tags?: string[] | null;
};

type SearchOpts = {
  user_key: string;
  query: string;
  limit?: number;
};

/**
 * Try vector search via public RPC `match_user_memories`.
 * Falls back to newest rows if the RPC is missing.
 */
export async function searchMemories(userKey: string, query: string, limit = 8): Promise<MemoryHit[]> {
  const sb = supabaseService();

  // 1) Prefer user-scoped memories via RPC (vector search)
  try {
    const { data, error } = await sb.rpc('match_user_memories', {
      p_user_key: userKey,
      p_query_embedding: await embedQuery(query),
      p_match_count: limit,
    });

    if (!error && Array.isArray(data)) {
      // RPC usually returns: { id, content, kind/purpose, weight, created_at, similarity }
      return (data as any[]).map((row) => ({
        id: row.id,
        content: String(row.content ?? ''),
        purpose: row.kind ?? row.purpose ?? null,
        title: row.title ?? null,
        weight: row.weight ?? null,
        created_at: row.created_at ?? null,
      }));
    }
  } catch {
    // ignore — fall through to row-based lookup
  }

  // 2) Fallback: latest user_memories (no vector search)
  try {
    const { data, error } = await sb
      .from('user_memories')
      .select('id, content, kind, weight, created_at, title')
      .eq('user_key', userKey)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && Array.isArray(data)) {
      return data.map((row: any) => ({
        id: row.id,
        content: String(row.content ?? ''),
        purpose: row.kind ?? null,
        title: row.title ?? null,
        weight: row.weight ?? null,
        created_at: row.created_at ?? null,
      }));
    }
  } catch {
    // ignore
  }

  // 3) Nothing found
  return [];
}

/**
 * Persist a simple fact-style memory for the current user.
 * Mirrors what /api/memory does (mode=user), but inline to avoid extra HTTP.
 */
export async function remember(payload: {
  user_key: string;
  content: string;
  purpose?: string; // stored as 'kind' in user_memories
  title?: string;
  weight?: number;
  expires_at?: string | null;
}): Promise<{ id: string | null }> {
  const sb = supabaseService();

  const row = {
    user_key: payload.user_key,
    content: payload.content,
    kind: payload.purpose ?? 'fact',
    title: payload.title ?? null,
    weight: payload.weight ?? 1,
    expires_at: payload.expires_at ?? null,
    // Optional: if your table has 'embedding', you can precompute it here.
    // embedding: await embedQuery(payload.content),
  };

  const { data, error } = await sb
    .from('user_memories')
    .insert([row])
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to save memory');
  }

  return { id: data?.id ?? null };
}

/* ---------- helpers ---------- */

/**
 * Creates an embedding vector by calling OpenAI embeddings endpoint directly.
 * If you don’t need embeddings (RPC handles it), you can return an empty array.
 */
async function embedQuery(text: string): Promise<number[]> {
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}`,
      },
      body: JSON.stringify({
        // keep in sync with /app/api/memory/route.ts -> EMBEDDING_MODEL
        model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
        input: text,
      }),
    });
    const j = await res.json();
    return j?.data?.[0]?.embedding ?? [];
  } catch {
    return [];
  }
}
