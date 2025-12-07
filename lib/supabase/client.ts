// lib/supabase/client.ts
// Canonical browser-side Supabase client (Next.js 16+)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser Supabase client.
 * Safe in client components and hooks.
 * IMPORTANT:
 *  - persistSession MUST be true
 *  - storage MUST be 'cookie'
 *  - cookies must be enabled for Edge to read sb-access-token
 */
export function supabaseBrowser(): SupabaseClient {
  if (!URL || !ANON) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
  }

  return createClient(URL, ANON, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,

      // THIS is the critical fix:
      // store session tokens in cookies so Edge routes can read them
      storage: "cookie",

      // Let Supabase manage cookie names & expiration
      cookieOptions: {
        domain: ".moralclarity.ai",
        path: "/",
        sameSite: "none",
        secure: true,
      },
    },
  });
}

// Backwards compat
export function createSupabaseBrowser(): SupabaseClient {
  return supabaseBrowser();
}

export type { SupabaseClient };

