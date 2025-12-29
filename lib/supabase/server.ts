// lib/supabase/server.ts
// ============================================================
// SUPABASE SERVER CLIENT — BEARER OR COOKIE
// ============================================================

import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient(accessToken?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : undefined,
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
