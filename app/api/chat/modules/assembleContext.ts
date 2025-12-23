// ------------------------------------------------------------
// Solace Context Assembler
// Authoritative Read Path
//------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { FACTS_LIMIT, EPISODES_LIMIT } from "./context.constants";

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
  // FACTUAL MEMORY (AUTHORITATIVE, DURABLE)
  // ----------------------------------------------------------
  const factsRes = await supabaseService
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
  // WORKING MEMORY (LIVE, SESSION-SCOPED)
  // ----------------------------------------------------------
  let wmItems: WorkingMemoryItem[] = [];

  if (conversationId) {
    const wmRes = await supabaseService
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
    sample: wmItems.slice(0, 2),
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
    researchContext: [],
    authorities: [],
    newsDigest: [],
    didResearch: false,
  };
}
