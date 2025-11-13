// lib/memory.ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { classifyMemoryText, type ClassificationResult } from './memory-classifier';

export const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dims

const sb = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

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
  workspace_id?: string | null; // user_memories is user-scoped; workspace is optional metadata
};

export type RememberResult = {
  row: any;
  classification?: ClassificationResult | null;
};

/**
 * Insert a new user memory with:
 * - embedding
 * - user_key, title, purpose (as kind)
 * - optional workspace_id
 * - classification written to memory_classifications
 */
export async function remember(m: Memory): Promise<RememberResult> {
  const client = sb();
  const vec = await embed(m.content);

  let classification: ClassificationResult | null = null;
  try {
    classification = await classifyMemoryText(m.content);
  } catch {
    classification = null;
  }

  const { data, error } = await client
    .from('user_memories')
    .insert([
      {
        user_key: m.user_key,
        kind: m.purpose ?? 'fact',
        title: m.title ?? null,
        content: m.content,
        weight: 1,
        expires_at: null,
        embedding: vec,
        workspace_id: m.workspace_id ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  if (classification && data?.id) {
    try {
      await client.from('memory_classifications').insert([
        {
          memory_id: data.id,
          provider: classification.provider,
          label: classification.label,
          confidence: classification.confidence,
          raw: classification.raw ?? null,
        },
      ]);
    } catch (e) {
      // Do not fail the main write just because classification logging failed
      // eslint-disable-next-line no-console
      console.error('Failed to insert memory_classifications row:', e);
    }
  }

  return { row: data, classification };
}

/**
 * Vector search across user_memories via RPC:
 * match_user_memories(p_user_key text, p_query_embedding vector, p_match_count int)
 */
export async function searchMemories(user_key: string, query: string, k = 8) {
  const client = sb();
  const qvec = await embed(query);

  const { data, error } = await client.rpc('match_user_memories', {
    p_user_key: user_key,
    p_query_embedding: qvec,
    p_match_count: k,
  });

  if (error) throw error;

  return (data ?? []).map((m: any) => ({
    id: m.id,
    content: m.content,
    purpose: m.kind,
    user_key: m.user_key,
    similarity: m.similarity,
  }));
}
