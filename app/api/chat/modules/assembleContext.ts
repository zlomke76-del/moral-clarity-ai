// app/api/chat/modules/assembleContext.ts

import { supabaseEdge } from "@/lib/supabase/edge";
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

/* -----------------------------------------------------------
   PERSONA
----------------------------------------------------------- */
async function loadPersona(): Promise<string> {
  const { data } = await supabaseEdge
    .from("personas")
    .select("*")
    .eq("is_default", true)
    .limit(1);

  return data?.[0]?.name || "Solace";
}

/* -----------------------------------------------------------
   USER MEMORIES
----------------------------------------------------------- */
async function loadUserMemories(userKey: string) {
  const { data } = await supabaseEdge
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return safeRows(data);
}

/* -----------------------------------------------------------
   EPISODIC
----------------------------------------------------------- */
async function loadEpisodic(userKey: string) {
  const { data: episodes } = await supabaseEdge
    .from("episodic_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  const epList = safeRows(episodes);
  if (epList.length === 0) return [];

  const { data: chunks } = await supabaseEdge
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

/* -----------------------------------------------------------
   AUTOBIOGRAPHY
----------------------------------------------------------- */
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
    chapters: safeRows(chapters),
    entries: safeRows(entries),
  };
}

/* -----------------------------------------------------------
   NEWS — CONDITIONAL
----------------------------------------------------------- */
async function loadNewsDigest(userKey: string) {
  if (!ENABLE_NEWS) return [];

  const { data } = await supabaseEdge
    .from("vw_solace_news_digest")
    .select("*")
    .eq("user_key", userKey)
    .order("scored_at", { ascending: false })
    .limit(15);

  return safeRows(data);
}

/* -----------------------------------------------------------
   RESEARCH — CONDITIONAL
----------------------------------------------------------- */
async function loadResearch(userKey: string) {
  if (!ENABLE_RESEARCH) return [];

  const { data } = await supabaseEdge
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  return safeRows(data);
}

/* -----------------------------------------------------------
   MAIN EXPORT — CONTEXT ASSEMBLER
----------------------------------------------------------- */
export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  userMessage: string
) {
  /* ---------------------------------------------
     Determine if we should load NEWS/RESEARCH
  --------------------------------------------- */

  const lower = userMessage.toLowerCase();

  const shouldLoadNews =
    (ENABLE_NEWS &&
      (
        lower.includes("news") ||
        lower.includes("headline") ||
        lower.includes("story") ||
        lower.includes("digest") ||
        lower.includes("neutrality") ||
        workspaceId === "newsroom"
      )) ||
    false;

  const shouldLoadResearch =
    ENABLE_RESEARCH &&
    (
      lower.includes("research") ||
      lower.includes("find") ||
      lower.includes("lookup") ||
      lower.includes("investigate")
    );

  /* ---------------------------------------------
     Load required memory domains in parallel
  --------------------------------------------- */

  const [
    persona,
    memory,
    episodic,
    autobio,
    newsDigest,
    researchContext,
  ] = await Promise.all([
    loadPersona(),
    loadUserMemories(userKey),
    loadEpisodic(userKey),
    loadAutobiography(userKey),
    shouldLoadNews ? loadNewsDigest(userKey) : Promise.resolve([]),
    shouldLoadResearch ? loadResearch(userKey) : Promise.resolve([]),
  ]);

  /* ---------------------------------------------
     Final Context Object
  --------------------------------------------- */
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
