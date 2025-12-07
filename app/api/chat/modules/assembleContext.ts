// app/api/chat/modules/assembleContext.ts
// -------------------------------------------------------------
// Solace Context Assembler
// Canonical user identity → memory pack → persona identity (code only)
// -------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

// -------------------------------------------------------------
// SAFE ARRAY HELPER
// -------------------------------------------------------------
function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// -------------------------------------------------------------
// MEMORY TRIGGERS
// -------------------------------------------------------------
function needsEpisodic(message: string): boolean {
  return [
    "remember when",
    "last time",
    "earlier you said",
    "continue the story",
    "what happened yesterday",
    "recap",
    "episode",
    "thread",
  ].some((k) => message.toLowerCase().includes(k));
}

function needsAutobio(message: string): boolean {
  return [
    "my past",
    "my childhood",
    "life story",
    "my history",
    "journey",
    "autobiography",
    "who am i",
    "identity",
  ].some((k) => message.toLowerCase().includes(k));
}

// -------------------------------------------------------------
// LOAD USER MEMORIES
// -------------------------------------------------------------
async function loadUserFacts(canonicalKey: string) {
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
// RESEARCH FACTS
// -------------------------------------------------------------
async function loadResearchFacts(canonicalKey: string) {
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
// MAIN ASSEMBLER
// -------------------------------------------------------------
export async function assembleContext(
  overrideUserKey: string | null,
  workspaceId: string | null,
  userMessage: string
) {
  // ----------------------------
  // CANONICAL USER IDENTITY
  // ----------------------------
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

  // ----------------------------
  // LOAD ALL MEMORY COMPONENTS
  // ----------------------------
  const userMemories = await loadUserFacts(canonicalKey);
  const episodicMemories = await loadEpisodic(canonicalKey, episodicNeeded);
  const autobiography = await loadAutobiography(canonicalKey, autobioNeeded);
  const newsDigest = await loadNewsDigest(canonicalKey);
  const researchContext = await loadResearchFacts(canonicalKey);

  // ----------------------------
  // FINAL CONTEXT (persona comes from code, not DB)
  // ----------------------------
  return {
    canonicalUserKey: canonicalKey,
    memoryPack: {
      userMemories,
      episodicMemories,
      autobiography,
    },
    newsDigest,
    researchContext,
    persona: "Solace", // locked identity — code only
  };
}

