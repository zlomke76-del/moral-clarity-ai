// app/api/chat/modules/assembleContext.ts

import { supabaseNode } from "@/lib/supabase/node"; // IMPORTANT
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// PERSONA -----------------------------------------------------
async function loadPersona(sb: any): Promise<string> {
  const { data } = await sb
    .from("personas")
    .select("name")
    .eq("is_default", true)
    .limit(1);

  return data?.[0]?.name || "Solace";
}

// USER MEMORIES ----------------------------------------------
async function loadUserMemories(sb: any, userKey: string) {
  const { data } = await sb
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return safeRows(data);
}

// EPISODIC ----------------------------------------------------
async function loadEpisodic(sb: any, userKey: string) {
  const { data: episodes } = await sb
    .from("episodic_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  const epList = safeRows(episodes);
  if (epList.length === 0) return [];

  const ids = epList.map((e) => e.id);

  const { data: chunks } = await sb
    .from("memory_episode_chunks")
    .select("*")
    .in("episode_id", ids.length ? ids : ["_NOOP_"]) // avoids hanging
    .order("seq", { ascending: true });

  const chunkList = safeRows(chunks);

  return epList.map((e) => ({
    ...e,
    chunks: chunkList.filter((c) => c.episode_id === e.id),
  }));
}

// AUTOBIO -----------------------------------------------------
async function loadAutobiography(sb: any, userKey: string) {
  const [chaptersRes, entriesRes] = await Promise.all([
    sb
      .from("user_autobio_chapters")
      .select("*")
      .eq("user_key", userKey)
      .order("start_year", { ascending: true }),

    sb
      .from("user_autobiography")
      .select("*")
      .eq("user_key", userKey)
      .order("year", { ascending: true }),
  ]);

  return {
    chapters: safeRows(chaptersRes.data),
    entries: safeRows(entriesRes.data),
  };
}

// NEWS --------------------------------------------------------
async function loadNewsDigest(sb: any, userKey: string) {
  if (!ENABLE_NEWS) return [];

  const { data } = await sb
    .from("vw_solace_news_digest")
    .select("*")
    .eq("user_key", userKey)
    .order("scored_at", { ascending: false })
    .limit(15);

  return safeRows(data);
}

// RESEARCH ----------------------------------------------------
async function loadResearch(sb: any, userKey: string) {
  if (!ENABLE_RESEARCH) return [];

  const { data } = await sb
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
  const sb = supabaseNode(); // NOT edge

  // run everything concurrently
  const [
    persona,
    memory,
    episodic,
    autobio,
    newsDigest,
    researchContext,
  ] = await Promise.all([
    loadPersona(sb),
    loadUserMemories(sb, userKey),
    loadEpisodic(sb, userKey),
    loadAutobiography(sb, userKey),
    loadNewsDigest(sb, userKey),
    loadResearch(sb, userKey),
  ]);

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
