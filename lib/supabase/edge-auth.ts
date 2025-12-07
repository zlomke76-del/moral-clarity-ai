// lib/supabase/edge-auth.ts
// -------------------------------------------------------
// Unified identity extractor for Edge Functions
// Ensures memory is tied to the REAL Supabase user
// -------------------------------------------------------

import { supabaseEdge } from "./edge";

export async function getUserFromRequest(req: Request) {
  const accessToken =
    req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;

  if (!accessToken) return null;

  // Validate token & fetch user session
  const {
    data: { user },
    error,
  } = await supabaseEdge.auth.getUser(accessToken);

  if (error || !user) return null;

  return user;
}

/**
 * Returns the canonical user identity for all memory operations.
 * If the user is logged in → email
 * If not logged in → "guest"
 */
export async function getCanonicalUserKey(req: Request): Promise<string> {
  const user = await getUserFromRequest(req);

  if (!user || !user.email) return "guest";

  return user.email.toLowerCase();
}
