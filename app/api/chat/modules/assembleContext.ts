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

function rowsSafe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

async function loadPersona() {
  const { data } = await supabase
    .from("personas")
    .select("*")
    .eq("is_default", true)
    .limit(1);

  return data?.[0]?.name || "Solace";
}

function formatMemoryRecord(m: any) {
  return {
    id: m.id,
    kind: m.kind,
    title: m.title,
    content: m.content,
    importance: m.importance,
    tags: m.tags,
  };
}

async function loadFacts(userKey: string) {
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .eq("kind", "fact")
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return rowsSafe(data).map(formatMemoryRecord);
}

async function loadEpisodes(userKey: string) {
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .eq("kind", "episode")
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  return rowsSafe(data).map(formatMemoryRecord);
}

export async function assembleContext(userKey: string) {
  const persona = await loadPersona();
  const facts = await loadFacts(userKey);
  const episodes = await loadEpisodes(userKey);

  return {
    persona,
    memoryPack: {
      facts,
      episodes,
    },
    newsDigest: [],
    researchContext: [],
  };
}

