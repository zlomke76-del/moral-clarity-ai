// ------------------------------------------------------------
// Solace Context Loader (DIAG VERSION, FIXED NEWS DIGEST TABLE)
// Reads all memory from mv_unified_memory + truth_facts +
// solace_news_digest
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

const STATIC_PERSONA_NAME = "Solace";

function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// ------------------------------------------------------------
// DIAG helper
// ------------------------------------------------------------
function diag(label: string, value: any) {
  console.log(`[DIAG-CTX] ${label}:`, value);
}

// ------------------------------------------------------------
// FACTS
// ------------------------------------------------------------
async function loadFacts(userKey: string) {
  diag("FACTS → start", userKey);

  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "fact")
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  if (error) {
    diag("FACTS ERROR", error);
    return [];
  }

  const rows = safe(data);
  diag("FACTS count", rows.length);

  return rows;
}

// ------------------------------------------------------------
// EPISODIC + CHUNKS
// ------------------------------------------------------------
async function loadEpisodic(userKey: string) {
  diag("EPISODIC → start", userKey);

  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "episodic")
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  if (error) {
    diag("EPISODIC ERROR", error);
    return [];
  }

  const episodes = safe(data);
  diag("EPISODIC count", episodes.length);

  if (episodes.length === 0) {
    diag("EPISODIC → no episodes", null);
    return [];
  }

  const episodeIds = episodes.map((e: any) => e.id);
  diag("EPISODIC episodeIds", episodeIds);

  const { data: chunkRows, error: chunkErr } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "chunk")
    .in("episode_id", episodeIds)
    .order("seq", { ascending: true });

  if (chunkErr) {
    diag("EPISODIC CHUNK ERROR", chunkErr);
    return episodes.map((e: any) => ({ ...e, chunks: [] }));
  }

  const chunks = safe(chunkRows);
  diag("CHUNKS count", chunks.length);

  const merged = episodes.map((ep: any) => ({
    ...ep,
    chunks: chunks.filter((c: any) => c.episode_id === ep.id),
  }));

  return merged;
}

// ------------------------------------------------------------
// AUTOBIOGRAPHY
// ------------------------------------------------------------
async function loadAutobio(userKey: string) {
  diag("AUTOBIO → start", userKey);

  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "autobio_entry")
    .order("created_at", { ascending: true });

  if (error) {
    diag("AUTOBIO ERROR", error);
    return [];
  }

  const rows = safe(data);
  diag("AUTOBIO count", rows.length);

  return rows;
}

// ------------------------------------------------------------
// NEWS DIGEST  (FIXED → correct table: solace_news_digest)
// ------------------------------------------------------------
async function loadNewsDigest(userKey: string) {
  diag("NEWS DIGEST → start", userKey);

  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("solace_news_digest")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false }) // REAL column
    .limit(15);

  if (error) {
    diag("NEWS DIGEST ERROR", error);
    return [];
  }

  const rows = safe(data);
  diag("NEWS DIGEST count", rows.length);

  return rows;
}

// ------------------------------------------------------------
// RESEARCH CONTEXT (truth_facts)
// ------------------------------------------------------------
async function loadResearch(userKey: string) {
  diag("RESEARCH → start", userKey);

  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    diag("RESEARCH ERROR", error);
    return [];
  }

  const rows = safe(data);
  diag("RESEARCH count", rows.length);

  return rows;
}

// ------------------------------------------------------------
// MAIN — assembleContext()
// ------------------------------------------------------------
export async function assembleContext(
  canonicalUserKey: string,
  workspaceId: string | null,
  userMessage: string
): Promise<SolaceContextBundle> {
  diag("CTX → assemble start", {
    canonicalUserKey,
    workspaceId,
    userMessagePreview: userMessage.slice(0, 80),
  });

  const userKey = canonicalUserKey || "guest";

  const [
    facts,
    episodic,
    autobiography,
    newsDigest,
    researchContext,
  ] = await Promise.all([
    loadFacts(userKey),
    loadEpisodic(userKey),
    loadAutobio(userKey),
    loadNewsDigest(userKey),
    loadResearch(userKey),
  ]);

  diag("CTX SUMMARY", {
    facts: facts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
    newsDigest: newsDigest.length,
    research: researchContext.length,
  });

  return {
    persona: STATIC_PERSONA_NAME,
    memoryPack: {
      facts,
      episodic,
      autobiography,
    },
    newsDigest,
    researchContext,
  };
}


