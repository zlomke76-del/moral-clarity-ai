// modules/assembleContext.ts

import { createClient } from "@supabase/supabase-js";
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
} from "./constants";

/* ---------------------------------------------------------
   Supabase Client (Edge-friendly)
--------------------------------------------------------- */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

function rowsSafe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

/* ---------------------------------------------------------
   Load Persona
--------------------------------------------------------- */
async function loadPersona(workspaceId: string | null) {
  const { data } = await supabase
    .from("personas")
    .select("*")
    .eq("is_default", true)
    .limit(1);

  if (data?.length > 0) {
    return data[0].name || "Solace";
  }
  return "Solace";
}

/* ---------------------------------------------------------
   Format memory records into natural language
--------------------------------------------------------- */
function summarizeMemory(memoryPack: any): string {
  if (!memoryPack) return "none";

  const lines: string[] = [];

  // basic user memories
  for (const m of memoryPack.userMemories || []) {
    if (m.title && m.content) {
      lines.push(`• ${m.title}: ${m.content}`);
    }
  }

  // episodic memories
  for (const ep of memoryPack.episodicMemories || []) {
    const summary =
      ep.episode_summary ||
      ep.story_excerpt ||
      ep.title ||
      "(episode)";
    lines.push(`• Episode: ${summary}`);
  }

  // autobiography chapters
  for (const ch of memoryPack.autobiography?.chapters || []) {
    const label =
      ch.summary ||
      ch.title ||
      `Life chapter ${ch.start_year || ""}-${ch.end_year || ""}`;
    lines.push(`• ${label}`);
  }

  return lines.length ? lines.join("\n") : "none";
}

/* ---------------------------------------------------------
   Load User Memories
--------------------------------------------------------- */
async function loadUserMemories(userKey: string) {
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return rowsSafe(data);
}

/* ---------------------------------------------------------
   Load Episodic Memories
--------------------------------------------------------- */
async function loadEpisodic(userKey: string) {
  const { data: episodes } = await supabase
    .from("episodic_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  const epList = rowsSafe(episodes);

  if (epList.length === 0) return [];

  const epIds = epList.map((e) => e.id);

  const { data: chunks } = await supabase
    .from("memory_episode_chunks")
    .select("*")
    .in("episode_id", epIds)
    .order("seq");

  const chunkList = rowsSafe(chunks);

  return epList.map((ep) => ({
    ...ep,
    chunks: chunkList.filter((c) => c.episode_id === ep.id),
  }));
}

/* ---------------------------------------------------------
   Load Autobiography
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   Load News Digest
--------------------------------------------------------- */
async function loadNewsDigest(userKey: string) {
  if (!ENABLE_NEWS) return "none";

  const { data } = await supabase
    .from("vw_solace_news_digest")
    .select("*")
    .eq("user_key", userKey)
    .order("scored_at", { ascending: false })
    .limit(10);

  const rows = rowsSafe(data);
  if (rows.length === 0) return "none";

  return rows.map((n) => `• ${n.title}`).join("\n");
}

/* ---------------------------------------------------------
   Load Research
--------------------------------------------------------- */
async function loadResearch(userKey: string) {
  if (!ENABLE_RESEARCH) return "none";

  const { data } = await supabase
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  const rows = rowsSafe(data);
  if (rows.length === 0) return "none";

  return rows.map((r) => `• ${r.fact}`).join("\n");
}

/* ---------------------------------------------------------
   MAIN — assembleContext
--------------------------------------------------------- */
export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  userMessage: string
) {
  const persona = await loadPersona(workspaceId);

  const memory = await loadUserMemories(userKey);
  const episodic = await loadEpisodic(userKey);
  const autobio = await loadAutobiography(userKey);

  const newsDigest = await loadNewsDigest(userKey);
  const researchContext = await loadResearch(userKey);

  // Summarize memory into natural, readable text
  const memoryPack = summarizeMemory({
    userMemories: memory,
    episodicMemories: episodic,
    autobiography: autobio,
  });

  return {
    persona,
    memoryPack,      // <-- readable, model-friendly
    newsDigest,
    researchContext,
  };
}

