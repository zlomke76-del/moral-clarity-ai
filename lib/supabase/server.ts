// lib/supabase/server.ts
// Guaranteed-safe server Supabase client (Next.js 16 / Vercel Edge)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serverClient: SupabaseClient | null = null;

/**
 * Return a singleton Supabase server client instance.
 * Never a function — always the real client.
 */
export function supabaseServer(): SupabaseClient {
  if (!serverClient) {
    serverClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!, // server key, bypasses RLS
      {
        auth: {
          persistSession: false,
        },
      }
    );
  }

  return serverClient;
}
