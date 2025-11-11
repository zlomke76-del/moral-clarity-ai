// /lib/memory.ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

export const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dims

const sb = () =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

async function embed(text: string): Promise<number[]> {
  const r = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });
  const j = await r.json();
  return j?.data?.[0]?.embedding ?? [];
}

export type Memory = {
  id?: string;
  user_key: string;
  content: string;
  purpose?: 'profile' | 'preference' | 'fact' | 'task' | 'note';
  title?: string | null;
  workspace_id?: string | null; // optional workspace scope
};

/**
 * Insert memory:
 * - Primary: vectorized insert into user_memories (for recall quality)
 * - Optional: mirror into memories table when workspace_id provided (best-effort; ignores errors)
 */
export async function remember(m: Memory) {
  const client = sb();
  const vec = await embed(m.content);

  // 1) vector store path
  const { data, error } = await client
    .from('user_memories')
    .insert([{
      user_key: m.user_key,
      kind: m.purpose ?? 'fact',
      title: m.title ?? null,
      content: m.content,
      weight: 1,
      expires_at: null,
      embedding: vec,
      // If your view supports workspace_id, include it; otherwise it's fine to omit.
      workspace_id: m.workspace_id ?? null,
    }])
    .select()
    .single();

  if (error) throw error;

  // 2) mirror to workspace table (non-fatal)
  if (m.workspace_id) {
    try {
      // Keep columns conservative to avoid schema mismatch
      await client.from('memories').insert([{
        workspace_id: m.workspace_id,
        user_key: m.user_key,
        title: m.title ?? null,
        content: m.content,
        purpose: m.purpose ?? 'fact',
      }]);
    } catch {
      // ignore; mirror is best-effort
    }
  }

  return data;
}

/**
 * Flexible recall:
 * - New signature: searchMemories({ user_key, query, limit, workspace_id? })
 * - Back-compat:   searchMemories(user_key, query, k?)
 *
 * Behavior:
 * - If workspace_id is provided, try pulling latest rows from `memories` (scoped).
 *   If that fails (schema differs), fall back to vector `match_user_memories`.
 * - Otherwise, use vector RPC directly.
 */
export async function searchMemories(
  a:
    | { user_key: string; query: string; limit?: number; workspace_id?: string | null }
    | string,
  b?: string,
  c?: number
): Promise<Array<{ id: string; content: string; purpose?: string; user_key?: string; similarity?: number }>> {
  const client = sb();

  // Normalize args
  let user_key: string;
  let query: string;
  let limit = 8;
  let workspace_id: string | null = null;

  if (typeof a === 'string') {
    user_key = a;
    query = String(b ?? '');
    if (Number.isFinite(c as number)) limit = c as number;
  } else {
    user_key = a.user_key;
    query = a.query;
    if (Number.isFinite(a.limit as number)) limit = a.limit as number;
    workspace_id = a.workspace_id ?? null;
  }

  // If workspace scope requested, try table-first (fast, deterministic)
  if (workspace_id) {
    try {
      // Try to read from memories table with both filters when possible
      let q = client
        .from('memories')
        .select('id, title, content, purpose, user_key, created_at')
        .eq('workspace_id', workspace_id)
        .order('created_at', { ascending: false })
        .limit(limit);

      // If schema has user_key, filter it; if not, the filter will simply have no effect.
      q = q.eq('user_key', user_key) as any;

      const { data, error } = await q;
      if (!error && Array.isArray(data)) {
        return (data as any[]).map((row) => ({
          id: String(row.id),
          content: row.content ?? row.title ?? '',
          purpose: row.purpose ?? 'fact',
          user_key: row.user_key ?? user_key,
          similarity: undefined,
        }));
      }
      // fallthrough → vector fallback if table path fails
    } catch {
      // ignore and fallback below
    }
  }

  // Vector fallback via RPC
  const qvec = await embed(query || 'general');

  const { data, error } = await client.rpc('match_user_memories', {
    p_user_key: user_key,
    p_query_embedding: qvec,
    p_match_count: limit,
  });

  if (error) throw error;

  return (data ?? []).map((m: any) => ({
    id: m.id,
    content: m.content ?? m.title ?? '',
    purpose: m.kind ?? 'fact',
    user_key: m.user_key,
    similarity: m.similarity,
  }));
}
