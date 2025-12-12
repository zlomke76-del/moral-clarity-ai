// app/api/chat/modules/assembleContext.ts
// ------------------------------------------------------------
// Solace Context Loader — Phase B
// READS ONLY from memory.memories (RLS enforced)
// ------------------------------------------------------------

import { createClientEdge } from "@/lib/supabase/edge";
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
  didResearch: boolean;
};

const STATIC_PERSONA_NAME = "Solace";

// ------------------------------------------------------------
// Diagnostics
// ------------------------------------------------------------
function diag(label: string, payload: any) {
  console.log(`[DIAG-CTX] ${label}`, payload);
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// ------------------------------------------------------------
// MEMORY LOADERS (schema = memory)
// ------------------------------------------------------------
async function loadMemories(
  userId: string,
  memoryType: string,
  limit: number
) {
  const supabase = createClientEdge();

  const { data, error } = await supabase
    .from("memories", { schema: "memory" })
    .select("id, memory_type, content, created_at")
    .eq("user_id", userId)
    .eq("memory_type", memoryType)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn(`[CTX-${memoryType.toUpperCase()}] read error`, {
      code: error.code,
      message: error.message,
    });
    return [];
  }

  return safeRows(data);
}

// ------------------------------------------------------------
// MAIN ASSEMBLER
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
  // Load memory buckets
  // ----------------------------------------------------------
  const [facts, episodic, autobiography] = await Promise.all([
    loadMemories(canonicalUserKey, "fact", FACTS_LIMIT),
    loadMemories(canonicalUserKey, "episodic", EPISODES_LIMIT),
    loadMemories(canonicalUserKey, "identity", 25),
  ]);

  diag("memory counts", {
    facts: facts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
  });

  // ----------------------------------------------------------
  // Phase B: No news, no research, no inference
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
