// ------------------------------------------------------------
// Solace Context Loader (CONDITIONAL VERSION — FIXED)
// Only loads NEWS + RESEARCH when enabled in constants.ts
// and ONLY when mode requires it.
// ------------------------------------------------------------

import { createClientEdge } from "@/lib/supabase/edge";
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,
  ENABLE_RESEARCH,
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

const STATIC_PERSONA_NAME = "Solace";

function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// ------------------------------------------------------------
// DIAG util
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

  if (error) return [];
  const rows = safe(data);
  diag("FACTS count", rows.length);
  return rows;
}

// ------------------------------------------------------------
// EPISODIC
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

  if (error) return [];

  const episodes = safe(data);
  diag("EPISODIC count", episodes.length);

  return episodes;
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

  if (error) return [];
  const rows = safe(data);
  diag("AUTOBIO count", rows.length);
  return rows;
}

// ------------------------------------------------------------
// NEWS DIGEST — ONLY WHEN ENABLED
// ------------------------------------------------------------
async function loadNewsDigest(userKey: string) {
  if (!ENABLE_NEWS) {
    diag("NEWS DIGEST → disabled", null);
    return [];
  }

  diag("NEWS DIGEST → start", userKey);

  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("solace_news_digest")
    .select("*")
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
// RESEARCH (truth_facts) — ONLY WHEN ENABLED
// ------------------------------------------------------------
async function loadResearch(userKey: string) {
  if (!ENABLE_RESEARCH) {
    diag("RESEARCH → disabled", null);
    return [];
  }

  diag("RESEARCH → start", userKey);

  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return [];
  const rows = safe(data);
  diag("RESEARCH count", rows.length);
  return rows;
}

// ------------------------------------------------------------
// MAIN
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

  // Load baseline only
  const [facts, episodic, autobiography] = await Promise.all([
    loadFacts(userKey),
    loadEpisodic(userKey),
    loadAutobio(userKey),
  ]);

  // News + Research loaded only when enabled
  const newsDigest = ENABLE_NEWS ? await loadNewsDigest(userKey) : [];
  const researchContext = ENABLE_RESEARCH ? await loadResearch(userKey) : [];

  diag("CTX SUMMARY", {
    facts: facts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
    newsDigest: newsDigest.length,
    research: researchContext.length,
  });

  return {
    persona: STATIC_PERSONA_NAME,
    memoryPack: { facts, episodic, autobiography },
    newsDigest,
    researchContext,
  };
}

