// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (WM-READ-ONLY)
// NEXT 16 SAFE — NO ASYNC COOKIES
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./context.constants";

import { getSolaceFeatureFlags } from "@/lib/solace/settings";
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
  // COOKIE ACCESS (SYNC — NEXT 16 SAFE)
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // LOAD MEMORY (READ ONLY)
  // ----------------------------------------------------------
  const [facts, episodic, autobiography] = await Promise.all([
    supabase
      .schema("memory")
      .from("memories")
      .select("id, memory_type, content, created_at")
      .eq("user_id", canonicalUserKey)
      .eq("memory_type", "fact")
      .order("created_at", { ascending: false })
      .limit(FACTS_LIMIT)
      .then((r) => safeRows(r.data)),

    supabase
      .schema("memory")
      .from("memories")
      .select("id, memory_type, content, created_at")
      .eq("user_id", canonicalUserKey)
      .eq("memory_type", "episodic")
      .order("created_at", { ascending: false })
      .limit(EPISODES_LIMIT)
      .then((r) => safeRows(r.data)),

    supabase
      .schema("memory")
      .from("memories")
      .select("id, memory_type, content, created_at")
      .eq("user_id", canonicalUserKey)
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
  // FEATURE FLAGS (SAFE, NO ARGS)
  // ----------------------------------------------------------
  const flags = await getSolaceFeatureFlags();

  // ----------------------------------------------------------
  // RESEARCH CONTEXT (HUBBLE)
  // ----------------------------------------------------------
  let researchContext: any[] = [];
  let didResearch = false;

  if (flags?.enableResearch) {
    researchContext = await readHubbleResearchContext(10);
    didResearch = researchContext.length > 0;
  }

  diag("research context", {
    enabled: flags?.enableResearch,
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
