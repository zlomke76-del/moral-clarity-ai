// ------------------------------------------------------------
// Solace Context Loader — STRICT BEHAVIOR VERSION (NO DRIFT)
// NEWS loads ONLY when user explicitly asks.
// TRUTH_FACTS permanently disabled.
// ------------------------------------------------------------

import { createClientEdge } from "@/lib/supabase/edge";
import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  ENABLE_NEWS,       // kept for compatibility (not used for loading)
  ENABLE_RESEARCH,   // kept for compatibility (not used for loading)
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
// NEWS DIGEST — ONLY when user explicitly requests news
// ------------------------------------------------------------
async function loadNewsDigest(userKey: string) {
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
// RESEARCH (truth_facts) — PERMANENTLY DISABLED
// ------------------------------------------------------------
async function loadResearch(userKey: string) {
  diag("RESEARCH → DISABLED", userKey);
  return [];
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

  //----------------------------------------------------------
  // Load baseline context (always)
  //----------------------------------------------------------
  const [facts, episodic, autobiography] = await Promise.all([
    loadFacts(userKey),
    loadEpisodic(userKey),
    loadAutobio(userKey),
  ]);

  //----------------------------------------------------------
  // Detect EXPLICIT news request
  //----------------------------------------------------------
  const wantsNews =
    /\bnews\b|\bheadline\b|\btoday\b|\breport\b|\bcurrent events\b|\bwhat'?s happening\b/i.test(
      userMessage
    );

  // Load ONLY when explicitly requested
  const newsDigest = wantsNews ? await loadNewsDigest(userKey) : [];

  //----------------------------------------------------------
  // Research is permanently disabled
  //----------------------------------------------------------
  const researchContext = [];

  //----------------------------------------------------------
  // Diagnostics summary
  //----------------------------------------------------------
  diag("CTX SUMMARY", {
    facts: facts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
    newsDigest: newsDigest.length,
    research: 0,
  });

  //----------------------------------------------------------
  // Final bundle
  //----------------------------------------------------------
  return {
    persona: STATIC_PERSONA_NAME,
    memoryPack: { facts, episodic, autobiography },
    newsDigest,
    researchContext,
  };
}


