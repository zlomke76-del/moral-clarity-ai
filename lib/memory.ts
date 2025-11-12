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
  workspace_id?: string | null; // ignored in user_memories path, but kept for compatibility
};

export async function remember(m: Memory) {
  const client = sb();
  const vec = await embed(m.content);

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
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Vector search across user_memories via RPC
 * match_user_memories(p_user_key text, p_query_embedding vector, p_match_count int)
 */
export async function searchMemories(user_key: string, query: string, k = 8) {
  const client = sb();
  const qvec = await embed(query);

  const { data, error } = await client
    .rpc('match_user_memories', {
      p_user_key: user_key,
      p_query_embedding: qvec,
      p_match_count: k,
    });

  if (error) throw error;

  // Normalize shape for the prompt pack
  return (data ?? []).map((m: any) => ({
    id: m.id,
    content: m.content,
    purpose: m.kind,
    user_key: m.user_key,
    similarity: m.similarity,
  }));
}
