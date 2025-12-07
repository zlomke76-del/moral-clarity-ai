// app/api/chat/modules/assembleContext.ts
// ------------------------------------------------------------
// Solace Context Loader (FINAL VERSION)
// Reads ALL memory exclusively from mv_unified_memory
// Episodic + Chunks reconstructed from materialized view
// Autobio extracted from unified memory as well
// ------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./constants";

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

// ------------------------------------------------------------
// PERSONA (STATIC — no DB lookup)
// ------------------------------------------------------------
const STATIC_PERSONA_NAME = "Solace";

// ------------------------------------------------------------
// MEMORY LOADERS — unified view
// ------------------------------------------------------------

// FACTS -------------------------------------------------------
async function loadFacts(canonicalKey: string) {
  const { data, error } = await supabaseEdge
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", canonicalKey)
    .eq("memory_type", "fact")
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  if (error) {
    console.error("[assembleContext] facts error:", error);
    return [];
  }

  return safe(data);
}

// EPISODIC ---------------------------------------------------
async function loadEpisodic(canonicalKey: string) {
  const { data, error } = await supabaseEdge
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", canonicalKey)
    .eq("memory_type", "episode")
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  if (error) {
    console.error("[assembleContext] episodic error:", error);
    return [];
  }

  const episodes = safe(data);
  if (episodes.length === 0) return [];

  // Now get all chunks for these episodes
  const episodeIds = episodes.map(e => e.id);

  const { data: chunkRows, error: chunkErr } = await supabaseEdge
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", canonicalKey)
    .eq("memory_type", "chunk")
    .in("episode_id", episodeIds)
    .order("seq", { ascending: true });

  if (chunkErr) {
    console.error("[assembleContext] episodic chunk error:", chunkErr);
    return episodes.map(e => ({ ...e, chunks: [] }));
  }

  const chunks = safe(chunkRows);

  return episodes.map(ep => ({
    ...ep,
    chunks: chunks.filter(c => c.episode_id === ep.id),
  }));
}

// AUTOBIO -----------------------------------------------------
async function loadAutobio(canonicalKey: string) {
  const { data, error } = await supabaseEdge
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", canonicalKey)
    .eq("memory_type", "autobio")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[assembleContext] autobio error:", error);
    return [];
  }

  return safe(data);
}

// NEWS DIGEST -------------------------------------------------
async function loadNewsDigest(canonicalKey: string) {
  const { data } = await supabaseEdge
    .from("vw_solace_news_digest")
    .select("*")
    .eq("user_key", canonicalKey)
    .order("scored_at", { ascending: false })
    .limit(15);

  return safe(data);
}

// RESEARCH CONTEXT --------------------------------------------
async function loadResearch(canonicalKey: string) {
  const { data } = await supabaseEdge
    .from("truth_facts")
    .select("*")
    .eq("user_key", canonicalKey)
    .order("created_at", { ascending: false })
    .limit(10);

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
  console.log("[Solace Context] Load with canonical key:", {
    canonicalUserKey,
    workspaceId,
  });

  // persona is static now
  const persona = STATIC_PERSONA_NAME;

  // unified memory loads
  const facts = await loadFacts(canonicalUserKey);
  const episodic = await loadEpisodic(canonicalUserKey);
  const autobiography = await loadAutobio(canonicalUserKey);

  // conditionally available systems
  const newsDigest = await loadNewsDigest(canonicalUserKey);
  const researchContext = await loadResearch(canonicalUserKey);

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

