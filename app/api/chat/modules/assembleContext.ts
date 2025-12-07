// app/api/chat/modules/assembleContext.ts
// -------------------------------------------------------------
// Solace Context Loader — persona + memory + news + research
// This version FIXES all user_key mismatch problems.
// -------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

// -------------------------------------------------------------
// UTILITIES
// -------------------------------------------------------------
function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

function needsEpisodic(message: string): boolean {
  return [
    "remember when",
    "last time",
    "earlier you said",
    "continue the story",
    "what happened",
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
// PERSONA (default Solace persona from DB)
// -------------------------------------------------------------
async function loadPersona(): Promise<string> {
  const { data } = await supabaseEdge
    .from("personas")
    .select("name")
    .eq("is_default", true)
    .maybeSingle();

  return data?.name || "Solace";
}

// -------------------------------------------------------------
// USER MEMORY — ALWAYS LOADS
// -------------------------------------------------------------
async function loadUserMemories(userKey: string) {
  if (!userKey || userKey === "guest") return [];

  const { data } = await supabaseEdge
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return safe(data);
}

// -------------------------------------------------------------
// EPISODIC MEMORY
// -------------------------------------------------------------
async function loadEpisodic(userKey: string, enable: boolean) {
  if (!enable || !userKey || userKey === "guest") return [];

  const { data: episodes } = await supabaseEdge
    .from("episodic_memories")
    .select("*")
    .eq("user_key", userKey)
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
async function loadAutobiography(userKey: string, enable: boolean) {
  if (!enable || !userKey || userKey === "guest") {
    return { chapters: [], entries: [] };
  }

  const { data: chapters } = await supabaseEdge
    .from("user_autobio_chapters")
    .select("*")
    .eq("user_key", userKey)
    .order("start_year", { ascending: true });

  const { data: entries } = await supabaseEdge
    .from("user_autobiography")
    .select("*")
    .eq("user_key", userKey)
    .order("year", { ascending: true });

  return {
    chapters: safe(chapters),
    entries: safe(entries),
  };
}

// -------------------------------------------------------------
// NEWS DIGEST
// -------------------------------------------------------------
async function loadNewsDigest(userKey: string) {
  if (!ENABLE_NEWS || !userKey || userKey === "guest") return [];

  const { data } = await supabaseEdge
    .from("vw_solace_news_digest")
    .select("*")
    .eq("user_key", userKey)
    .order("scored_at", { ascending: false })
    .limit(15);

  return safe(data);
}

// -------------------------------------------------------------
// RESEARCH CONTEXT
// -------------------------------------------------------------
async function loadResearch(userKey: string) {
  if (!ENABLE_RESEARCH || !userKey || userKey === "guest") return [];

  const { data } = await supabaseEdge
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  return safe(data);
}

// -------------------------------------------------------------
// MAIN CONTEXT ASSEMBLY — FIXED VERSION
// -------------------------------------------------------------
export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  userMessage: string
) {
  // The identity used to **load** memory must match the identity used to **write** memory.
  const canonicalUserKey = userKey && userKey !== "guest" ? userKey : null;

  const episodicNeeded = needsEpisodic(userMessage);
  const autobioNeeded = needsAutobio(userMessage);

  console.log("[Solace Context] Load decisions:", {
    canonicalUserKey,
    episodicNeeded,
    autobioNeeded,
    workspaceId,
  });

  const persona = await loadPersona();

  const userMemories = await loadUserMemories(canonicalUserKey!);
  const episodicMemories = await loadEpisodic(canonicalUserKey!, episodicNeeded);
  const autobiography = await loadAutobiography(
    canonicalUserKey!,
    autobioNeeded
  );
  const newsDigest = await loadNewsDigest(canonicalUserKey!);
  const researchContext = await loadResearch(canonicalUserKey!);

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

