// ------------------------------------------------------------
// Solace Context Assembler
// NEWS DIGEST — DAY-SCOPED + NEUTRAL SUMMARY
// NEXT 16 SAFE
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
export type NewsDigestItem = {
  ledger_id: string;
  story_title: string;
  outlet: string;
  story_url: string;
  neutral_summary: string;
  key_facts: string[] | null;
  pi_score: number | null;
  created_at: string;
  day: string;
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
  newsDigest: NewsDigestItem[];
  didResearch: boolean;
};

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

function inferDayScope(message: string): "today" | "yesterday" | "week" | "all" {
  const m = message.toLowerCase();
  if (m.includes("today")) return "today";
  if (m.includes("yesterday")) return "yesterday";
  if (m.includes("week") || m.includes("7")) return "week";
  return "all";
}

function filterByDay(
  rows: NewsDigestItem[],
  scope: "today" | "yesterday" | "week" | "all"
): NewsDigestItem[] {
  if (scope === "all") return rows;

  const today = new Date().toISOString().slice(0, 10);

  if (scope === "today") {
    return rows.filter((r) => r.day === today);
  }

  if (scope === "yesterday") {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.toISOString().slice(0, 10);
    return rows.filter((r) => r.day === y);
  }

  if (scope === "week") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return rows.filter(
      (r) => new Date(r.created_at) >= cutoff
    );
  }

  return rows;
}

// ------------------------------------------------------------
// MAIN
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

  const researchContext = await readHubbleResearchContext(10);
  const didResearch = researchContext.length > 0;

  const scope = inferDayScope(userMessage);

  const { data } = await supabase
    .from("solace_news_digest_view")
    .select(`
      ledger_id,
      story_title,
      outlet,
      story_url,
      neutral_summary,
      key_facts,
      pi_score,
      created_at,
      day
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  const digest = filterByDay(
    safeRows(data as NewsDigestItem[]),
    scope
  );

  return {
    persona: "Solace",
    memoryPack: { facts: [], episodic: [], autobiography: [] },
    workingMemory: { active: false, items: [] },
    researchContext,
    authorities: [],
    newsDigest: digest,
    didResearch,
  };
}
