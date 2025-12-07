// app/api/chat/modules/assembleContext.ts
// -----------------------------------------------------------------------------
// CENTRAL MEMORY LOADER FOR SOLACE
// Reads from:
//   • user_memories
//   • episodic_memories + memory_episode_chunks
//   • user_autobio_chapters + user_autobiography
//   • vw_solace_news_digest
//   • truth_facts (research only when enabled)
// All keyed by canonical_user_key (email)
// -----------------------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

// -------------------------------------------------------------
// Utilities
// -------------------------------------------------------------
function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

function needsEpisodic(message: string): boolean {
  return [
    "remember when",
    "last time",
    "you said",
    "story",
    "episode",
    "thread",
    "continue",
  ].some((k) => message.toLowerCase().includes(k));
}

function needsAutobio(message: string): boolean {
  return [
    "my past",
    "my history",
    "my childhood",
    "my autobiography",
    "who am i",
    "life story",
  ].some((k) => message.toLowerCase().includes(k));
}

// -------------------------------------------------------------
// USER MEMORIES (facts, task-state, short form)
// -------------------------------------------------------------
async function loadUserMemories(canonicalKey: string) {
  const { data } = await supabaseEdge
    .from("user_memories")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return safe(data);
}

// -------------------------------------------------------------
// EPISODIC MEMORY
// -------------------------------------------------------------
async function loadEpisodic(canonicalKey: string, enable: boolean) {
  if (!enable) return [];

  const { data: episodes } = await supabaseEdge
    .from("episodic_memories")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  const epList = safe(episodes);
  if (epList.length === 0) return [];

  const { data: chunks } = await supabaseEdge
    .from("memory_episode_chunks")
    .select("*")
    .in(
      "episode_id",
      epList.map((e) => e.id)
    )
    .order("seq", { ascending: true });

  const chunkList = safe(chunks);

  return epList.map((e) => ({
    ...e,
    chunks: chunkList.filter((c) => c.episode_id === e.id),
  }));
}

// -------------------------------------------------------------
// AUTOBIOGRAPHY
// -------------------------------------------------------------
async function loadAutobiography(canonicalKey: string, enable: boolean) {
  if (!enable) {
    return { chapters: [], entries: [] };
  }

  const { data: chapters } = await supabaseEdge
    .from("user_autobio_chapters")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("start_year", { ascending: true });

  const { data: entries } = await supabaseEdge
    .from("user_autobiography")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("year", { ascending: true });

  return {
    chapters: safe(chapters),
    entries: safe(entries),
  };
}

// -------------------------------------------------------------
// NEWS DIGEST
// -------------------------------------------------------------
async function loadNewsDigest(canonicalKey: string) {
  if (!ENABLE_NEWS) return [];

  const { data } = await supabaseEdge
    .from("vw_solace_news_digest")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("scored_at", { ascending: false })
    .limit(15);

  return safe(data);
}

// -------------------------------------------------------------
// RESEARCH CONTEXT
// -------------------------------------------------------------
async function loadResearch(canonicalKey: string) {
  if (!ENABLE_RESEARCH) return [];

  const { data } = await supabaseEdge
    .from("truth_facts")
    .select("*")
    .eq("canonical_user_key", canonicalKey)
    .order("created_at", { ascending: false })
    .limit(10);

  return safe(data);
}

// -------------------------------------------------------------
// MAIN CONTEXT ASSEMBLY
// -------------------------------------------------------------
export async function assembleContext(
  overrideUserKey: string | null,
  workspaceId: string | null,
  userMessage: string
) {
  // 1) Resolve canonical identity via the user's email
  const authIdentity = await getCanonicalUserKey();
  const canonicalKey = overrideUserKey || authIdentity.canonicalKey;

  const episodicNeeded = needsEpisodic(userMessage);
  const autobioNeeded = needsAutobio(userMessage);

  console.log("[Solace Context] Load decisions:", {
    canonicalUserKey: canonicalKey,
    episodicNeeded,
    autobioNeeded,
    workspaceId,
  });

  // 2) Load from Supabase
  const userMemories = await loadUserMemories(canonicalKey);
  const episodicMemories = await loadEpisodic(canonicalKey, episodicNeeded);
  const autobiography = await loadAutobiography(canonicalKey, autobioNeeded);
  const newsDigest = await loadNewsDigest(canonicalKey);
  const researchContext = await loadResearch(canonicalKey);

  // 3) Persona is no longer loaded from Supabase — always Solace
  const persona = "Solace";

  // 4) Return unified structure
  return {
    persona,
    memoryPack: {
      userMemories,
      episodicMemories,
      autobiography,
    },
    newsDigest,
    researchContext,
  };
}

