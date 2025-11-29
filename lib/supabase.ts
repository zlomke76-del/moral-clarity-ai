// lib/supabase.ts
// Back-compat shim over the new Supabase setup.
// Provides the old helpers: supabaseServer, supabaseService, supabaseBrowser.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseBrowser } from "./supabase/client";

/**
 * Server-side Supabase client using the anon key.
 * (Used by simple API routes like /api/health.)
 */
export function supabaseServer(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        "supabaseServer: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    }
  }

  return createClient(url!, anonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Service-role Supabase client.
 * Used for admin / worker code that needs RLS bypass.
 */
export function supabaseService(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        "supabaseService: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
      );
    }
  }

  return createClient(url!, serviceKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Re-export browser helper so old imports keep working:
 *   import { supabaseBrowser } from "@/lib/supabase"
 */
export { supabaseBrowser };
export type { SupabaseClient };
