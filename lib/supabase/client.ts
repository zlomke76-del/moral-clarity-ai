// lib/supabase/client.ts
// Browser-side Supabase client (PKCE + cookies)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function supabaseBrowser(): SupabaseClient {
  return createClient(URL, ANON, {
    auth: {
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const createSupabaseBrowser = supabaseBrowser;

export type { SupabaseClient };
