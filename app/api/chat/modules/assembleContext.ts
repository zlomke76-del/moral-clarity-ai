// ------------------------------------------------------------
// Solace Context Assembler
// Authoritative Read Path
//------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
  RESEARCH_CONTEXT_LIMIT,
} from "./context.constants";

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
    sessionCompaction?: any | null;
    sessionState?: any | null;
  };
  workingMemory: {
    active: boolean;
    items: WorkingMemoryItem[];
  };
  researchContext: any[];
  authorities: any[];
  newsDigest: any[];
  didResearch: boolean;
  rolodex?: any[];
};

// ------------------------------------------------------------
// NON-CONTEXTUAL ARTIFACT DETECTION
// ------------------------------------------------------------
function isNonContextualArtifact(content: string): boolean {
  if (!content) return false;
  const c = content.trim();
  return c.startsWith("data:image/") || c.startsWith("<img") || c.startsWith("![");
}

// ------------------------------------------------------------
// SESSION ENVELOPE
// ------------------------------------------------------------
type ContextSessionEnvelope = {
  sessionId: string;
  sessionStartedAt: string;
  executionProfile?: "studio" | "demo";
};

// ------------------------------------------------------------
// CONSTANTS (ADDITIVE)
// ------------------------------------------------------------
const DEMO_USER_ID = "demo-session";
const DEMO_WM_LIMIT = 10;

// ------------------------------------------------------------
// MAIN ASSEMBLER
// ------------------------------------------------------------
export async function assembleContext(
  canonicalUserKey: string,
  workspaceId: string | null,
  userMessage: string,
  session?: ContextSessionEnvelope
): Promise<SolaceContextBundle> {
  const conversationId = session?.sessionId ?? null;
  const executionProfile = session?.executionProfile ?? "studio";

  console.log("[DIAG-ASSEMBLE]", {
    canonicalUserKey,
    workspaceId,
    conversationId,
    executionProfile,
  });

  const cookieStore = await cookies();

  // ----------------------------------------------------------
  // USER-SCOPED CLIENT
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
  // ADMIN CLIENT
  // ----------------------------------------------------------
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  const isDemo = executionProfile === "demo";
  const effectiveUserId = user?.id ?? (isDemo ? DEMO_USER_ID : null);

  // ----------------------------------------------------------
  // DEMO MODE — NO USER, SESSION-ONLY CONTEXT
  // ----------------------------------------------------------
  if (!user && isDemo) {
    let demoWM: WorkingMemoryItem[] = [];

    if (conversationId) {
      const wmRes = await supabaseAdmin
        .schema("memory")
        .from("working_memory")
        .select("id, role, content, created_at")
        .eq("conversation_id", conversationId)
        .eq("user_id", DEMO_USER_ID)
        .order("created_at", { ascending: false })
        .limit(DEMO_WM_LIMIT);

      demoWM = Array.isArray(wmRes.data)
        ? wmRes.data.reverse()
        : [];
    }

    return {
      persona: "Solace",
        executionProfile,
        memoryPack: {
        facts: [],
        episodic: [],
        autobiography: [],
        sessionCompaction: null,
        sessionState: null,
      },
      workingMemory: {
        active: Boolean(conversationId),
        items: demoWM,
      },
      researchContext: [],
      authorities: [],
      newsDigest: [],
      didResearch: false,
      rolodex: [],
    };
  }

  // ----------------------------------------------------------
  // STUDIO MODE — AUTH REQUIRED (UNCHANGED)
  // ----------------------------------------------------------
  if (!effectiveUserId) {
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
      rolodex: [],
    };
  }

  // ----------------------------------------------------------
  // FACTUAL MEMORY (STUDIO ONLY)
  // ----------------------------------------------------------
  const factsRes = await supabaseAdmin
    .schema("memory")
    .from("memories")
    .select("content, created_at")
    .eq("user_id", effectiveUserId)
    .eq("memory_type", "fact")
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  const factualMemories = Array.isArray(factsRes.data)
    ? factsRes.data.map((m) => m.content)
    : [];

  // ----------------------------------------------------------
  // RESEARCH CONTEXT
  // ----------------------------------------------------------
  const hubbleRes = await supabaseAdmin
    .schema("research")
    .from("hubble_ingest_v1")
    .select("*")
    .order("timestamp_utc", { ascending: false })
    .limit(RESEARCH_CONTEXT_LIMIT);

  const researchItems = Array.isArray(hubbleRes.data)
    ? hubbleRes.data
    : [];

  // ----------------------------------------------------------
  // WORKING MEMORY (STUDIO)
  // ----------------------------------------------------------
  let wmItems: WorkingMemoryItem[] = [];

  if (conversationId) {
    const wmRes = await supabaseAdmin
      .schema("memory")
      .from("working_memory")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .eq("user_id", effectiveUserId)
      .order("created_at", { ascending: true });

    wmItems = Array.isArray(wmRes.data) ? wmRes.data : [];
  }

  wmItems = wmItems.map((item) => {
    if (
      item.role === "assistant" &&
      typeof item.content === "string" &&
      isNonContextualArtifact(item.content)
    ) {
      return { ...item, content: "[Image generated]" };
    }
    return item;
  });

  // ----------------------------------------------------------
  // ROLODEX
  // ----------------------------------------------------------
  const rolodexRes = await supabaseAdmin
    .schema("memory")
    .from("rolodex")
    .select("*")
    .eq("user_id", effectiveUserId)
    .order("created_at", { ascending: false });

  const rolodexItems = Array.isArray(rolodexRes.data)
    ? rolodexRes.data
    : [];

  // ----------------------------------------------------------
  // RETURN CONTEXT
  // ----------------------------------------------------------
  return {
    persona: "Solace",
    memoryPack: {
      facts: factualMemories,
      episodic: [],
      autobiography: [],
      sessionCompaction: null,
      sessionState: null,
    },
    workingMemory: {
      active: Boolean(conversationId),
      items: wmItems,
    },
    researchContext: researchItems,
    authorities: [],
    newsDigest: [],
    didResearch: researchItems.length > 0,
    rolodex: rolodexItems,
  };
}
