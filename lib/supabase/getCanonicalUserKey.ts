// lib/supabase/getCanonicalUserKey.ts
// -------------------------------------------------------------
// Resolves a stable per-user identity for memory lookup.
// Canonical key = email (preferred) → user_id → "guest"
// -------------------------------------------------------------

import { supabaseEdge } from "./edge";

export type CanonicalUserIdentity = {
  canonicalKey: string;  // always string
  email: string | null;  // nullable
  userId: string | null; // nullable
};

export async function getCanonicalUserKey(
  req: Request
): Promise<CanonicalUserIdentity> {
  try {
    const { data, error } = await supabaseEdge.auth.getUser();

    if (error || !data?.user) {
      return {
        canonicalKey: "guest",
        email: null,
        userId: null,
      };
    }

    const email = data.user.email ?? null;          // NEVER undefined
    const userId = data.user.id ?? null;            // NEVER undefined

    // canonicalKey rules:
    // 1. email (best)
    // 2. userId (fallback)
    // 3. "guest"
    const canonicalKey = email || userId || "guest";

    return {
      canonicalKey,
      email,
      userId,
    };
  } catch (err) {
    console.error("[getCanonicalUserKey] failure:", err);
    return {
      canonicalKey: "guest",
      email: null,
      userId: null,
    };
  }
}

