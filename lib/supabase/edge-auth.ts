// lib/supabase/edge-auth.ts
// Unified identity extractor for Edge Functions.
// Pulls user identity from Supabase cookies.

import { getEdgeUser } from "./edge-user";

/**
 * Returns full user object, or null if not authenticated.
 */
export async function getUserFromRequest(req: Request) {
  return await getEdgeUser(req);
}

/**
 * Returns canonical user identity:
 *  - Signed-in user: email (lowercase)
 *  - Not signed in: null
 *
 * We DO NOT return "guest" anymore.
 * "guest" caused all your memory corruption.
 */
export async function getCanonicalUserKey(req: Request): Promise<string | null> {
  const user = await getEdgeUser(req);

  if (!user || !user.email) return null;

  return user.email;
}
