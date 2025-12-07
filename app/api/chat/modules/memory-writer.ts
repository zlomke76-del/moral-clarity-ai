// app/api/chat/modules/memory-writer.ts
// -----------------------------------------------------------------------------
// Solace Memory Writer — Unified Canonical Memory System
// Always writes to canonical_user_key = user's email identity.
// -----------------------------------------------------------------------------


import { supabaseEdge } from "@/lib/supabase/edge";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

export async function writeMemory(
  _userKey: string,             // ignored — we rely on canonical identity
  userMessage: string,
  modelReply: string
) {
  try {
    // ---------------------------------------------------------
    // 1) Resolve canonical identity (email-based)
    // ---------------------------------------------------------
    const { canonicalKey } = await getCanonicalUserKey();

    if (!canonicalKey || canonicalKey === "guest") {
      console.warn("[memory-writer] No canonical identity — skipping save");
      return;
    }

    // ---------------------------------------------------------
    // 2) Basic sanity filters
    // ---------------------------------------------------------
    if (!userMessage || typeof userMessage !== "string") return;
    if (!modelReply || typeof modelReply !== "string") return;

    // ---------------------------------------------------------
    // 3) Insert into user_memories (fact memory)
    // ---------------------------------------------------------
    const { error } = await supabaseEdge.from("user_memories").insert({
      canonical_user_key: canonicalKey,
      kind: "fact",
      content: userMessage,
      source: "chat:user",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[memory-writer] Insert error:", error);
    }

  } catch (err) {
    console.error("[memory-writer] Fatal error:", err);
  }
}

