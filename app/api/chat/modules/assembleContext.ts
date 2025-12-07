// app/api/chat/modules/assembleContext.ts

import { supabaseEdge } from "@/lib/supabase/edge";
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

function lightTrigger(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("remember") ||
    m.includes("what do you know") ||
    m.includes("last time") ||
    m.includes("my past") ||
    m.includes("autobiography") ||
    m.includes("life story")
  );
}

// ------------------------------------------------------------
// PERSONA
// ------------------------------------------------------------
async function loadPersona(): Promise<string> {
  const { data } = await supabaseEdge
    .from("personas")
    .select("name")
    .eq("is_default", true)
    .maybeSingle();

  return data?.name || "Solace";
}

// ------------------------------------------------------------
// USER FACTUAL MEMORIES (ALWAYS LOADED)
// ------------------------------------------------------------
async function loadFacts(userKey: string) {
  const { data } = await supabaseEdge
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return safe(data);
}

// ------------------------------------------------------------
// EPISODIC MEMORY
// ------------------------------------------------------------
async function loadEpisodic(userKey: string) {
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

// ------------------------------------------------------------
// AUTOBIO
// ------------------------------------------------------------
async function loadAutobiography(userKey: string) {
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

// ------------------------------------------------------------
// NEWS
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// RESEARCH
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// MAIN CONTEXT ASSEMBLY
// ------------------------------------------------------------
export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  userMessage: string
) {
  const persona = await loadPersona();

  // Always load factual memory
  const facts = await loadFacts(userKey);

  // Light heuristic: episodic + autobio load only when needed
  const deepMemoryNeeded = lightTrigger(userMessage);

  const episodes = deepMemoryNeeded ? await loadEpisodic(userKey) : [];
  const autobiography = deepMemoryNeeded
    ? await loadAutobiography(userKey)
    : { chapters: [], entries: [] };

  const newsDigest = await loadNewsDigest(userKey);
  const researchContext = await loadResearch(userKey);

  return {
    persona,
    memoryPack: {
      facts,
      episodes,
      autobiography,
    },
    newsDigest,
    researchContext,
  };
}


