// ------------------------------------------------------------
// Solace Context Loader — FINAL INTELLIGENCE VERSION
// Implements:
//  - Explicit news detection
//  - Explicit + implicit research detection
//  - Unknown entity detection (UE-A)
//  - Common-name whitelist (FN1)
//  - Low-confidence → immediate research (Rule B)
//  - Creative-intent override
//  - didResearch boolean return
//  - Fully compatible with orchestrator R3
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
// LOADERS
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

async function loadNewsDigest(userKey: string) {
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

// Explicit news indicators
const NEWS_REGEX =
  /\b(news|headlines|current events|breaking|today's news|latest news)\b/i;

// Explicit research indicators
const EXPLICIT_RESEARCH_REGEX =
  /\b(research|look up|find out|verify|fact[- ]?check|sources?|evidence|prove|data|truth|accurate|accuracy)\b/i;

// Implicit verification indicators
const IMPLICIT_RESEARCH_REGEX =
  /\b(explain (the evidence|in detail|deeply|the data|the science))\b/i;

// Creative intent indicators (do NOT research)
const CREATIVE_INTENT_REGEX =
  /\b(write|story|poem|lyrics|fantasy|joke|imagine|pretend)\b/i;

// Common first-name whitelist (FN1)
const COMMON_FIRST_NAMES = new Set([
  "John", "James", "Robert", "Michael", "William",
  "David", "Richard", "Joseph", "Thomas", "Charles",
  "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth",
  "Sarah", "Karen", "Nancy", "Lisa", "Margaret",
  "Daniel", "Christopher", "Anthony", "Matthew", "Mark",
  "Emma", "Olivia", "Sophia", "Isabella", "Mia"
]);

// Utility: detect capitalized tokens
function extractCapitalizedTokens(text: string): string[] {
  return text
    .split(/[^A-Za-z0-9]+/)
    .filter(t => /^[A-Z][a-zA-Z0-9]+$/.test(t));
}

// Check if token is common/known
function tokenIsWhitelisted(token: string): boolean {
  return (
    COMMON_FIRST_NAMES.has(token) ||
    /^[A-Z][a-z]+day$/.test(token) || // Days (Monday...)
    /^[A-Z][a-z]+(uary|arch|ril|May|June|July|ember)$/.test(token) // Months
  );
}

// Unknown entity detection (UE-A)
function detectUnknownEntity(userMessage: string): boolean {
  const tokens = extractCapitalizedTokens(userMessage);
  for (const t of tokens) {
    if (!tokenIsWhitelisted(t)) {
      return true;
    }
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

  // Load core memories
  const [facts, episodic, autobiography] = await Promise.all([
    loadFacts(userKey),
    loadEpisodic(userKey),
    loadAutobio(userKey),
  ]);

  // ------------------------------------------------------------
  // DETERMINE NEWS REQUEST
  // ------------------------------------------------------------
  const wantsNews = NEWS_REGEX.test(userMessage);

  const newsDigest = wantsNews ? await loadNewsDigest(userKey) : [];

  // ------------------------------------------------------------
  // DETERMINE RESEARCH REQUEST
  // ------------------------------------------------------------

  // 1. Explicit research keywords
  const explicitResearch = EXPLICIT_RESEARCH_REGEX.test(userMessage);

  // 2. Implicit verification triggers
  const implicitResearch = IMPLICIT_RESEARCH_REGEX.test(userMessage);

  // 3. Unknown entity detection (UE-A)
  const hasUnknownEntity = detectUnknownEntity(userMessage);

  // 4. Creative intent override: If creative, do NOT research.
  const isCreative = CREATIVE_INTENT_REGEX.test(userMessage);

  // Final research decision:
  let shouldResearch = false;

  if (!isCreative) {
    if (explicitResearch || implicitResearch) {
      shouldResearch = true;
    } else if (hasUnknownEntity) {
      // Rule B: if internal confidence is low (unknown entity), go straight to research
      shouldResearch = true;
    }
  }

  const researchContext: any[] = shouldResearch ? await loadResearch(userKey) : [];
  const didResearch = researchContext.length > 0;

  diag("CTX SUMMARY", {
    facts: facts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
    newsDigest: newsDigest.length,
    research: researchContext.length,
    didResearch,
  });

  return {
    persona: STATIC_PERSONA_NAME,
    memoryPack: { facts, episodic, autobiography },
    newsDigest,
    researchContext,
    didResearch,
  };
}


