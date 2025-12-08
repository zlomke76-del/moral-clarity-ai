// /lib/canonicalUserKey.ts
// ------------------------------------------------------------
// Single source of truth for user identity inside MCAI.
// Safe for Next.js 16 (headers().get("cookie")) and your new
// SSR Supabase client factory.
// ------------------------------------------------------------

import { headers } from "next/headers";
import { createClientServer } from "./supabase/server";

/**
 * Returns the canonical user key:
 *   - Authenticated user → session.user.id
 *   - No session → "guest"
 *
 * This ensures all MCAI modules behave deterministically
 * regardless of where they run (API routes, server actions,
 * orchestrator, news digests, memory pipeline).
 */
export async function getCanonicalUserKey(): Promise<string> {
  // Pull raw cookie header from request context
  const cookieHeader = headers().get("cookie") ?? "";

  // Build SSR Supabase client using the safe cookieHeader method
  const supabase = createClientServer(cookieHeader);

  // Retrieve session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If logged in → return stable identity
  if (session?.user?.id) {
    return session.user.id;
  }

  // Otherwise → deterministic guest bucket
  return "guest";
}
