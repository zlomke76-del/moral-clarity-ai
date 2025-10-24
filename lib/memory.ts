// lib/memory.ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supa = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false }
  });

// Replace this with your embedding provider call.
// If you're already calling OpenAI elsewhere, reuse that util.
async function embed(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text })
  });
  const j = await res.json();
  return j?.data?.[0]?.embedding ?? [];
}

export type Memory = {
  id?: string;
  user_key: string;
  kind: 'profile'|'preference'|'fact'|'task'|'note';
  content: string;
  weight?: number;
  expires_at?: string | null;
};

export async function remember(m: Memory) {
  const sb = supa();
  const vec = await embed(m.content);
  const { data, error } = await sb
    .from('user_memories')
    .insert([{ ...m, embedding: vec }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function searchMemories(user_key: string, query: string, k = 8) {
  const sb = supa();
  const qvec = await embed(query);
  // cosine similarity: smaller distance = closer; we’ll invert to score later if needed
  const { data, error } = await sb.rpc('match_user_memories', {
    p_user_key: user_key,
    p_query_embedding: qvec,
    p_match_count: k
  });
  if (error) throw error;
  return data as Array<{ id: string; content: string; kind: string; weight: number }>;
}
