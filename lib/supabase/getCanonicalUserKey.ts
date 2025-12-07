// lib/supabase/getCanonicalUserKey.ts
// -----------------------------------------------------------------------------
// Derives the *canonical user identity* for memory purposes.
//
// This works on Vercel Edge Runtime by decoding the Supabase JWT manually.
// We DO NOT use "@supabase/auth-helpers-remix" or any Node APIs.
// -----------------------------------------------------------------------------

import { supabaseEdge } from "./edge";

export async function getCanonicalUserKey(req?: Request) {
  try {
    // ---------------------------------------------------------
    // 1. Extract the session token from cookies (Edge safe)
    // ---------------------------------------------------------
    const cookieHeader = req?.headers.get("cookie") || "";

    let accessToken: string | null = null;

    // Supabase stores the auth token in this cookie key:
    //   sb-access-token=<jwt>
    // The cookie may contain several values → parse manually.
    for (const c of cookieHeader.split(";")) {
      const trimmed = c.trim();
      if (trimmed.startsWith("sb-access-token=")) {
        accessToken = trimmed.replace("sb-access-token=", "");
        break;
      }
    }

    // ---------------------------------------------------------
    // 2. Decode user from token using Supabase (Edge client)
    // ---------------------------------------------------------
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
    }

    // ---------------------------------------------------------
    // 3. FALLBACK (unauthenticated, or guest mode)
    // ---------------------------------------------------------
    return {
      canonicalKey: "guest",
      email: null,
      userId: null,
    };

  } catch (err) {
    console.error("[getCanonicalUserKey] fatal:", err);

    return {
      canonicalKey: "guest",
      email: null,
      userId: null,
    };
  }
}

