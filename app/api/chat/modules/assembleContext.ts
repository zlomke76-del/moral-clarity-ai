// app/api/chat/modules/assembleContext.ts
// ------------------------------------------------------------
// Solace Context Loader — Phase B (FIXED, AUTHORITATIVE)
// - Reads ONLY from memory.memories
// - No legacy tables, no views, no fallbacks
// - Hard diagnostics at every boundary
// ------------------------------------------------------------

import { createClientEdge } from "@/lib/supabase/edge";
import { FACTS_LIMIT, EPISODES_LIMIT } from "./constants";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
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
// Diagnostics helper
// ------------------------------------------------------------
function diag(label: string, payload: any) {
  console.log(`[DIAG-CTX] ${label}`, payload);
}

// ------------------------------------------------------------
// Safe rows helper
// ------------------------------------------------------------
function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// ------------------------------------------------------------
// MEMORY LOADER — schema-qualified (Supabase v2 safe)
// ------------------------------------------------------------
async function loadMemories(
  userId: string,
  memoryType: "fact" | "episodic" | "identity",
  limit: number
) {
  const supabase = createClientEdge();

  diag(`load ${memoryType} → query`, {
    schema: "memory",
    table: "memories",
    userId,
    limit,
  });

  const { data, error } = await supabase
    .schema("memory")
    .from("memories")
    .select("id, memory_type, content, created_at")
    .eq("user_id", userId)
    .eq("memory_type", memoryType)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn(`[CTX-${memoryType.toUpperCase()}] read error`, {
      code: error.code,
      message: error.message,
      hint: (error as any).hint,
    });
    return [];
  }

  const rows = safeRows(data);

  diag(`load ${memoryType} → result`, {
    count: rows.length,
    sampleId: rows[0]?.id ?? null,
  });

  return rows;
}

// ------------------------------------------------------------
// MAIN CONTEXT ASSEMBLER
// ------------------------------------------------------------
export async function assembleContext(
  canonicalUserKey: string,
  workspaceId: string | null,
  userMessage: string
): Promise<SolaceContextBundle> {
  diag("assemble start", {
    canonicalUserKey,
    workspaceId,
    preview: userMessage.slice(0, 80),
  });

  // ----------------------------------------------------------
  // Load memories in parallel — NO FALLBACKS
  // ----------------------------------------------------------
  const [facts, episodic, autobiography] = await Promise.all([
    loadMemories(canonicalUserKey, "fact", FACTS_LIMIT),
    loadMemories(canonicalUserKey, "episodic", EPISODES_LIMIT),
    loadMemories(canonicalUserKey, "identity", 25),
  ]);

  // ----------------------------------------------------------
  // Final memory counts (authoritative)
  // ----------------------------------------------------------
  diag("memory counts", {
    facts: facts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
  });

  // ----------------------------------------------------------
  // Return context bundle
  // ----------------------------------------------------------
  return {
    persona: STATIC_PERSONA_NAME,
    memoryPack: {
      facts,
      episodic,
      autobiography,
    },
    newsDigest: [],
    researchContext: [],
    didResearch: false,
  };
}
