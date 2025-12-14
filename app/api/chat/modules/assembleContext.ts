// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (WM-READ-ONLY)
// NEWS DIGEST SCOPED — NEUTRAL SUMMARY ONLY
// AUTHORITY-AGNOSTIC — NEGATIVE SPACE PRESERVED
// NEXT 16 SAFE
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./context.constants";

import { readHubbleResearchContext } from "@/lib/research/hubble-reader";

// ------------------------------------------------------------
// TYPES (EXPORTED — REQUIRED BY WM STORE)
// ------------------------------------------------------------
export type WorkingMemoryItem = {
  id?: string;
  role: "system" | "user" | "assistant";
  content: string;
  created_at?: string;
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
  authorities: any[];
  newsDigest: NewsDigestItem[];
  didResearch: boolean;
};

// ------------------------------------------------------------
// DIAGNOSTICS
// ------------------------------------------------------------
function diag(label: string, payload: any) {
  console.log(`[DIAG-CTX] ${label}`, payload);
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

function inferDayScope(
  message: string
): "today" | "yesterday" | "week" | "all" {
  const m = message.toLowerCase();
  if (m.includes("today")) return "today";
  if (m.includes("yesterday")) return "yesterday";
  if (m.includes("week") || m.includes("7")) return "week";
  return "all";
}

function filterByDay(
  rows: NewsDigestItem[],
  scope: "today" | "yesterday" | "week" | "all"
): NewsDigestItem[] {
  if (scope === "all") return rows;

  const today = new Date().toISOString().slice(0, 10);

  if (scope === "today") {
    return rows.filter((r) => r.day === today);
  }

  if (scope === "yesterday") {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.toISOString().slice(0, 10);
    return rows.filter((r) => r.day === y);
  }

  if (scope === "week") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return rows.filter(
      (r) => new Date(r.created_at) >= cutoff
    );
  }

  return rows;
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
  // RESEARCH CONTEXT (HUBBLE — READ ONLY)
  // ----------------------------------------------------------
  const researchContext = await readHubbleResearchContext(10);
  const didResearch = researchContext.length > 0;

  // ----------------------------------------------------------
  // NEWS DIGEST (NEUTRAL SUMMARY ONLY)
  // ----------------------------------------------------------
  const scope = inferDayScope(userMessage);

  const { data: digestRows } = await supabase
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
    .limit(50);

  const newsDigest = filterByDay(
    safeRows(digestRows as NewsDigestItem[]),
    scope
  );

  diag("news digest", { count: newsDigest.length, scope });

  // ----------------------------------------------------------
  // FINAL CONTEXT
  // ----------------------------------------------------------
  return {
    persona: "Solace",
    memoryPack: { facts, episodic, autobiography },
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
