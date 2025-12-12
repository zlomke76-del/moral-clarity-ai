// ------------------------------------------------------------
// Solace Context Loader — FINAL INTELLIGENCE VERSION (SHADOW READ)
// Implements:
//  - Explicit news detection
//  - Explicit + implicit research detection
//  - Unknown entity detection (UE-A)
//  - Common-name whitelist (FN1)
//  - Low-confidence → immediate research (Rule B)
//  - Creative-intent override
//  - didResearch boolean return
//  - SHADOW READ of new memory schema (NO behavior change)
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
  didResearch: boolean;
};

const STATIC_PERSONA_NAME = "Solace";

// ------------------------------------------------------------
// SAFE WRAPPER
// ------------------------------------------------------------
function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// ------------------------------------------------------------
// DIAGNOSTICS
// ------------------------------------------------------------
function diag(label: string, value: any) {
  console.log(`[DIAG-CTX] ${label}:`, value);
}

// ------------------------------------------------------------
// LEGACY LOADERS (AUTHORITATIVE FOR NOW)
// ------------------------------------------------------------
async function loadFacts(userKey: string) {
  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "fact")
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  return error ? [] : safe(data);
}

async function loadEpisodic(userKey: string) {
  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "episodic")
    .order("created_at", { ascending: false })
    .limit(EPISODES_LIMIT);

  return error ? [] : safe(data);
}

async function loadAutobio(userKey: string) {
  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("mv_unified_memory")
    .select("*")
    .eq("user_key", userKey)
    .eq("memory_type", "autobio_entry")
    .order("created_at", { ascending: true });

  return error ? [] : safe(data);
}

// ------------------------------------------------------------
// NEW MEMORY (SHADOW READ ONLY — NOT YET USED)
// ------------------------------------------------------------
async function loadNewFacts(userId: string) {
  const supabase = createClientEdge();

  const { data, error } = await supabase
  .from("memory.memories")
  .select("id, memory_type, content, created_at")
  .eq("user_id", userId)
  .eq("memory_type", "fact")
  .eq("is_active", true)
  .order("created_at", { ascending: false })
  .limit(FACTS_LIMIT);


  if (error) {
    console.warn("[CTX-NEW-FACTS] read error", error);
    return [];
  }

  return safe(data);
}

// ------------------------------------------------------------
// NEWS + RESEARCH LOADERS
// ------------------------------------------------------------
async function loadNewsDigest() {
  if (!ENABLE_NEWS) return [];
  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("solace_news_digest")
    .select("*")
    .limit(15);

  return error ? [] : safe(data);
}

async function loadResearch(userKey: string) {
  if (!ENABLE_RESEARCH) return [];
  const supabase = createClientEdge();
  const { data, error } = await supabase
    .from("truth_facts")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(10);

  return error ? [] : safe(data);
}

// ------------------------------------------------------------
// RESEARCH + NEWS TRIGGERS
// ------------------------------------------------------------
const NEWS_REGEX =
  /\b(news|headlines|current events|breaking|today's news|latest news)\b/i;

const EXPLICIT_RESEARCH_REGEX =
  /\b(research|look up|find out|verify|fact[- ]?check|sources?|evidence|prove|data|truth|accurate|accuracy)\b/i;

const IMPLICIT_RESEARCH_REGEX =
  /\b(explain (the evidence|in detail|deeply|the data|the science))\b/i;

const CREATIVE_INTENT_REGEX =
  /\b(write|story|poem|lyrics|fantasy|joke|imagine|pretend)\b/i;

const COMMON_FIRST_NAMES = new Set([
  "John","James","Robert","Michael","William",
  "David","Richard","Joseph","Thomas","Charles",
  "Mary","Patricia","Jennifer","Linda","Elizabeth",
  "Sarah","Karen","Nancy","Lisa","Margaret",
  "Daniel","Christopher","Anthony","Matthew","Mark",
  "Emma","Olivia","Sophia","Isabella","Mia"
]);

function extractCapitalizedTokens(text: string): string[] {
  return text
    .split(/[^A-Za-z0-9]+/)
    .filter(t => /^[A-Z][a-zA-Z0-9]+$/.test(t));
}

function tokenIsWhitelisted(token: string): boolean {
  return (
    COMMON_FIRST_NAMES.has(token) ||
    /^[A-Z][a-z]+day$/.test(token) ||
    /^[A-Z][a-z]+(uary|arch|ril|May|June|July|ember)$/.test(token)
  );
}

function detectUnknownEntity(userMessage: string): boolean {
  const tokens = extractCapitalizedTokens(userMessage);
  for (const t of tokens) {
    if (!tokenIsWhitelisted(t)) return true;
  }
  return false;
}

// ------------------------------------------------------------
// MAIN CONTEXT ASSEMBLER
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

  // ----------------------------------------------------------
  // LOAD MEMORIES (LEGACY + SHADOW)
  // ----------------------------------------------------------
  const [legacyFacts, episodic, autobiography] = await Promise.all([
    loadFacts(userKey),
    loadEpisodic(userKey),
    loadAutobio(userKey),
  ]);

  const newFacts = await loadNewFacts(userKey);

  diag("CTX-SHADOW-MEMORY", {
    legacyFacts: legacyFacts.length,
    newFacts: newFacts.length,
    legacySample: legacyFacts[0]?.id ?? null,
    newSample: newFacts[0]?.id ?? null,
  });

  // ----------------------------------------------------------
  // NEWS
  // ----------------------------------------------------------
  const wantsNews = NEWS_REGEX.test(userMessage);
  const newsDigest = wantsNews ? await loadNewsDigest() : [];

  // ----------------------------------------------------------
  // RESEARCH
  // ----------------------------------------------------------
  const explicitResearch = EXPLICIT_RESEARCH_REGEX.test(userMessage);
  const implicitResearch = IMPLICIT_RESEARCH_REGEX.test(userMessage);
  const hasUnknownEntity = detectUnknownEntity(userMessage);
  const isCreative = CREATIVE_INTENT_REGEX.test(userMessage);

  let shouldResearch = false;
  if (!isCreative) {
    if (explicitResearch || implicitResearch || hasUnknownEntity) {
      shouldResearch = true;
    }
  }

  const researchContext = shouldResearch ? await loadResearch(userKey) : [];
  const didResearch = researchContext.length > 0;

  diag("CTX SUMMARY", {
    facts: legacyFacts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
    newsDigest: newsDigest.length,
    research: researchContext.length,
    didResearch,
  });

  // ----------------------------------------------------------
  // RETURN (LEGACY AUTHORITATIVE — NO CUTOVER YET)
  // ----------------------------------------------------------
  return {
    persona: STATIC_PERSONA_NAME,
    memoryPack: {
      facts: legacyFacts,
      episodic,
      autobiography,
    },
    newsDigest,
    researchContext,
    didResearch,
  };
}
