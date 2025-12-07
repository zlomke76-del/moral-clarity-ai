// lib/supabase/getCanonicalUserKey.ts
// -----------------------------------------------------------------------------
// Returns the full authenticated email for canonical identity.
// Accepts `req` so cookies are accessible in Edge runtime.
// -----------------------------------------------------------------------------

import { supabaseEdge } from "./edge";

export async function getCanonicalUserKey(req: Request) {
  try {
    // Extract cookies manually (Edge-safe)
    const cookieHeader = req.headers.get("cookie") || "";
    let accessToken: string | null = null;

    for (const c of cookieHeader.split(";")) {
      const t = c.trim();
      if (t.startsWith("sb-access-token=")) {
        accessToken = t.replace("sb-access-token=", "");
        break;
      }
    }

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

    // True guest mode
    return { canonicalKey: "guest", email: null, userId: null };
  } catch (err) {
    console.error("[getCanonicalUserKey] fatal:", err);
    return { canonicalKey: "guest", email: null, userId: null };
  }
}

