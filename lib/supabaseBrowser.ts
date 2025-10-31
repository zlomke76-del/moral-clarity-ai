// lib/supabaseBrowser.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function createSupabaseBrowser(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("createSupabaseBrowser() must be called in the browser.");
  }
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  _client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // keep true if you use /auth/callback
    },
  });
  return _client;
}

// Back-compat default import:  import supabase from '@/lib/supabaseBrowser'
export default createSupabaseBrowser;
