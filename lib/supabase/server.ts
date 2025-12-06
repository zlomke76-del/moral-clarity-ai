// lib/supabase/server.ts
// Edge-safe server Supabase client (Next.js 16+)

import { createClient } from "@supabase/supabase-js";

/**
 * Factory function — creates a NEW Supabase server client per request.
 * This keeps signatures consistent with all `await supabaseServer()` usages.
 */
export async function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,  // server key, bypasses RLS
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
