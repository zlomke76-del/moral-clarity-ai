// lib/supabase/client.ts
// Canonical browser-side Supabase client (Next.js 16+)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser Supabase client.
 * Forces PKCE (no hash tokens), ensures cookie-based sessions.
 */
export function supabaseBrowser(): SupabaseClient {
  return createClient(URL, ANON, {
    auth: {
      // Forces Supabase to use PKCE instead of implicit flow
      flowType: "pkce",

      // Ensures the session gets stored using cookies
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export function createSupabaseBrowser(): SupabaseClient {
  return supabaseBrowser();
}

export type { SupabaseClient };

