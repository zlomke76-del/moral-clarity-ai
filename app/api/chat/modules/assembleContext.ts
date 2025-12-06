// app/api/chat/modules/assembleContext.ts

import { createClient } from "@supabase/supabase-js";
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

/**
 * Edge-safe Supabase client using ROLE KEY
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,   // ✅ correct key for Edge
  { auth: { persistSession: false } }
);

function rowsSafe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

/**
 * Load persona (fallback to Solace)
 */
async function loadPersona(workspaceId: string | null) {
  const { data } = await supabase
    .from("personas")
    .select("*")
    .eq("is_default", true)
    .limit(1);

  if (data && data.length > 0) return data[0].name || "Solace";
  return "Solace";
}

/**
 * Format expanded memory record
 */
function formatMemoryRecord(m: any) {
  return {
    id: m.id,
    kind: m.kind,
    title: m.title,
    content: m.content,
    weight: m.weight,
    importance: m.importance,
    tags: m.tags,
    // episodic fields
    episodic_type: m.episodic_type,
    episode_summary: m.episode_summary,
    story_excerpt: m.story_excerpt,
    // autobiographical hints
    origin: m.origin,
    source_channel: m.source_channel,
    year: m.year,
    autobioera: m.autobioera,
  };
}

/**
 * Load user_memories (factual memories)
 */
async function loadUserMemories(userKey: string) {
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return rowsSafe(data).map(formatMemoryRecord);
}

/**
 * Load episodic memories + chunks
 */
async function loadEpisodic(userKey: string) {
  const { data: episodes } = await supabase
    .from("episodic_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  const epList = rowsSafe(episodes);
  if (epList.length === 0) return [];

  const ids = epList.map((e) => e.id);

  const { data: chunks } = await supabase
    .from("memory_episode_chunks")
    .select("*")
    .in("episode_id", ids)
    .order("seq", { ascending: true });

  const chunkList = rowsSafe(chunks);

  return epList.map((ep) => ({
    ...ep,
    chunks: chunkList.filter((c) => c.episode_id === ep.id),
  }));
}

/**
 * Load autobiography (chapters + entries)
 */
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
    chapters: rowsSafe(chapters),
    entries: rowsSafe(entries),
  };
}

/**
 * Load news digest
 */
async function loadNewsDigest(userKey: string) {
  if (!ENABLE_NEWS) return [];

  const { data } = await supabase
    .from("vw_solace_news_digest")
    .select("*")
    .eq("user_key", userKey)
    .order("scored_at", { ascending: false })
    .limit(15);

  return rowsSafe(data);
}

/**
 * Load research facts
 */
async function loadResearch(userKey: string) {
  if (!ENABLE_RESEARCH) return [];

  const { data } = await supabase
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  return rowsSafe(data);
}

/**
 * MAIN — assembleContext
 */
export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  userMessage: string
) {
  const persona = await loadPersona(workspaceId);

  const userMemories = await loadUserMemories(userKey);
  const episodicMemories = await loadEpisodic(userKey);
  const autobiography = await loadAutobiography(userKey);

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

