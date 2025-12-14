// ------------------------------------------------------------
// Hubble Research Context Reader
// READ-ONLY — SAFE CONTEXT ENRICHMENT
// NEXT 16 COMPATIBLE
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export type HubbleResearchItem = {
  id: string;
  title?: string;
  summary?: string;
  source?: string;
  created_at?: string;
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function safeRows<T>(rows: T[] | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------
export async function readHubbleResearchContext(
  limit: number
): Promise<HubbleResearchItem[]> {
  // ----------------------------------------------------------
  // cookies() IS ASYNC IN NEXT 16
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // Read research context (READ ONLY)
  // SCHEMA MUST BE POSTGREST-EXPOSED
  // ----------------------------------------------------------
  const { data, error } = await supabase
    .schema("mca")
    .from("hubble_context")
    .select("id, title, summary, source, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[HUBBLE READER ERROR]", error.message);
    return [];
  }

  return safeRows(data);
}
