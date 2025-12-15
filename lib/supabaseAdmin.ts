// lib/supabaseAdmin.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
}

if (!SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
}

/**
 * Server-only Supabase admin client.
 * - Uses SERVICE ROLE KEY only
 * - No cookies
 * - No sessions
 * - No SSR helpers
 * - Fail-fast if misconfigured
 */
export function createSupabaseAdmin(): SupabaseClient {
  // TypeScript now knows these are strings
  const url: string = SUPABASE_URL;
  const key: string = SERVICE_ROLE_KEY;

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "moral-clarity-ai-admin",
      },
    },
  });
}
