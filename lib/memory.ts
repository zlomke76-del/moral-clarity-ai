import 'server-only';
import { createClient } from '@supabase/supabase-js';

export const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dims

const sb = () =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,   // must be set in Vercel (Production)
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
  if (!j?.data?.[0]?.embedding) {
    console.error('EMBED_ERROR', j);
    throw new Error('Failed to embed');
  }
  return j.data[0].embedding;
}

export type Memory = {
  id?: string;
  user_key: string;
  content: string;
  purpose?: 'profile'|'preference'|'fact'|'task'|'note';
  title?: string | null;
  workspace_id?: string | null;
};

export async function remember(m: Memory) {
  const client = sb();
  const vec = await embed(m.content);

  const payload = {
    user_key: m.user_key,
    content: m.content,
    purpose: m.purpose ?? 'fact',
    title: m.title ?? '',                  // NOT NULL on DB
    workspace_id: m.workspace_id!,         // must be provided by caller
    embedding: vec,
  };

  const { data, error } = await client.schema('mca').from('memories')
    .insert([payload]).select().single();

  if (error) {
    console.error('MEMORY_INSERT_ERROR', error, { payloadMeta: {
      user_key: payload.user_key,
      purpose: payload.purpose,
      title: payload.title,
      hasWorkspace: !!payload.workspace_id,
      embLen: payload.embedding?.length,
    }});
    throw error;
  }
  return data;
}

export async function searchMemories(user_key: string, query: string, k = 8) {
  const client = sb();
  const qvec = await embed(query);
  const { data, error } = await client
    .rpc('match_memories', {
      p_user_key: user_key,
      p_query_embedding: qvec,
      p_match_count: k,
    });

  if (error) {
    console.error('MEMORY_SEARCH_ERROR', error);
    throw error;
  }
  return (data ?? []) as Array<{
    id: string; content: string; purpose: string; user_key: string; similarity: number;
  }>;
}
