// app/api/chat/modules/memory-writer.ts
// -------------------------------------------------------------
// Writes memories using the canonical user key only.
// No variant identities. No drift. Ever.
// -------------------------------------------------------------

import { createClient } from "@supabase/supabase-js";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

export async function writeMemory(
  _userKey: string,
  userMessage: string,
  assistantMessage: string
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { canonicalKey } = await getCanonicalUserKey();

    await supabase.from("user_memories").insert({
      canonical_user_key: canonicalKey,
      user_key: canonicalKey,
      kind: "fact",
      content: assistantMessage,
      weight: 1,
      source: "chat",
    });
  } catch (err) {
    console.error("[writeMemory] FAILED:", err);
  }
}
