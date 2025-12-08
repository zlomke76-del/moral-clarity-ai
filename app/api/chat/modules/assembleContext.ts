// app/api/chat/modules/assembleContext.ts
// ------------------------------------------------------------
// Solace Context Loader (CLEAN FIX VERSION)
// Only loads: facts, episodic, autobio
// NewsDigest + Research are DISABLED unless explicitly requested.
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
// MEMORY LOADERS (facts, episodic, autobio)
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

// ------------------------------------------------------------
// *** NEWS + TRUTH DISABLED BY DEFAULT ***
// These should ONLY be enabled in Newsroom routes.
// Returning [] prevents call errors + prevents unnecessary loads.
// ------------------------------------------------------------

async function loadNewsDigest(_: string) {
  return [];
}

async function loadResearch(_: string) {
  return [];
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

  // NEWS + TRUTH REMOVED FROM DEFAULT CHAT CONTEXT
  const [facts, episodic, autobiography] = await Promise.all([
    loadFacts(userKey),
    loadEpisodic(userKey),
    loadAutobio(userKey),
  ]);

  return {
    persona,
    memoryPack: {
      facts,
      episodic,
      autobiography,
    },
    newsDigest: [],       // intentionally disabled
    researchContext: [],  // intentionally disabled
  };
}

