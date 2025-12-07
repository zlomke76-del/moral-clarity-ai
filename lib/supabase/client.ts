// lib/supabase/client.ts
// Canonical browser-side Supabase client (Next.js 16+)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser Supabase client.
 * Safe in client components and hooks.
 */
export function supabaseBrowser(): SupabaseClient {
  if (!URL || !ANON) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
  }

  return createClient(URL, ANON, {
    auth: {
      persistSession: true,     // enables Supabase cookie storage
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Backwards-compat alias for older code.
 */
export function createSupabaseBrowser(): SupabaseClient {
  return supabaseBrowser();
}

export type { SupabaseClient };
