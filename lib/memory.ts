// lib/memory.ts
// Phase 4 — Ethical Memory Engine Integration

import { createClient } from "@supabase/supabase-js";
import {
  analyzeMemoryWrite,
  rankMemories,
} from "./memory-intelligence";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type MemoryPurpose =
  | "identity"
  | "value"
  | "insight"
  | "fact"
  | "preference"
  | "context"
  | "episode"
  | "note";

/* ============================================================
   HELPER — Fetch recent memories (for drift & consolidation)
   ============================================================ */
async function fetchRecentMemories(user_key: string, limit = 20) {
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}

/* ============================================================
   WRITE MEMORY — Full Ethical Pipeline
   ============================================================ */

export async function remember({
  user_key,
  content,
  title = null,
  workspace_id = null,
}: {
  user_key: string;
  content: string;
  title?: string | null;
  workspace_id?: string | null;
}) {
  // 1. Get recent memories for drift & context analysis
  const recent = await fetchRecentMemories(user_key, 20);

  // 2. Full multi-stage intelligence evaluation
  const evaluation = await analyzeMemoryWrite(content, recent);

  const {
    classification,
    lifecycle,
    oversight,
  } = evaluation;

  // 3. If not allowed, do not store
  if (!oversight.allowed || !oversight.store) {
    return {
      stored: false,
      reason: "blocked_by_oversight",
      classification,
    };
  }

  // 4. Determine final "kind"
  const finalKind: MemoryPurpose = oversight.finalKind as MemoryPurpose;

  // 5. Insert memory
  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      title,
      content,
      kind: finalKind,
      importance: lifecycle.promoteToFact ? 5 : 3,
      emotional_weight: classification.emotional,
      sensitivity_score: classification.sensitivity,
      workspace_id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    stored: true,
    memory: data,
    classification,
    lifecycle,
    oversight,
  };
}

/* ============================================================
   SEARCH — Keyword + Ranked Recall
   ============================================================ */
export async function searchMemories(user_key: string, query: string) {
  const { data, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key);

  if (error || !data) return [];

  const matches = data.filter(m =>
    m.content.toLowerCase().includes(query.toLowerCase())
  );

  return rankMemories(matches);
}

/* ============================================================
   MEMORY PACK — For Solace system prompt
   ============================================================ */

export async function getMemoryPack(
  user_key: string,
  query: string,
  opts: { factsLimit: number; episodesLimit: number }
) {
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key);

  if (!data) return { facts: [], episodes: [] };

  const ranked = rankMemories(data);

  const facts = ranked
    .filter(m => m.kind === "fact" || m.kind === "identity" || m.kind === "value")
    .slice(0, opts.factsLimit);

  const episodes = ranked
    .filter(m => m.kind === "episode")
    .slice(0, opts.episodesLimit);

  return { facts, episodes };
}

/* ============================================================
   OPTIONAL — Store episode (chat transcript bundle)
   ============================================================ */
export async function maybeStoreEpisode(
  user_key: string,
  content: string,
  shouldStore: boolean
) {
  if (!shouldStore) return;

  await supabase.from("user_memories").insert({
    user_key,
    title: "Chat Episode",
    content,
    kind: "episode",
    importance: 2,
    emotional_weight: 0,
    sensitivity_score: 1,
  });
}


