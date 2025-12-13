// ------------------------------------------------------------
// Solace Context Loader — Phase B + Phase 5 (WM-READ-ONLY)
// AUTH-CORRECT, NEXT 16 SAFE
// ------------------------------------------------------------
// Reads ONLY from memory.memories using SERVER auth
// Adds SESSION-SCOPED Working Memory (NON-PERSISTENT)
// Adds READ-ONLY Research Context (Hubble)
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { FACTS_LIMIT, EPISODES_LIMIT } from "./constants";
import { getSolaceFeatureFlags } from "@/lib/solace/settings";
import { readHubbleResearchContext } from "@/lib/research/hubble-reader";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export type WorkingMemoryItem = {
  id: string;
  content: string;
  scope: "technical" | "project" | "decision";
  sensitivity: "low" | "medium" | "high";
  createdAt: string;
};

export type SolaceContextBundle = {
  persona: string;
  memoryPack: {
    facts: any[];
    episodic: any[];
    autobiography: any[];
  };
  workingMemory: {
    active: boolean;
    items: WorkingMemoryItem[];
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
// Safe helper
// ------------------------------------------------------------
function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// ------------------------------------------------------------
// SERVER-AUTH MEMORY LOADER (LTM ONLY)
// ------------------------------------------------------------
async function loadMemories(
  supabase: any,
  userId: string,
  memoryType: string,
  limit: number
) {
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
    });
    return [];
  }

  diag(`load ${memoryType} → result`, {
    count: data?.length ?? 0,
    sampleId: data?.[0]?.id ?? null,
  });

  return safeRows(data);
}

// ------------------------------------------------------------
// WORKING MEMORY LOADER (SESSION-SCOPED, NON-PERSISTENT)
// ------------------------------------------------------------
async function loadWorkingMemory(
  sessionId: string | null
): Promise<WorkingMemoryItem[]> {
  if (!sessionId) return [];

  try {
    const wmStore = (globalThis as any).__SOLACE_WM_STORE__ as
      | Map<string, WorkingMemoryItem[]>
      | undefined;

    const items = wmStore?.get(sessionId) ?? [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

// ------------------------------------------------------------
// MAIN ASSEMBLER (SERVER AUTH + WM + RESEARCH)
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

  // ------------------------------------------
  // SERVER SUPABASE CLIENT (COOKIE-AWARE)
  // ------------------------------------------
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  // ------------------------------------------
  // LOAD LONG-TERM MEMORY (READ ONLY)
  // ------------------------------------------
  const [facts, episodic, autobiography] = await Promise.all([
    loadMemories(supabase, canonicalUserKey, "fact", FACTS_LIMIT),
    loadMemories(supabase, canonicalUserKey, "episodic", EPISODES_LIMIT),
    loadMemories(supabase, canonicalUserKey, "identity", 25),
  ]);

  diag("memory counts", {
    facts: facts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
  });

  // ------------------------------------------
  // LOAD WORKING MEMORY (SESSION-SCOPED)
  // ------------------------------------------
  const sessionId = cookieStore.get("solace-session")?.value ?? null;
  const workingMemoryItems = await loadWorkingMemory(sessionId);

  diag("working memory", {
    active: workingMemoryItems.length > 0,
    count: workingMemoryItems.length,
  });

  // ------------------------------------------
  // LOAD RESEARCH CONTEXT (HUBBLE — READ ONLY)
  // ------------------------------------------
  const flags = getSolaceFeatureFlags();
  let researchContext: any[] = [];

  if (flags.hubbleResearchEnabled) {
    researchContext = await readHubbleResearchContext();
    diag("research.hubble.loaded", {
      count: researchContext.length,
    });
  } else {
    diag("research.hubble.disabled", {});
  }

  // ------------------------------------------
  // FINAL CONTEXT BUNDLE
  // ------------------------------------------
  const bundle: SolaceContextBundle = {
    persona: STATIC_PERSONA_NAME,
    memoryPack: {
      facts,
      episodic,
      autobiography,
    },
    workingMemory: {
      active: workingMemoryItems.length > 0,
      items: workingMemoryItems,
    },
    newsDigest: [],
    researchContext,
    didResearch: researchContext.length > 0,
  };

  diag("assemble complete", {
    facts: facts.length,
    episodic: episodic.length,
    research: researchContext.length,
  });

  return bundle;
}
