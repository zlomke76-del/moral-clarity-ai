// lib/supabase/getCanonicalUserKey.ts
// -----------------------------------------------------------------------------
// Derives the *canonical user identity* for memory purposes.
// - Uses Supabase JWT from the "sb-access-token" cookie.
// - Returns email as canonicalKey when signed in.
// - Returns null when not authenticated (no "guest" identity here).
// -----------------------------------------------------------------------------

import { supabaseEdge } from "./edge";

export async function getCanonicalUserKey(req?: Request) {
  try {
    // 1) Get cookies from the Edge request
    const cookieHeader = req?.headers.get("cookie") || "";

    let accessToken: string | null = null;

    for (const c of cookieHeader.split(";")) {
      const trimmed = c.trim();
      if (trimmed.startsWith("sb-access-token=")) {
        accessToken = trimmed.replace("sb-access-token=", "");
        break;
      }
    }

    // 2) If we found a token, ask Supabase for the user
    if (accessToken) {
      const { data, error } = await supabaseEdge.auth.getUser(accessToken);

      if (!error && data?.user?.email) {
        const email = data.user.email.toLowerCase().trim();

        return {
          canonicalKey: email,
          email,
          userId: data.user.id,
        };
      }

      console.warn("[getCanonicalUserKey] supabaseEdge.auth.getUser error:", error);
    } else {
      console.log("[getCanonicalUserKey] No sb-access-token cookie present.");
    }

    // 3) Not signed in → no canonical identity
    return {
      canonicalKey: null,
      email: null,
      userId: null,
    };
  } catch (err) {
    console.error("[getCanonicalUserKey] fatal:", err);

    return {
      canonicalKey: null,
      email: null,
      userId: null,
    };
  }
}


