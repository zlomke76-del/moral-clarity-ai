// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (Session-Aware, Compaction-First)
// Authoritative Read Path
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

export type SessionCompaction = {
  id: string;
  content: string; // JSON string (authoritative state)
  created_at: string;
};

export type ParsedSessionState = {
  domain?: string;
  intent?: string;
  constraints?: string[];
};

export type SolaceContextBundle = {
  persona: string;
  memoryPack: {
    facts: any[];
    episodic: any[];
    autobiography: any[];
    sessionCompaction?: SessionCompaction | null;
    sessionState?: ParsedSessionState | null;
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

function parseSessionCompaction(
  compaction: SessionCompaction | null
): ParsedSessionState | null {
  if (!compaction?.content) return null;

  try {
    const parsed = JSON.parse(compaction.content);

    return {
      domain: parsed?.domain ?? undefined,
      intent: parsed?.intent ?? undefined,
      constraints: Array.isArray(parsed?.constraints)
        ? parsed.constraints
        : undefined,
    };
  } catch (err) {
    console.error("[CTX] failed to parse session compaction", err);
    return null;
  }
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
  const conversationId = session?.sessionId ?? null;

  diag("assemble start", {
    canonicalUserKey,
    workspaceId,
    conversationId,
  });

  const cookieStore = await cookies();

  // ----------------------------------------------------------
  // USER CONTEXT CLIENT (cookie-bound)
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
  // SERVICE ROLE CLIENT (authoritative reads)
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
      memoryPack: {
        facts: [],
        episodic: [],
        autobiography: [],
        sessionCompaction: null,
        sessionState: null,
      },
      workingMemory: { active: false, items: [] },
      researchContext: [],
      authorities: [],
      newsDigest: [],
      didResearch: false,
    };
  }

  const authUserId = user.id;

  // ----------------------------------------------------------
  // LONG-TERM MEMORY (FACTS / EPISODIC / IDENTITY)
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
    conversationId,
  });

  // ----------------------------------------------------------
  // SESSION COMPACTION (AUTHORITATIVE STATE)
  // ----------------------------------------------------------
  let sessionCompaction: SessionCompaction | null = null;
  let sessionState: ParsedSessionState | null = null;

  if (conversationId) {
    const compactionRes = await supabaseService
      .schema("memory")
      .from("memories")
      .select("id, content, created_at")
      .eq("memory_type", "session_compaction")
      .eq("conversation_id", conversationId)
      .eq("user_id", authUserId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (compactionRes?.data) {
      sessionCompaction = compactionRes.data as SessionCompaction;
      sessionState = parseSessionCompaction(sessionCompaction);
    }
  }

  diag("session compaction", {
    conversationId,
    present: Boolean(sessionCompaction),
    parsed: sessionState,
  });

  // ----------------------------------------------------------
  // RAW WORKING MEMORY (TAIL ONLY, HIGH FIDELITY)
  // ----------------------------------------------------------
  let wmItems: WorkingMemoryItem[] = [];

  if (conversationId) {
    const wmRes = await supabaseService
      .schema("memory")
      .from("working_memory")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .eq("user_id", authUserId)
      .order("created_at", { ascending: false })
      .limit(15);

    wmItems = safeRows(wmRes.data).reverse();
  }

  diag("working memory loaded", {
    conversationId,
    items: wmItems.length,
  });

  // ----------------------------------------------------------
  // NEWS DIGEST (AUTHORITATIVE)
  // ----------------------------------------------------------
  const { data: newsDigest, error: newsError } = await supabaseService
    .from("solace_news_digest")
    .select("story_title, outlet, neutral_summary, story_url")
    .limit(6);

  if (newsError) {
    console.error("[NEWS DIGEST LOAD ERROR]", newsError);
  }

  diag("news digest loaded", {
    items: newsDigest?.length ?? 0,
  });

  // ----------------------------------------------------------
  // RESEARCH CONTEXT
  // ----------------------------------------------------------
  const researchContext = await readHubbleResearchContext(10);
  const didResearch = researchContext.length > 0;

  // ----------------------------------------------------------
  // FINAL CONTEXT BUNDLE (BINDING)
  // ----------------------------------------------------------
  return {
    persona: "Solace",
    memoryPack: {
      facts,
      episodic,
      autobiography,
      sessionCompaction,
      sessionState,
    },
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
