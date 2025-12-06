// app/api/chat/modules/assembleContext.ts

import { createClient } from "@supabase/supabase-js";
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// PERSONA -----------------------------------------------------
async function loadPersona(): Promise<string> {
  const { data } = await supabase
    .from("personas")
    .select("*")
    .eq("is_default", true)
    .limit(1);

  return data?.[0]?.name || "Solace";
}

// USER MEMORIES ----------------------------------------------
async function loadUserMemories(userKey: string) {
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return safeRows(data);
}

// EPISODIC ----------------------------------------------------
async function loadEpisodic(userKey: string) {
  const { data: episodes } = await supabase
    .from("episodic_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  const epList = safeRows(episodes);
  if (epList.length === 0) return [];

  const { data: chunks } = await supabase
    .from("memory_episode_chunks")
    .select("*")
    .in(
      "episode_id",
      epList.map((e) => e.id)
    )
    .order("seq", { ascending: true });

  const chunkList = safeRows(chunks);

  return epList.map((e) => ({
    ...e,
    chunks: chunkList.filter((c) => c.episode_id === e.id),
  }));
}

// AUTOBIO -----------------------------------------------------
async function loadAutobiography(userKey: string) {
  const { data: chapters } = await supabase
    .from("user_autobio_chapters")
    .select("*")
    .eq("user_key", userKey)
    .order("start_year", { ascending: true });

  const { data: entries } = await supabase
    .from("user_autobiography")
    .select("*")
    .eq("user_key", userKey)
    .order("year", { ascending: true });

  return {
    chapters: safeRows(chapters),
    entries: safeRows(entries),
  };
}

// NEWS --------------------------------------------------------
async function loadNewsDigest(userKey: string) {
  if (!ENABLE_NEWS) return [];

  const { data } = await supabase
    .from("vw_solace_news_digest")
    .select("*")
    .eq("user_key", userKey)
    .order("scored_at", { ascending: false })
    .limit(15);

  return safeRows(data);
}

// RESEARCH ----------------------------------------------------
async function loadResearch(userKey: string) {
  if (!ENABLE_RESEARCH) return [];

  const { data } = await supabase
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  return safeRows(data);
}

// MAIN EXPORT -------------------------------------------------
export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  userMessage: string
) {
  const persona = await loadPersona();

  const memory = await loadUserMemories(userKey);
  const episodic = await loadEpisodic(userKey);
  const autobio = await loadAutobiography(userKey);

  const newsDigest = await loadNewsDigest(userKey);
  const researchContext = await loadResearch(userKey);

  return {
    persona,
    memoryPack: {
      userMemories: memory,
      episodicMemories: episodic,
      autobiography: autobio,
    },
    newsDigest,
    researchContext,
  };
}

