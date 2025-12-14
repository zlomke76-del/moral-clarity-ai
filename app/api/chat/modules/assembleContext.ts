// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (WM-READ-ONLY)
// NEWS DIGEST — NEUTRAL SUMMARY FIRST (TYPE-SAFE)
// AUTHORITY-AGNOSTIC — NEGATIVE SPACE PRESERVED
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

export type AuthorityContext = {
  source: string;
  queried: boolean;
  retrievedAt?: string;
  payload?: any;
  negativeSpace?: {
    asserted: boolean;
    confidence: "low" | "medium" | "high";
    reason: string;
  };
};

export type NewsDigestItem = {
  ledger_id: string;
  story_title: string;
  outlet: string;
  story_url: string;
  neutral_summary: string;
  key_facts: string[] | null;
  pi_score: number | null;
  created_at: string;
  day: string;
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
  researchContext: any[];
  authorities: AuthorityContext[];
  newsDigest: NewsDigestItem[];
  didResearch: boolean;
};

// ------------------------------------------------------------
// Diagnostics
// ------------------------------------------------------------
function diag(label: string, payload: any) {
  console.log(`[DIAG-CTX] ${label}`, payload);
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function safeRows<T>(rows: T[] | null | undefined): T[] {
  return Array.isArray(rows) ? rows : [];
}

function normalizeNewsDigest(
  rows: any[]
): NewsDigestItem[] {
  return rows
    .filter((r) => r && typeof r.neutral_summary === "string")
    .map((r) => ({
      ledger_id: String(r.ledger_id),
      story_title: String(r.story_title ?? ""),
      outlet: String(r.outlet ?? ""),
      story_url: String(r.story_url ?? ""),
      neutral_summary: String(r.neutral_summary),
      key_facts: Array.isArray(r.key_facts) ? r.key_facts : null,
      pi_score:
        typeof r.pi_score === "number" ? r.pi_score : null,
      created_at: String(r.created_at),
      day: String(r.day),
    }));
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
  // AUTH RESOLUTION
  // ----------------------------------------------------------
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    diag("context degraded", {
      reason: "unauthenticated",
      authError: authError?.message ?? null,
    });

    return {
      persona: "Solace",
      memoryPack: { facts: [], episodic: [], autobiography: [] },
      workingMemory: { active: false, items: [] },
      researchContext: [],
      authorities: [],
      newsDigest: [],
      didResearch: false,
    };
  }

  const authUserId = user.id;
  diag("auth identity locked", { authUserId });

  // ----------------------------------------------------------
  // LOAD MEMORY (READ ONLY)
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
  // RESEARCH CONTEXT (HUBBLE)
  // ----------------------------------------------------------
  const researchContext = await readHubbleResearchContext(10);
  const didResearch = researchContext.length > 0;
  diag("research context", { count: researchContext.length });

  // ----------------------------------------------------------
  // NEWS DIGEST (TYPE-SAFE)
  // ----------------------------------------------------------
  const { data: rawDigest } = await supabase
    .from("solace_news_digest_view")
    .select(`
      ledger_id,
      story_title,
      outlet,
      story_url,
      neutral_summary,
      key_facts,
      pi_score,
      created_at,
      day
    `)
    .order("created_at", { ascending: false })
    .limit(20);

  const newsDigest = normalizeNewsDigest(
    safeRows(rawDigest)
  );

  diag("news digest", { count: newsDigest.length });

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
    researchContext,
    authorities: [],
    newsDigest,
    didResearch,
  };
}
