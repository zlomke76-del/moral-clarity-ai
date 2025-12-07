// app/api/chat/modules/assembleContext.ts
//--------------------------------------------------------------

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

function wantsEpisodic(msg: string): boolean {
  return ["remember when", "last time", "recap", "continue"].some((k) =>
    msg.toLowerCase().includes(k)
  );
}

function wantsAutobio(msg: string): boolean {
  return ["my past", "autobiography", "childhood", "life story"].some((k) =>
    msg.toLowerCase().includes(k)
  );
}

// Always return persona "Solace"
async function loadPersona(): Promise<string> {
  return "Solace";
}

async function loadUserMemories(userKey: string) {
  const { data } = await supabaseEdge
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return safe(data);
}

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

async function loadAutobio(userKey: string, enable: boolean) {
  if (!enable) return { chapters: [], entries: [] };

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

export async function assembleContext(
  userKey: string,
  workspaceId: string | null,
  message: string
) {
  const episodicNeeded = wantsEpisodic(message);
  const autobioNeeded = wantsAutobio(message);

  console.log("[Solace Context] Load decisions:", {
    canonicalUserKey: userKey,
    episodicNeeded,
    autobioNeeded,
    workspaceId,
  });

  return {
    persona: await loadPersona(),
    memoryPack: {
      userMemories: await loadUserMemories(userKey),
      episodicMemories: await loadEpisodic(userKey, episodicNeeded),
      autobiography: await loadAutobio(userKey, autobioNeeded),
    },
    newsDigest: await loadNewsDigest(userKey),
    researchContext: await loadResearch(userKey),
  };
}

