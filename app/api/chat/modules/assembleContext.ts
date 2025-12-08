// app/api/chat/modules/assembleContext.ts
// ------------------------------------------------------------
// Solace Context Loader (FINAL VERSION)
// Reads ALL memory exclusively from mv_unified_memory
// Episodic + chunks reconstructed from materialized view
// Autobio extracted from unified memory as well
// ------------------------------------------------------------

import { createClientEdge } from "@/lib/supabase/edge";
import { FACTS_LIMIT, EPISODES_LIMIT } from "./constants";

export type SolaceContextBundle = {
  persona: string;
  memoryPack: {
    facts: any[];
    episodic: any[];
    autobiography: any[];
  };
  newsDigest: any[];
  researchContext: any[];
};

// ------------------------------------------------------------
// UTIL
// ------------------------------------------------------------
function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

const STATIC_PERSONA_NAME = "Solace";

// ------------------------------------------------------------
// MEMORY LOADERS — each creates its own Edge Supabase client
// ------------------------------------------------------------

// FACTS -------------------------------------------------------
async function loadFacts(userKey: string) {
  const supabase = createClientEdge();

  const { data, error } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "fact")
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  if (error) {
    console.error("[assembleContext] facts error:", error);
    return [];
  }

  return safe(data);
}

// EPISODIC ----------------------------------------------------
async function loadEpisodic(userKey: string) {
  const supabase = createClientEdge();

  const { data, error } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "episodic")
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  if (error) {
    console.error("[assembleContext] episodic error:", error);
    return [];
  }

  const episodes = safe(data);
  if (episodes.length === 0) return [];

  const episodeIds = episodes.map((e: any) => e.id);

  const { data: chunkRows, error: chunkErr } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "chunk")
    .in("episode_id", episodeIds)
    .order("seq", { ascending: true });

  if (chunkErr) {
    console.error("[assembleContext] episodic chunk error:", chunkErr);
    return episodes.map((e: any) => ({ ...e, chunks: [] }));
  }

  const chunks = safe(chunkRows);

  return episodes.map((ep: any) => ({
    ...ep,
    chunks: chunks.filter((c: any) => c.episode_id === ep.id),
  }));
}

// AUTOBIO -----------------------------------------------------
async function loadAutobio(userKey: string) {
  const supabase = createClientEdge();

  const { data, error } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "autobio_entry")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[assembleContext] autobio error:", error);
    return [];
  }

  return safe(data);
}

// NEWS DIGEST -------------------------------------------------
async function loadNewsDigest(userKey: string) {
  const supabase = createClientEdge();

  const { data, error } = await supabase
    .from("vw_solace_news_digest")
    .select("*")
    .eq("user_key", userKey)
    .order("scored_at", { ascending: false })
    .limit(15);

  if (error) {
    console.error("[assembleContext] news digest error:", error);
    return [];
  }

  return safe(data);
}

// RESEARCH CONTEXT --------------------------------------------
async function loadResearch(userKey: string) {
  const supabase = createClientEdge();

  const { data, error } = await supabase
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("[assembleContext] research error:", error);
    return [];
  }

  return safe(data);
}

// ------------------------------------------------------------
// MAIN EXPORT — assembleContext()
// ------------------------------------------------------------
export async function assembleContext(
  canonicalUserKey: string,
  workspaceId: string | null,
  userMessage: string
): Promise<SolaceContextBundle> {
  const userKey = canonicalUserKey || "guest";

  console.log("[Solace Context] Load with canonical key:", {
    canonicalUserKey: userKey,
    workspaceId,
  });

  const persona = STATIC_PERSONA_NAME;

  const [facts, episodic, autobiography, newsDigest, researchContext] =
    await Promise.all([
      loadFacts(userKey),
      loadEpisodic(userKey),
      loadAutobio(userKey),
      loadNewsDigest(userKey),
      loadResearch(userKey),
    ]);

  return {
    persona,
    memoryPack: {
      facts,
      episodic,
      autobiography,
    },
    newsDigest,
    researchContext,
  };
}
