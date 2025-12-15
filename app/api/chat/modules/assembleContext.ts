// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (WM-READ-ONLY)
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
  story_url: string;
  outlet: string;
  neutral_summary: string;
  created_at: string;
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
function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

function wantsNews(userMessage: string): boolean {
  const msg = userMessage.toLowerCase();
  return (
    msg.includes("news") ||
    msg.includes("headlines") ||
    msg.includes("current events") ||
    msg.includes("what's happening") ||
    msg.includes("today's news")
  );
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

  // ------------------------------------------------------------
  // MEMORY
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // RESEARCH (HUBBLE)
  // ------------------------------------------------------------
  const researchContext = await readHubbleResearchContext(10);
  const didResearch = researchContext.length > 0;

  diag("research context", { count: researchContext.length });

  // ------------------------------------------------------------
  // NEWS DIGEST (NEUTRAL — INTENT GATED)
  // ------------------------------------------------------------
  let newsDigest: NewsDigestItem[] = [];

  if (wantsNews(userMessage)) {
    const { data: newsDigestRaw, error: newsError } = await supabase
      .from("solace_news_digest_view")
      .select(
        "ledger_id, story_title, story_url, outlet, neutral_summary, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(9);

    if (newsError) {
      diag("news digest error", { message: newsError.message });
    }

    newsDigest = safeRows<NewsDigestItem>(newsDigestRaw);

    diag("news digest loaded", {
      rowsFetched: newsDigest.length,
    });
  } else {
    diag("news digest skipped", {
      reason: "no news intent",
    });
  }

  // ------------------------------------------------------------
  // FINAL CONTEXT
  // ------------------------------------------------------------
  return {
    persona: "Solace",
    memoryPack: { facts, episodic, autobiography },
    workingMemory: { active: false, items: [] },
    researchContext,
    authorities: [],
    newsDigest,
    didResearch,
  };
}
