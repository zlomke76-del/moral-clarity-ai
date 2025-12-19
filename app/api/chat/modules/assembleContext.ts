// ------------------------------------------------------------
// Solace Context Assembler
// AUTHORITATIVE READ PATH (BINDING)
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { FACTS_LIMIT, EPISODES_LIMIT } from "./context.constants";

export async function assembleContext(
  canonicalUserKey: string,
  workspaceId: string | null,
  userMessage: string,
  session?: { sessionId: string }
) {
  const cookieStore = await cookies();

  const supabaseUser = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value, set() {}, remove() {} } }
  );

  const supabaseService = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get() {}, set() {}, remove() {} } }
  );

  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return { persona: "Solace", memoryPack: {}, workingMemory: { active: false } };
  }

  const userId = user.id;

  const facts = await supabaseUser
    .schema("memory")
    .from("memories")
    .select("content")
    .eq("user_id", userId)
    .eq("memory_type", "fact")
    .limit(FACTS_LIMIT);

  let sessionSummary = null;

  if (session?.sessionId) {
    const res = await supabaseService
      .schema("memory")
      .from("memories")
      .select("content")
      .eq("memory_type", "session_compaction")
      .eq("conversation_id", session.sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (res?.data?.content) {
      sessionSummary = JSON.parse(res.data.content);
    }
  }

  return {
    persona: "Solace",
    memoryPack: {
      facts: facts.data ?? [],
      sessionSummary,
    },
    workingMemory: {
      active: Boolean(session?.sessionId),
    },
  };
}
