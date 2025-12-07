// app/api/chat/modules/assembleContext.ts
// -------------------------------------------------------------
// Loads ALL memory for the user via canonical key (email).
// No personas table lookups. No fallback to "tim". No drift.
// -------------------------------------------------------------

import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";
import { createClient } from "@supabase/supabase-js";

export async function assembleContext(
  overrideUserKey: string | null,
  workspaceId: string | null,
  message: string
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-side access
  );

  // Always use canonical email unless caller overrides (rare)
  const authIdentity = await getCanonicalUserKey();
  const userKey = overrideUserKey || authIdentity.canonicalKey;

  // ------------------------------
  // 1. Load FACT memories
  // ------------------------------
  const { data: facts } = await supabase
    .from("user_memories")
    .select("*")
    .eq("canonical_user_key", userKey)
    .order("created_at", { ascending: false });

  // ------------------------------
  // 2. Load EPISODIC memories
  // ------------------------------
  const { data: episodes } = await supabase
    .from("episodic_memories")
    .select("*")
    .eq("canonical_user_key", userKey)
    .order("created_at", { ascending: false });

  // ------------------------------
  // 3. Load CHUNKS (episode messages)
  // ------------------------------
  const { data: chunks } = await supabase
    .from("memory_episode_chunks")
    .select("*")
    .in(
      "episode_id",
      episodes?.map((e: any) => e.id) || []
    );

  return {
    userKey,
    facts: facts || [],
    episodes: episodes || [],
    chunks: chunks || [],
    message,
    workspaceId,
  };
}

