// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (WM-PERSISTENT PER CONVERSATION)
// Option C — Session-Aware (conversationId/sessionId scoped)
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { FACTS_LIMIT, EPISODES_LIMIT } from "./context.constants";
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
  researchContext: any[];
  authorities: any[];
  newsDigest: any[];
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

// ------------------------------------------------------------
// MAIN ASSEMBLER
// ------------------------------------------------------------
export async function assembleContext(
  canonicalUserKey: string,
  workspaceId: string | null,
  userMessage: string,
  session?: {
    sessionId: string;
    sessionStartedAt: string;
  }
): Promise<SolaceContextBundle> {
  diag("assemble start", {
    canonicalUserKey,
    workspaceId,
    sessionId: session?.sessionId,
  });

  const cookieStore = await cookies();

  // ----------------------------------------------------------
  // USER CONTEXT CLIENT (anon, cookie-bound)
  // ----------------------------------------------------------
  const supabaseUser = createServerClient(
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
  // SERVICE ROLE CLIENT (authoritative, read-only)
  // ----------------------------------------------------------
  const supabaseService = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() {
          return undefined;
        },
        set() {},
        remove() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
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

  // ----------------------------------------------------------
  // LONG-TERM MEMORY (READ ONLY)
  // ----------------------------------------------------------
  const [facts, episodic, autobiography] = await Promise.all([
    supabaseUser
      .schema("memory")
      .from("memories")
      .select("id, content, created_at")
      .eq("user_id", authUserId)
      .eq("memory_type", "fact")
      .limit(FACTS_LIMIT)
      .then((r) => safeRows(r.data)),

    supabaseUser
      .schema("memory")
      .from("memories")
      .select("id, content, created_at")
      .eq("user_id", authUserId)
      .eq("memory_type", "episodic")
      .limit(EPISODES_LIMIT)
      .then((r) => safeRows(r.data)),

    supabaseUser
      .schema("memory")
      .from("memories")
      .select("id, content, created_at")
      .eq("user_id", authUserId)
      .eq("memory_type", "identity")
      .limit(25)
      .then((r) => safeRows(r.data)),
  ]);

  diag("memory counts", {
    facts: facts.length,
    episodic: episodic.length,
    autobiography: autobiography.length,
    sessionId: session?.sessionId,
  });

  // ----------------------------------------------------------
  // WORKING MEMORY (SERVICE ROLE)
  // ----------------------------------------------------------
  const conversationId = session?.sessionId ?? null;
  let wmItems: WorkingMemoryItem[] = [];

  if (conversationId) {
    const wmRes = await supabaseService
      .schema("memory")
      .from("working_memory")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .eq("user_id", authUserId)
      .limit(200);

    wmItems = safeRows(wmRes.data) as WorkingMemoryItem[];
  }

  console.log("[WM] loaded", {
    sessionId: conversationId,
    items: wmItems.length,
  });

  // ----------------------------------------------------------
  // NEWS DIGEST (AUTHORITATIVE SOURCE — TABLE)
  // ----------------------------------------------------------
  const { data: newsDigest, error: newsError } = await supabaseService
    .from("solace_news_digest")
    .select(
      "story_title, outlet, neutral_summary, story_url"
    )
    .limit(6);

  if (newsError) {
    console.error("[NEWS DIGEST LOAD ERROR]", newsError);
  }

  console.log("[NEWS DIGEST LOADED]", {
    items: newsDigest?.length ?? 0,
  });

  // ----------------------------------------------------------
  // RESEARCH
  // ----------------------------------------------------------
  const researchContext = await readHubbleResearchContext(10);
  const didResearch = researchContext.length > 0;

  return {
    persona: "Solace",
    memoryPack: { facts, episodic, autobiography },
    workingMemory: {
      active: Boolean(conversationId),
      items: wmItems,
    },
    researchContext,
    authorities: [],
    newsDigest: safeRows(newsDigest),
    didResearch,
  };
}
