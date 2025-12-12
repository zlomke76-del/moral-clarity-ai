// ------------------------------------------------------------
// Solace Context Loader — Phase B (AUTH-CORRECT, NEXT 16 SAFE)
// Reads ONLY from memory.memories using SERVER auth
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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
// SERVER-AUTH MEMORY LOADER
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
// MAIN ASSEMBLER (SERVER AUTH)
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
  const cookieStore = await cookies();

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
  // LOAD MEMORY (AUTHENTICATED)
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
