// ------------------------------------------------------------
// Solace Context Assembler
// Phase B + Phase 5 (WM-READ-ONLY)
// NEXT 16 SAFE
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { FACTS_LIMIT, EPISODES_LIMIT } from "./context.constants";
import { readHubbleResearchContext } from "@/lib/research/hubble-reader";

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
export type NewsDigestItem = {
  story_title: string;
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
  researchContext: any[];
  authorities: any[];
  newsDigest: NewsDigestItem[];
  didResearch: boolean;
};

// ------------------------------------------------------------
// MAIN ASSEMBLER
// ------------------------------------------------------------
export async function assembleContext(
  canonicalUserKey: string,
  workspaceId: string | null,
  userMessage: string
): Promise<SolaceContextBundle> {
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
      researchContext: [],
      authorities: [],
      newsDigest: [],
      didResearch: false,
    };
  }

  const authUserId = user.id;

  const [facts, episodic, autobiography] = await Promise.all([
    supabase
      .schema("memory")
      .from("memories")
      .select("content")
      .eq("user_id", authUserId)
      .eq("memory_type", "fact")
      .limit(FACTS_LIMIT)
      .then((r) => r.data ?? []),

    supabase
      .schema("memory")
      .from("memories")
      .select("content")
      .eq("user_id", authUserId)
      .eq("memory_type", "episodic")
      .limit(EPISODES_LIMIT)
      .then((r) => r.data ?? []),

    supabase
      .schema("memory")
      .from("memories")
      .select("content")
      .eq("user_id", authUserId)
      .eq("memory_type", "identity")
      .limit(25)
      .then((r) => r.data ?? []),
  ]);

  const researchContext = await readHubbleResearchContext(10);

  const { data: newsDigest } = await supabase
    .from("solace_news_digest_view")
    .select("story_title, outlet, neutral_summary, created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  return {
    persona: "Solace",
    memoryPack: {
      facts,
      episodic,
      autobiography,
    },
    researchContext,
    authorities: [],
    newsDigest: (newsDigest ?? []) as NewsDigestItem[],
    didResearch: researchContext.length > 0,
  };
}
