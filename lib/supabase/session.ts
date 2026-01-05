// /lib/supabase/session.ts
// ------------------------------------------------------------
// SERVER-ONLY session resolver.
//
// IMPORTANT ARCHITECTURAL RULE:
// - Browser auth MUST be handled exclusively by
//   @supabase/auth-helpers-nextjs via createClientComponentClient()
// - This file MUST NOT create or access browser-side Supabase clients
// - This prevents duplicate session recovery, cookie races,
//   and Supabase v2 JSON parse failures
// ------------------------------------------------------------

import { headers } from "next/headers";
import { createSupabaseServerClient } from "./server";

/**
 * Load the session in a SERVER environment.
 *
 * Used by:
 *   - Chat routes
 *   - Assemblers
 *   - Memory reads
 *   - Protected pages
 *   - Middleware identity checks
 *
 * Notes:
 * - Next.js 16 requires `await headers()`
 * - Raw cookie header is passed through untouched
 * - Supabase handles PKCE + base64 cookies internally
 */
export async function getServerSession() {
  const hdr = await headers();
  const cookieHeader = hdr.get("cookie") ?? "";

  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}

/**
 * 🚫 Browser-side session access has been intentionally removed.
 *
 * Browser code MUST use:
 *   getSupabaseBrowser().auth.getSession()
 *
 * This file is SERVER-ONLY by design.
 * Any attempt to reintroduce browser auth here
 * will re-create the duplicate session recovery bug.
 */
