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
    sessionId: string; // conversation scoped
    sessionStartedAt: string;
  }
): Promise<SolaceContextBundle> {
  diag("assemble start", {
    canonicalUserKey,
    workspaceId,
    sessionId: session?.sessionId,
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
  } = await supabase.auth.getUser();

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

  // ------------------------------------------------------------
  // MEMORY (READ-ONLY)
  // ------------------------------------------------------------
  const [facts, episodic, autobiography] = await Promise.all([
    supabase
      .schema("memory")
      .from("memories")
      .select("id, content, created_at")
      .eq("user_id", authUserId)
      .eq("memory_type", "fact")
      .order("created_at", { ascending: false })
      .limit(FACTS_LIMIT)
      .then((r) => safeRows(r.data)),

    supabase
      .schema("memory")
      .from("memories")
      .select("id, content, created_at")
      .eq("user_id", authUserId)
      .eq("memory_type", "episodic")
      .order("created_at", { ascending: false })
      .limit(EPISODES_LIMIT)
      .then((r) => safeRows(r.data)),

    supabase
      .schema("memory")
      .from("memories")
      .select("id, content, created_at")
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
    sessionId: session?.sessionId,
  });

  // ------------------------------------------------------------
  // WORKING MEMORY (PERSISTENT PER CONVERSATION)
  // ------------------------------------------------------------
  const conversationId = session?.sessionId ?? null;

  let wmItems: WorkingMemoryItem[] = [];

  if (conversationId) {
    const wmRes = await supabase
      .schema("memory")
      .from("working_memory")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .eq("user_id", authUserId)
      .order("created_at", { ascending: true })
      .limit(200);

    wmItems = safeRows(wmRes.data) as WorkingMemoryItem[];
  }

  // Initialize only once per conversation
  if (conversationId && wmItems.length === 0) {
    const initItem: WorkingMemoryItem = {
      role: "system",
      content: "Session initialized.",
      created_at: new Date().toISOString(),
    };

    await supabase.schema("memory").from("working_memory").insert({
      conversation_id: conversationId,
      user_id: authUserId,
      workspace_id: workspaceId,
      role: initItem.role,
      content: initItem.content,
    });

    // Re-read after init (so caller always gets authoritative rows)
    const wmRes2 = await supabase
      .schema("memory")
      .from("working_memory")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .eq("user_id", authUserId)
      .order("created_at", { ascending: true })
      .limit(200);

    wmItems = safeRows(wmRes2.data) as WorkingMemoryItem[];

    console.log("[WM] initialized", {
      sessionId: conversationId,
      items: wmItems.length,
    });
  } else {
    console.log("[WM] loaded", {
      sessionId: conversationId,
      items: wmItems.length,
    });
  }

  // ------------------------------------------------------------
  // RESEARCH
  // ------------------------------------------------------------
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
    newsDigest: [],
    didResearch,
  };
}
