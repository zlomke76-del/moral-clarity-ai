// lib/memory.ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { classifyMemoryText, type ClassificationResult } from './memory-classifier';

export const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dims

/* =========================================================
 * Supabase client (service-role, non-persisted auth)
 * =======================================================*/
const sb = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

/* =========================================================
 * Embeddings helper
 * =======================================================*/
async function embed(text: string): Promise<number[]> {
  const input = (text || '').slice(0, 6000); // hard cap
  if (!input.trim()) return [];

  const r = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input }),
  });

  if (!r.ok) {
    // best-effort: do not crash chat on embedding failures
    // eslint-disable-next-line no-console
    console.error('[memory] embed() failed', r.status, await r.text().catch(() => ''));
    return [];
  }

  const j = await r.json().catch(() => null as any);
  return j?.data?.[0]?.embedding ?? [];
}

/* =========================================================
 * Types
 * =======================================================*/
export type MemoryPurpose = 'profile' | 'preference' | 'fact' | 'task' | 'note';

export type Memory = {
  id?: string;
  user_key: string;
  content: string;
  purpose?: MemoryPurpose;
  title?: string | null;
  workspace_id?: string | null; // user_memories is user-scoped; workspace is optional metadata
};

export type RememberResult = {
  row: any;
  classification?: ClassificationResult | null;
};

export type MemoryHit = {
  id: string;
  content: string;
  purpose?: string;
  user_key: string;
  similarity?: number;
};

/* =========================================================
 * 1) ATOMIC FACTUAL MEMORY (user_memories)
 * =======================================================*/

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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[memory] classifyMemoryText failed', err);
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
 *
 * Backwards-compatible version (old name).
 */
export async function searchMemories(
  user_key: string,
  query: string,
  k = 8
): Promise<MemoryHit[]> {
  return searchUserFacts(user_key, query, k);
}

/**
 * New, semantically clearer name.
 * Uses the same RPC as searchMemories.
 */
export async function searchUserFacts(
  user_key: string,
  query: string,
  k = 8
): Promise<MemoryHit[]> {
  const client = sb();
  const q = (query || 'general').trim() || 'general';
  const qvec = await embed(q);

  if (!qvec.length) return [];

  const { data, error } = await client.rpc('match_user_memories', {
    p_user_key: user_key,
    p_query_embedding: qvec,
    p_match_count: k,
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[memory] match_user_memories error', error);
    throw error;
  }

  return (data ?? []).map((m: any) => ({
    id: m.id,
    content: m.content,
    purpose: m.kind,
    user_key: m.user_key,
    similarity: m.similarity,
  }));
}

/* =========================================================
 * 2) EPISODIC MEMORY LAYER (memory_episodes + chunks)
 *
 * Supabase schema (from your DDL / CSV):
 *
 * table: memory_episodes
 *  - id uuid primary key
 *  - user_key text not null
 *  - workspace_id text null
 *  - title text
 *  - summary text
 *  - started_at timestamptz
 *  - ended_at timestamptz
 *  - importance int default 1
 *  - created_at timestamptz default now()
 *
 * table: memory_episode_chunks
 *  - id uuid primary key
 *  - episode_id uuid references memory_episodes(id)
 *  - seq int not null                <-- canonical order, NOT NULL
 *  - role text not null
 *  - content text not null
 *  - token_count int not null default 0
 *  - created_at timestamptz not null default now()
 *  - position int null               <-- extra column you added
 * =======================================================*/

export type Episode = {
  id: string;
  user_key: string;
  workspace_id: string | null;
  title: string | null;
  summary: string | null;
  started_at: string | null;
  ended_at: string | null;
  importance: number | null;
  created_at: string | null;
};

/**
 * Lightweight heuristic to decide whether this conversation
 * should be stored as an episode.
 *
 * Right now:
 * - requires at least 3 user turns
 * - requires the last user message to have some length
 * This is intentionally conservative to avoid spam.
 */
function shouldStoreEpisode(messages: Array<{ role: string; content: string }>): boolean {
  if (!Array.isArray(messages) || messages.length === 0) return false;

  const userTurns = messages.filter((m) => (m.role || '').toLowerCase() === 'user');
  if (userTurns.length < 3) return false;

  const lastUser = userTurns[userTurns.length - 1];
  if (!lastUser?.content || lastUser.content.trim().length < 40) return false;

  return true;
}

/**
 * Build a simple title + summary string from the last few turns
 * without requiring another model call.
 */
function summarizeEpisodeHeuristic(
  messages: Array<{ role: string; content: string }>
): { title: string; summary: string } {
  const userTurns = messages.filter((m) => (m.role || '').toLowerCase() === 'user');
  const firstUser = userTurns[0];
  const lastUser = userTurns[userTurns.length - 1];

  const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

  const lastSnippet = clean((lastUser?.content || '').slice(0, 120));
  const firstSnippet = clean((firstUser?.content || '').slice(0, 160));

  const title = lastSnippet || firstSnippet || 'Conversation episode';

  const summaryParts: string[] = [];
  summaryParts.push('Conversation episode between the user and Solace.');
  if (firstSnippet) summaryParts.push(`Early focus: ${firstSnippet}`);
  if (lastSnippet) summaryParts.push(`Latest focus: ${lastSnippet}`);

  const summary = summaryParts.join(' ');

  return { title, summary };
}

/**
 * maybeStoreEpisode
 *
 * Called from /api/chat AFTER we’ve seen the rolled conversation.
 * - No effect if memory is not configured.
 * - No effect if heuristics say "too small / trivial".
 * - Otherwise, writes:
 *   - 1 row to memory_episodes
 *   - up to the last 20 messages to memory_episode_chunks
 *
 * IMPORTANT: Supabase schema has seq NOT NULL,
 * so we must populate seq (and we also set position = seq
 * so your existing column is kept in sync).
 */
export async function maybeStoreEpisode(
  userKey: string,
  workspaceId: string | null,
  messages: Array<{ role: string; content: string }>
): Promise<void> {
  if (!userKey || !Array.isArray(messages) || messages.length === 0) return;
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  if (!shouldStoreEpisode(messages)) return;

  const client = sb();

  const { title, summary } = summarizeEpisodeHeuristic(messages);
  const nowIso = new Date().toISOString();

  // Insert episode row
  const { data: episode, error } = await client
    .from('memory_episodes')
    .insert([
      {
        user_key: userKey,
        workspace_id: workspaceId ?? null,
        title,
        summary,
        started_at: nowIso, // can be refined later if you track real start/end timestamps
        ended_at: nowIso,
        importance: 1,
      },
    ])
    .select()
    .single();

  if (error || !episode) {
    // eslint-disable-next-line no-console
    console.error('[memory] failed to insert memory_episodes', error);
    return;
  }

  const episodeId = episode.id;
  if (!episodeId) return;

  // Store only the last N messages as chunks to keep things bounded
  const MAX_CHUNKS = 20;
  const slice = messages.slice(-MAX_CHUNKS);

  /**
   * Supabase table:
   *  - seq int NOT NULL
   *  - position int NULL (your extra column)
   *
   * We populate BOTH so existing queries on either column behave.
   */
  const chunksPayload = slice.map((m, idx) => ({
    episode_id: episodeId,
    seq: idx,          // canonical order (NOT NULL)
    position: idx,     // keep this in sync for you
    role: m.role,
    content: m.content,
    // token_count is NOT NULL with default 0, so we can omit and let default handle it.
  }));

  if (!chunksPayload.length) return;

  const { error: chunkErr } = await client
    .from('memory_episode_chunks')
    .insert(chunksPayload);

  if (chunkErr) {
    // eslint-disable-next-line no-console
    console.error('[memory] failed to insert memory_episode_chunks', chunkErr);
  }
}

/* =========================================================
 * 3) MEMORY PACK FOR SOLACE SYSTEM PROMPT
 *
 * Combined factual + episodic view, rendered as bullets.
 * This version uses BOTH episodes and (a compact view of) their chunks.
 * =======================================================*/

export type MemoryPackOptions = {
  factsLimit?: number;
  episodesLimit?: number;
};

/**
 * getMemoryPack
 *
 * Returns a bullet list string suitable to splice into the
 * Solace system prompt.
 *
 * Strategy:
 * - Facts: vector search via match_user_memories (searchUserFacts)
 * - Episodes: latest episodes for this user_key (no vector yet)
 * - Episode chunks: for those episodes, pull a few ordered chunks
 *   and fold them into the bullets so Solace sees real context
 *   (e.g., MCAI details), not just a vague summary line.
 */
export async function getMemoryPack(
  userKey: string,
  query: string,
  opts: MemoryPackOptions = {}
): Promise<string> {
  if (!userKey) return '';

  const client = sb();

  const factsLimit = opts.factsLimit ?? 8;
  const episodesLimit = opts.episodesLimit ?? 6;

  let facts: MemoryHit[] = [];
  let episodes: Episode[] = [];

  // 1) Facts (vector search)
  try {
    const q = (query || 'general').trim() || 'general';
    facts = await searchUserFacts(userKey, q, factsLimit);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[memory] getMemoryPack → searchUserFacts failed', err);
  }

  // 2) Episodes (latest for this user)
  try {
    const { data, error } = await client
      .from('memory_episodes')
      .select(
        'id, user_key, workspace_id, title, summary, started_at, ended_at, importance, created_at'
      )
      .eq('user_key', userKey)
      .order('created_at', { ascending: false })
      .limit(episodesLimit);

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[memory] getMemoryPack → memory_episodes error', error);
    } else {
      episodes = (data ?? []) as Episode[];
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[memory] getMemoryPack → episodes fetch failed', err);
  }

  // 3) Episode chunks for those episodes (compact reconstruction)
  type ChunkRow = {
    episode_id: string;
    seq: number;
    role: string;
    content: string;
  };

  let chunkLinesByEpisode: Record<string, string> = {};

  try {
    if (episodes.length) {
      const episodeIds = episodes.map((e) => e.id);

      const { data: chunks, error: chunksErr } = await client
        .from('memory_episode_chunks')
        .select('episode_id, seq, role, content')
        .in('episode_id', episodeIds as any)
        .order('episode_id', { ascending: true })
        .order('seq', { ascending: true });

      if (chunksErr) {
        // eslint-disable-next-line no-console
        console.error('[memory] getMemoryPack → chunks error', chunksErr);
      } else if (Array.isArray(chunks) && chunks.length) {
        const byEpisode: Record<string, ChunkRow[]> = {};
        for (const c of chunks as any[]) {
          if (!c.episode_id) continue;
          if (!byEpisode[c.episode_id]) byEpisode[c.episode_id] = [];
          byEpisode[c.episode_id].push({
            episode_id: c.episode_id,
            seq: c.seq ?? 0,
            role: c.role ?? 'assistant',
            content: c.content ?? '',
          });
        }

        // Turn a handful of chunks into a short descriptive tail
        for (const e of episodes) {
          const rows = (byEpisode[e.id] || []).sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
          if (!rows.length) continue;

          const MAX_CHUNKS_PER_EPISODE = 4; // keep it tight
          const used = rows.slice(0, MAX_CHUNKS_PER_EPISODE);

          const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
          const snippets = used.map((r) => {
            const prefix = r.role.toLowerCase() === 'user' ? 'user:' : 'Solace:';
            const text = clean((r.content || '').slice(0, 160));
            return text ? `${prefix} ${text}` : '';
          }).filter(Boolean);

          if (snippets.length) {
            chunkLinesByEpisode[e.id] = snippets.join(' | ');
          }
        }
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[memory] getMemoryPack → chunks fetch failed', err);
  }

  // Build episode bullet lines: summary + a couple of chunk snippets
  const episodeLines = episodes.map((e) => {
    const label = (e.title || 'Conversation episode').replace(/\s+/g, ' ').trim();
    const summary = (e.summary || '').replace(/\s+/g, ' ').trim();
    const tail = chunkLinesByEpisode[e.id];

    if (summary && tail) {
      return `• (episode) ${label} — ${summary} | ${tail}`;
    }
    if (summary) {
      return `• (episode) ${label} — ${summary}`;
    }
    if (tail) {
      return `• (episode) ${label} — ${tail}`;
    }
    return `• (episode) ${label}`;
  });

  const factLines = facts.map((m) => {
    const kind = m.purpose ?? 'fact';
    return `• (${kind}) ${m.content}`;
  });

  const combined = [...episodeLines, ...factLines];
  if (!combined.length) return '';

  // Keep total size bounded
  const MAX_LINES = Math.max(factsLimit + episodesLimit, 4);
  return combined.slice(0, MAX_LINES).join('\n');
}

