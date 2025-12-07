// app/api/chat/modules/assembleContext.ts
// -------------------------------------------------------------
// Context assembly: persona + memories + news + research
// Memory identity (canonical email) is handled in route.ts
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
    "episode",
    "story",
    "continue",
    "recap",
  ].some((k) => message.toLowerCase().includes(k));
}

function needsAutobio(message: string): boolean {
  return [
    "my past",
    "my childhood",
    "life story",
    "who am i",
    "identity",
    "journey",
    "autobiography",
  ].some((k) => message.toLowerCase().includes(k));
}

// -------------------------------------------------------------
// PERSONA
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
// USER MEMORIES (always loaded)
// -------------------------------------------------------------
async function loadUserMemories(userKey: string) {
  const { data } = await supabaseEdge
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return safe(data);
}

// -------------------------------------------------------------
// EPISODIC MEMORY (conditional)
// -------------------------------------------------------------
async function loadEpisodic(userKey: string, enable: boolean) {
  if (!enable) return [];

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
// AUTOBIOGRAPHY (conditional)
// -------------------------------------------------------------
async function loadAutobiography(userKey: string, enable: boolean) {
  if (!enable) {
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
  if (!ENABLE_NEWS) return [];

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
  if (!ENABLE_RESEARCH) return [];

  const { data } = await supabaseEdge
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  return safe(data);
}

// -------------------------------------------------------------
// MAIN EXPORT
// -------------------------------------------------------------
export async function assembleContext(
  userKey: string,           // ← canonicalKey passed in from route.ts
  workspaceId: string | null,
  userMessage: string
) {
  const episodicNeeded = needsEpisodic(userMessage);
  const autobioNeeded = needsAutobio(userMessage);

  const persona = await loadPersona();
  const userMemories = await loadUserMemories(userKey);
  const episodicMemories = await loadEpisodic(userKey, episodicNeeded);
  const autobiography = await loadAutobiography(userKey, autobioNeeded);
  const newsDigest = await loadNewsDigest(userKey);
  const researchContext = await loadResearch(userKey);

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

