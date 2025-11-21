// lib/memory.ts
import 'server-only';

import { createClient, type PostgrestError } from '@supabase/supabase-js';
import {
  classifyMemoryText,
  type ClassificationResult,
  type MemoryClassificationLabel,
} from './memory-classifier';

export const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dims

/* ========= Supabase admin client ========= */

function createAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      '[memory] Supabase admin credentials not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)',
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

/* ========= Embeddings ========= */

async function embed(text: string): Promise<number[]> {
  const input = (text || '').trim();
  if (!input) return [];

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[memory] OPENAI_API_KEY not configured, returning empty embedding');
    return [];
  }

  const r = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input }),
  });

  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    console.error('[memory] embedding error:', r.status, txt);
    return [];
  }

  const j = await r.json().catch(() => null as any);
  const vec = j?.data?.[0]?.embedding;
  if (!Array.isArray(vec)) {
    console.warn('[memory] embedding response missing data.embedding, returning []');
    return [];
  }
  return vec as number[];
}

/* ========= Types ========= */

export type MemoryPurpose = 'profile' | 'preference' | 'fact' | 'task' | 'note';

export type Memory = {
  id?: string;
  user_key: string;
  content: string;
  purpose?: MemoryPurpose;
  title?: string | null;
  workspace_id?: string | null; // workspace scope metadata
};

export type RememberResult = {
  row: any;
  classification?: ClassificationResult | null;
};

export type MemoryTier = 'anchor' | 'workspace' | 'other';

export type MemorySearchHit = {
  id: string;
  user_key: string;
  content: string;
  purpose: MemoryPurpose | string;
  similarity: number;
  workspace_id: string | null;
  weight: number;
  created_at: string | null;
  tier: MemoryTier;
  score: number; // final composite score (similarity + recency + importance + workspace)
};

export type MemorySearchOptions = {
  /**
   * Maximum number of memories to return after re-ranking.
   * Default: 8 (to match previous behavior).
   */
  k?: number;
  /**
   * Workspace ID for tiering and workspace-aware scoring.
   * - workspace_id === this → "workspace" tier
   * - workspace_id === null → "anchor" tier
   */
  workspaceId?: string | null;
  /**
   * Minimum cosine similarity threshold after vector search.
   * Default: 0 (no hard cutoff).
   */
  minSimilarity?: number;
  /**
   * Oversampling factor before ranking.
   * We ask the DB for k * oversample candidates, then re-rank.
   * Default: 3.
   */
  oversample?: number;
};

/* ========= Classification → purpose / weight mapping ========= */

function mapLabelToPurpose(label: MemoryClassificationLabel | undefined): MemoryPurpose {
  switch (label) {
    case 'Identity':
    case 'Profile':
    case 'Origin':
    case 'Relationship':
      return 'profile';
    case 'Preference':
    case 'Habit':
    case 'Interests':
      return 'preference';
    case 'Goal':
    case 'Task':
      return 'task';
    case 'Emotional':
    case 'Health':
    case 'Note':
    case 'Other':
    default:
      return 'fact';
  }
}

/**
 * Higher weight → more important / more likely to be recalled.
 * This is a soft signal; actual scoring also considers similarity and recency.
 */
function mapLabelToWeight(label: MemoryClassificationLabel | undefined): number {
  switch (label) {
    case 'Identity':
    case 'Profile':
    case 'Origin':
    case 'Relationship':
      return 3.0; // long-term anchors
    case 'Preference':
    case 'Habit':
    case 'Interests':
    case 'Goal':
      return 2.5; // strong mid-term relevance
    case 'Task':
      return 2.0; // important but often short-lived
    case 'Emotional':
    case 'Health':
      return 2.0;
    case 'Note':
    case 'Other':
    default:
      return 1.5;
  }
}

/**
 * For low-importance or clearly short-lived memories, we can optionally
 * set an expiration horizon. Right now this returns null (no expiry),
 * but is wired to be easily extended later.
 */
function computeExpiry(label: MemoryClassificationLabel | undefined): string | null {
  // Example future behavior:
  // - Tasks: 90 days
  // - Notes: 180 days
  // For now, keep everything non-expiring.
  return null;
}

/* ========= remember() ========= */

/**
 * Insert a new user memory with:
 * - embedding
 * - user_key, title, purpose (as kind)
 * - optional workspace_id
 * - classification written to memory_classifications
 * - weight derived from classification label
 *
 * This function is the "write path" for Solace's middle / long-term memory.
 */
export async function remember(m: Memory): Promise<RememberResult> {
  const admin = createAdminClient();
  const content = (m.content || '').trim();

  if (!content) {
    throw new Error('[memory.remember] content is empty');
  }

  const user_key = (m.user_key || '').trim();
  if (!user_key) {
    throw new Error('[memory.remember] user_key is required');
  }

  const workspace_id = m.workspace_id ?? null;

  // 1) Embed text
  const embedding = await embed(content);

  // 2) Classify text (best-effort; failure must not kill memory write)
  let classification: ClassificationResult | null = null;
  try {
    classification = await classifyMemoryText(content);
  } catch (err) {
    console.error('[memory.remember] classifyMemoryText failed (non-fatal):', err);
    classification = null;
  }

  const label: MemoryClassificationLabel | undefined = classification?.label;
  const kind: MemoryPurpose = m.purpose ?? mapLabelToPurpose(label);
  const weight = mapLabelToWeight(label);
  const expires_at = computeExpiry(label);

  // 3) Insert into user_memories
  const { data, error } = await admin
    .from('user_memories')
    .insert([
      {
        user_key,
        kind,
        title: m.title ?? null,
        content,
        weight,
        expires_at,
        embedding,
        workspace_id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('[memory.remember] user_memories insert error:', error);
    throw error;
  }

  // 4) Log classification to memory_classifications (non-fatal)
  if (classification && data?.id) {
    try {
      await admin.from('memory_classifications').insert([
        {
          memory_id: data.id,
          provider: classification.provider,
          label: classification.label,
          confidence: classification.confidence,
          raw: classification.raw ?? null,
        },
      ]);
    } catch (e) {
      console.error(
        '[memory.remember] Failed to insert memory_classifications row (non-fatal):',
        e,
      );
    }
  }

  return { row: data, classification };
}

/* ========= searchMemories() ========= */

/**
 * Vector search across user_memories via RPC:
 * match_user_memories(p_user_key text, p_query_embedding vector, p_match_count int)
 *
 * This is the "read path" for Solace's memory:
 * - Embeds the query
 * - Calls the RPC to get candidate rows
 * - Re-scores them by similarity, recency, weight, and workspace match
 * - Returns the top-k as MemorySearchHit[]
 *
 * Backwards compatible signature:
 *   searchMemories(user_key, query, k)
 * And extended signature:
 *   searchMemories(user_key, query, { k, workspaceId, minSimilarity, oversample })
 */
export async function searchMemories(
  user_key: string,
  query: string,
  kOrOpts?: number | MemorySearchOptions,
): Promise<MemorySearchHit[]> {
  const admin = createAdminClient();
  const trimmedUserKey = (user_key || '').trim();
  const trimmedQuery = (query || '').trim();

  if (!trimmedUserKey || !trimmedQuery) return [];

  // Normalize options (support old `k` signature)
  let opts: MemorySearchOptions;
  if (typeof kOrOpts === 'number') {
    opts = { k: kOrOpts };
  } else if (typeof kOrOpts === 'object' && kOrOpts !== null) {
    opts = { ...kOrOpts };
  } else {
    opts = {};
  }

  const k = opts.k && opts.k > 0 ? opts.k : 8;
  const oversample = opts.oversample && opts.oversample > 1 ? opts.oversample : 3;
  const minSimilarity = typeof opts.minSimilarity === 'number' ? opts.minSimilarity : 0;
  const workspaceId = opts.workspaceId ?? null;

  // 1) Embed query
  const qvec = await embed(trimmedQuery);
  if (!qvec.length) {
    return [];
  }

  // 2) Call RPC for brute similarity search
  const matchCount = k * oversample;

  let rows: any[] = [];
  try {
    const { data, error } = await admin.rpc('match_user_memories', {
      p_user_key: trimmedUserKey,
      p_query_embedding: qvec,
      p_match_count: matchCount,
    });

    if (error) {
      console.error('[memory.searchMemories] match_user_memories error:', error);
      return [];
    }

    rows = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[memory.searchMemories] RPC failed:', err);
    return [];
  }

  if (!rows.length) return [];

  const now = Date.now();

  const hits: MemorySearchHit[] = rows
    .map((m: any) => {
      const similarity = typeof m.similarity === 'number' ? m.similarity : 0;

      if (similarity < minSimilarity) {
        return null;
      }

      const created_at: string | null = m.created_at ?? null;
      const createdMs = created_at ? Date.parse(created_at) : NaN;
      const ageDays = Number.isFinite(createdMs)
        ? Math.max(0, (now - createdMs) / (1000 * 60 * 60 * 24))
        : null;

      // Recency boost: fresher memories get a modest boost.
      // Half-life ~60 days: after 60 days, recency factor ~0.5.
      const recencyFactor =
        ageDays === null ? 1 : 1 / (1 + ageDays / 60); // in (0,1], decreasing with age

      const rawWeight =
        typeof m.weight === 'number' && Number.isFinite(m.weight) ? m.weight : 1.5;
      const importanceFactor = 1 + rawWeight * 0.25; // weight 3 → 1.75x, weight 1.5 → ~1.375x

      const workspace_id: string | null = m.workspace_id ?? null;
      let tier: MemoryTier = 'other';
      let workspaceFactor = 1.0;

      if (workspaceId && workspace_id === workspaceId) {
        tier = 'workspace';
        workspaceFactor = 1.3;
      } else if (!workspace_id) {
        tier = 'anchor';
        workspaceFactor = 1.15;
      } else {
        tier = 'other';
        workspaceFactor = 0.9;
      }

      const score = similarity * recencyFactor * importanceFactor * workspaceFactor;

      return {
        id: m.id as string,
        user_key: m.user_key as string,
        content: m.content as string,
        purpose: (m.kind as MemoryPurpose) ?? 'fact',
        similarity,
        workspace_id,
        weight: rawWeight,
        created_at,
        tier,
        score,
      } as MemorySearchHit;
    })
    .filter((x): x is MemorySearchHit => x !== null);

  if (!hits.length) return [];

  // 3) Sort by composite score (desc), tie-break by similarity
  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.similarity - a.similarity;
  });

  // 4) Return top-k
  return hits.slice(0, k);
}
