// lib/supabaseBrowser.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client.
 * Uses NEXT_PUBLIC_* env vars so it can run on the client.
 */
export function createSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // When a Supabase auth token exists in the URL, the client will process it.
      detectSessionInUrl: true,
    },
  });
}
