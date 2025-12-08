// /lib/supabase/session.ts
// ------------------------------------------------------------
// Centralized session resolver for both server + client.
// Fully compatible with:
//   - Next.js 16 async headers()
//   - Manual cookieHeader-based createClientServer()
//   - Magic link implicit flow + /auth/exchange
// ------------------------------------------------------------

import { headers } from "next/headers";
import { createClientServer } from "./server";
import { createClientBrowser } from "./client";

/**
 * Safely load the session in a SERVER environment.
 * This is used by:
 *   - Chat route
 *   - Assemblers
 *   - Memory reads
 *   - Protected pages
 *   - Middleware identity checks
 *
 * IMPORTANT:
 *   Next.js 16 requires `await headers()`.
 *   Using raw cookieHeader preserves Supabase's magic link session.
 */
export async function getServerSession() {
  // headers() must be awaited — this is the only important change
  const hdr = await headers();
  const cookieHeader = hdr.get("cookie") ?? "";

  // Build SSR Supabase client with the incoming cookies
  const supabase = createClientServer(cookieHeader);

  // Retrieve auth session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

/**
 * Browser-side session accessor.
 * This remains unchanged — the browser client handles:
 *   - persistSession
 *   - autoRefreshToken
 *   - detectSessionInUrl (for magic link)
 */
export async function getBrowserSession() {
  const supabase = createClientBrowser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}


