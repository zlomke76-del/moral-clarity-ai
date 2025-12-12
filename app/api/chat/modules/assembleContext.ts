// app/api/chat/modules/assembleContext.ts
// ------------------------------------------------------------
// Solace Context Loader — MEMORY-SCHEMA CLEAN
// Reads ONLY from memory.memories (no legacy fallback)
// ------------------------------------------------------------

import { createClientEdge } from "@/lib/supabase/edge";
import { FACTS_LIMIT } from "./constants";

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
// Diagnostics
// ------------------------------------------------------------
function diag(label: string, value: any) {
  console.log(`[DIAG-CTX] ${label}`, value);
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function safe<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// ------------------------------------------------------------
// Loaders
// ------------------------------------------------------------
async function loadFacts(userId: string) {
  const supabase = createClientEdge();

  const { data, error } = await supabase
    // ✅ CORRECT schema-qualified read
    .from("memory.memories")
    .select("id, memory_type, content, created_at")
    .eq("user_id", userId)
    .eq("memory_type", "fact")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  if (error) {
    console.warn("[CTX-FACTS] read error", {
      code: error.code,
      message: error.message,
      hint: error.hint,
    });
    return [];
  }

  return safe(data);
}

// ------------------------------------------------------------
// Main Assembler
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

  const userId = canonicalUserKey;

  const facts = await loadFacts(userId);

  diag("CTX SUMMARY", {
    facts: facts.length,
    episodic: 0,
    autobiography: 0,
    newsDigest: 0,
    research: 0,
    didResearch: false,
  });

  return {
    persona: STATIC_PERSONA_NAME,
    memoryPack: {
      facts,
      episodic: [],
      autobiography: [],
    },
    newsDigest: [],
    researchContext: [],
    didResearch: false,
  };
}
