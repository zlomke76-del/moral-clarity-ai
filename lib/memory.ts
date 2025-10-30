// /lib/memory.ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

export const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dims

// Use the SERVICE ROLE key (not anon) and the mca schema
const sb = () =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,   // << must exist in Vercel
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
  workspace_id?: string | null;
};

export async function remember(m: Memory) {
  const client = sb();
  const vec = await embed(m.content);

  // insert into mca.memories (schema-qualified)
  const { data, error } = await client
    .schema('mca')
    .from('memories')
    .insert([{
      user_key: m.user_key,
      content: m.content,
      purpose: m.purpose ?? 'fact',
      title: m.title ?? null,
      workspace_id: m.workspace_id ?? null,
      embedding: vec,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function searchMemories(user_key: string, query: string, k = 8) {
  const client = sb();
  const qvec = await embed(query);

  // uses the mca.match_memories RPC below
  const { data, error } = await client
    .rpc('match_memories', {
      p_user_key: user_key,
      p_query_embedding: qvec,
      p_match_count: k,
    }, { head: false });

  if (error) throw error;
  return (data ?? []) as Array<{
    id: string;
    content: string;
    purpose: string;
    user_key: string;
    similarity: number;
  }>;
}
