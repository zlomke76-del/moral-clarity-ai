// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (WM-ACTIVE, SESSION-ONLY)
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  FACTS_LIMIT,
  EPISODES_LIMIT,
} from "./context.constants";

import { readHubbleResearchContext } from "@/lib/research/hubble-reader";

export type SessionEnvelope = {
  sessionId: string;
  sessionStartedAt: string;
};

export type WorkingMemoryItem = {
  role: "system" | "user" | "assistant";
  content: string;
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
    sessionId: string;
    items: WorkingMemoryItem[];
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

function diag(label: string, payload: any) {
  console.log(`[DIAG-CTX] ${label}`, payload);
}

function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

export async function assembleContext(
  canonicalUserKey: string,
  workspaceId: string | null,
  userMessage: string,
  session: SessionEnvelope
): Promise<SolaceContextBundle> {
  diag("assemble start", {
    canonicalUserKey,
    workspaceId,
    sessionId: session.sessionId,
  });

  if (!session?.sessionId) {
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
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      persona: "Solace",
      memoryPack: { facts: [], episodic: [], autobiography: [] },
      workingMemory: {
        active: false,
        sessionId: session.sessionId,
        items: [],
      },
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

  // ---------------- MEMORY (READ ONLY) ----------------
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
    sessionId: session.sessionId,
  });

  // ---------------- WORKING MEMORY ----------------
  const workingMemory: WorkingMemoryItem[] = [
    {
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    },
  ];

  console.log("[WM] initialized", {
    sessionId: session.sessionId,
    items: workingMemory.length,
  });

  const researchContext = await readHubbleResearchContext(10);

  return {
    persona: "Solace",
    memoryPack: { facts, episodic, autobiography },
    workingMemory: {
      active: true,
      sessionId: session.sessionId,
      items: workingMemory,
    },
    researchContext,
    authorities: [],
    newsDigest: [],
    didResearch: researchContext.length > 0,
    session: {
      id: session.sessionId,
      verified: true,
    },
  };
}
