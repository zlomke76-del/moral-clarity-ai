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

  // reference data (non-memory)
  rolodex?: any[];
};

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

  console.log("[DIAG-ASSEMBLE]", {
    canonicalUserKey,
    workspaceId,
    conversationId,
  });

  const cookieStore = await cookies();

  // ----------------------------------------------------------
  // USER-SCOPED CLIENT (SSR, RLS-BOUND)
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
  // SERVICE / ADMIN CLIENT (RLS BYPASS)
  // ----------------------------------------------------------
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
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
      rolodex: [],
    };
  }

  const authUserId = user.id;

  // ----------------------------------------------------------
  // FACTUAL MEMORY
  // ----------------------------------------------------------
  const factsRes = await supabaseAdmin
    .schema("memory")
    .from("memories")
    .select("content, created_at")
    .eq("user_id", authUserId)
    .eq("memory_type", "fact")
    .order("created_at", { ascending: false })
    .limit(FACTS_LIMIT);

  const factualMemories = Array.isArray(factsRes.data)
    ? factsRes.data.map((m) => m.content)
    : [];

  console.log("[DIAG-ASSEMBLE-FACTS]", {
    count: factualMemories.length,
  });

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

  console.log("[DIAG-ASSEMBLE-HUBBLE]", {
    count: researchItems.length,
  });

  // ----------------------------------------------------------
  // WORKING MEMORY
  // ----------------------------------------------------------
  let wmItems: WorkingMemoryItem[] = [];

  if (conversationId) {
    const wmRes = await supabaseAdmin
      .schema("memory")
      .from("working_memory")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .eq("user_id", authUserId)
      .order("created_at", { ascending: true });

    wmItems = Array.isArray(wmRes.data) ? wmRes.data : [];
  }

  console.log("[DIAG-ASSEMBLE-WM]", {
    conversationId,
    count: wmItems.length,
  });

  // ----------------------------------------------------------
  // ROLODEX — AUTHORITATIVE READ (FIXED)
  // ----------------------------------------------------------
  const rolodexRes = await supabaseAdmin
    .schema("memory")
    .from("rolodex")
    .select("*")
    .eq("user_id", authUserId)
    .order("created_at", { ascending: false });

  const rolodexItems = Array.isArray(rolodexRes.data)
    ? rolodexRes.data
    : [];

  console.log("[DIAG-ASSEMBLE-ROLODEX]", {
    count: rolodexItems.length,
  });

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

    // reference only
    rolodex: rolodexItems,
  };
}
