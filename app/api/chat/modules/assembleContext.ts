// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (WM-READ-ONLY)
// SESSION-VERIFIED — Option C
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
export type SessionEnvelope = {
  sessionId: string;
  sessionStartedAt: string;
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
    items: any[];
  };
  researchContext: any[];
  authorities: any[];
  newsDigest: any[];
  didResearch: boolean;
  session: {
    id: string;
    verified: boolean;
  };
};

// ------------------------------------------------------------
// Diagnostics
// ------------------------------------------------------------
function diag(label: string, payload: any) {
  console.log(`[DIAG-CTX] ${label}`, payload);
}

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
  session: SessionEnvelope
): Promise<SolaceContextBundle> {
  diag("assemble start", {
    canonicalUserKey,
    workspaceId,
    sessionId: session?.sessionId,
    preview: userMessage.slice(0, 80),
  });

  if (!session?.sessionId) {
    diag("session invalid", { reason: "missing_session_id" });
    throw new Error("Session ID missing at context boundary");
  }

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
      sessionId: session.sessionId,
    });

    return {
      persona: "Solace",
      memoryPack: { facts: [], episodic: [], autobiography: [] },
      workingMemory: { active: false, items: [] },
      researchContext: [],
      authorities: [],
      newsDigest: [],
      didResearch: false,
      session: {
        id: session.sessionId,
        verified: false,
      },
    };
  }

  const authUserId = user.id;

  console.log("[SESSION] verified", {
    sessionId: session.sessionId,
    authUserId,
    workspaceId,
  });

  // ------------------------------------------------------------
  // MEMORY (READ ONLY)
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
    sessionId: session.sessionId,
  });

  // ------------------------------------------------------------
  // RESEARCH
  // ------------------------------------------------------------
  const researchContext = await readHubbleResearchContext(10);
  const didResearch = researchContext.length > 0;

  diag("research context", {
    count: researchContext.length,
    sessionId: session.sessionId,
  });

  return {
    persona: "Solace",
    memoryPack: { facts, episodic, autobiography },
    workingMemory: { active: false, items: [] },
    researchContext,
    authorities: [],
    newsDigest: [],
    didResearch,
    session: {
      id: session.sessionId,
      verified: true,
    },
  };
}
