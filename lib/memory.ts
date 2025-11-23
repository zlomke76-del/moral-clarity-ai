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
 * Schema assumption (you can adapt names/types if needed):
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
 *  - seq int not null
 *  - role text
 *  - content text
 *  - token_count int default 0
 *  - created_at timestamptz default now()
 *  - position int null (legacy)
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
        started_at: nowIso, // you can refine later if you want real start/end from timestamps
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

  // IMPORTANT: write seq (for strict NOT NULL) and keep position for legacy
  const chunksPayload = slice.map((m, idx) => ({
    episode_id: episodeId,
    seq: idx,
    position: idx,
    role: m.role,
    content: m.content,
  }));

  if (!chunksPayload.length) return;

  const { error: chunkErr } = await client.from('memory_episode_chunks').insert(chunksPayload);

  if (chunkErr) {
    // eslint-disable-next-line no-console
    console.error('[memory] failed to insert memory_episode_chunks', chunkErr);
  }
}

/* =========================================================
 * 3) MEMORY PACK FOR SOLACE SYSTEM PROMPT
 *
 * Combined factual + episodic view, rendered as bullets.
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
 * - Episodes: **query-aware episodes**, enriched with key chunks
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

  // Normalize query once so facts + episodes see the same text
  const q = (query || 'general').trim() || 'general';

  // 1) Facts (vector search)
  try {
    facts = await searchUserFacts(userKey, q, factsLimit);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[memory] getMemoryPack → searchUserFacts failed', err);
  }

  // 2) Episodes (query-aware via Supabase, then fallback to latest)
  try {
    const escaped = q.replace(/[%_]/g, (c) => '\\' + c);
    const pattern = `%${escaped}%`;

    let eps: Episode[] = [];

    // First try: title/summary ILIKE the query for this user
    const { data: byText, error: byTextErr } = await client
      .from('memory_episodes')
      .select(
        'id, user_key, workspace_id, title, summary, started_at, ended_at, importance, created_at'
      )
      .eq('user_key', userKey)
      .or(`title.ilike.${pattern},summary.ilike.${pattern}`)
      .order('created_at', { ascending: false })
      .limit(episodesLimit);

    if (!byTextErr && Array.isArray(byText) && byText.length) {
      eps = byText as Episode[];
    } else {
      // Fallback: latest episodes for this user
      const { data: latest, error: latestErr } = await client
        .from('memory_episodes')
        .select(
          'id, user_key, workspace_id, title, summary, started_at, ended_at, importance, created_at'
        )
        .eq('user_key', userKey)
        .order('created_at', { ascending: false })
        .limit(episodesLimit);

      if (!latestErr && Array.isArray(latest)) {
        eps = latest as Episode[];
      } else if (latestErr) {
        // eslint-disable-next-line no-console
        console.error('[memory] getMemoryPack → memory_episodes fallback error', latestErr);
      }
    }

    episodes = eps;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[memory] getMemoryPack → episodes fetch failed', err);
  }

  // 2b) Enrich episodes with a short "Key turns" snippet from chunks
  let chunksByEpisode: Record<string, { role: string; content: string }[]> = {};

  if (episodes.length) {
    try {
      const ids = episodes.map((e) => e.id).filter(Boolean);
      if (ids.length) {
        const { data: allChunks, error: chunksErr } = await client
          .from('memory_episode_chunks')
          .select('episode_id, role, content, seq, position')
          .in('episode_id', ids);

        if (!chunksErr && Array.isArray(allChunks)) {
          const tmp: Record<
            string,
            { role: string; content: string; order: number }[]
          > = {};

          for (const c of allChunks as any[]) {
            const eid = c.episode_id as string;
            if (!eid) continue;
            const order =
              typeof c.seq === 'number' && Number.isFinite(c.seq)
                ? c.seq
                : typeof c.position === 'number' && Number.isFinite(c.position)
                ? c.position
                : 0;
            if (!tmp[eid]) tmp[eid] = [];
            tmp[eid].push({
              role: String(c.role ?? ''),
              content: String(c.content ?? ''),
              order,
            });
          }

          chunksByEpisode = Object.fromEntries(
            Object.entries(tmp).map(([eid, list]) => [
              eid,
              list
                .sort((a, b) => a.order - b.order)
                .map(({ role, content }) => ({ role, content })),
            ])
          );
        } else if (chunksErr) {
          // eslint-disable-next-line no-console
          console.error('[memory] getMemoryPack → chunks query error', chunksErr);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[memory] getMemoryPack → chunks fetch failed', err);
    }
  }

  const cleanOneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

  const episodeLines = episodes.map((e) => {
    const label = cleanOneLine(e.title || 'Conversation episode');
    const summary = cleanOneLine(e.summary || '');

    const chunksForEpisode = chunksByEpisode[e.id] || [];
    let snippet = '';

    if (chunksForEpisode.length) {
      const topSnippets = chunksForEpisode
        .slice(0, 2)
        .map((c) => {
          const r = (c.role || 'turn').toLowerCase();
          const txt = cleanOneLine(c.content).slice(0, 140);
          return `${r}: ${txt}`;
        });
      if (topSnippets.length) {
        snippet = ` Key turns: ${topSnippets.join(' | ')}`;
      }
    }

    if (summary) {
      return `• (episode) ${label} — ${summary}${snippet}`;
    }
    return `• (episode) ${label}${snippet}`;
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
