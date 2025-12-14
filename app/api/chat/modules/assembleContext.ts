// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (WM-READ-ONLY)
// NEXT 16 SAFE — FLAG-CORRECT
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./context.constants";

import { readHubbleResearchContext } from "@/lib/research/hubble-reader";

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
export type WorkingMemoryItem = {
  id?: string;
  role: "system" | "user" | "assistant";
  content: string;
  created_at?: string;
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
// MAIN ASSEMBLER
// ------------------------------------------------------------
export async function assembleContext(
  canonicalUserKey: string, // retained for logging only
  workspaceId: string | null,
  userMessage: string
): Promise<SolaceContextBundle> {
  diag("assemble start", {
    canonicalUserKey,
    workspaceId,
    preview: userMessage.slice(0, 80),
  });

  // ----------------------------------------------------------
  // COOKIE ACCESS — NEXT 16 REQUIRES AWAIT
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // AUTH RESOLUTION — CANONICAL FOR MEMORY
  // ----------------------------------------------------------
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    diag("memory skipped", {
      reason: "no authenticated user",
      authError: authError?.message ?? null,
    });

    return {
      persona: "Solace",
      memoryPack: {
        facts: [],
        episodic: [],
        autobiography: [],
      },
      workingMemory: {
        active: false,
        items: [],
      },
      newsDigest: [],
      researchContext: [],
      didResearch: false,
    };
  }

  const authUserId = user.id;

  diag("auth identity locked", {
    authUserId,
  });

  // ----------------------------------------------------------
  // LOAD MEMORY (READ ONLY — UUID KEYED)
  // ----------------------------------------------------------
  const [facts, episodic, autobiography] = await Promise.all([
    supabase
      .schema("memory")
      .from("memories")
      .select("id, memory_type, content, created_at")
      .eq("user_id", authUserId)
      .eq("memory_type", "fact")
      .order("created_at", { ascending: false })
      .limit(FACTS_LIMIT)
      .then((r) => safeRows(r.data)),

    supabase
      .schema("memory")
      .from("memories")
      .select("id, memory_type, content, created_at")
      .eq("user_id", authUserId)
      .eq("memory_type", "episodic")
      .order("created_at", { ascending: false })
      .limit(EPISODES_LIMIT)
      .then((r) => safeRows(r.data)),

    supabase
      .schema("memory")
      .from("memories")
      .select("id, memory_type, content, created_at")
      .eq("user_id", authUserId)
      .eq("memory_type", "identity")
      .order("created_at", { ascending: false })
      .limit(25)
      .then((r) => safeRows(r.data)),
  ]);

  diag("memory counts", {
    facts: facts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
  });

  // ----------------------------------------------------------
  // RESEARCH CONTEXT (ALWAYS SAFE, MAY BE EMPTY)
  // ----------------------------------------------------------
  const researchContext = await readHubbleResearchContext(10);
  const didResearch = researchContext.length > 0;

  diag("research context", {
    count: researchContext.length,
  });

  // ----------------------------------------------------------
  // FINAL CONTEXT BUNDLE
  // ----------------------------------------------------------
  return {
    persona: "Solace",
    memoryPack: {
      facts,
      episodic,
      autobiography,
    },
    workingMemory: {
      active: false,
      items: [],
    },
    newsDigest: [],
    researchContext,
    didResearch,
  };
}
