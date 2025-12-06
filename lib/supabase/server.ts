// lib/supabase/server.ts
// Edge-safe server Supabase client (Next.js 16+)

import { createClient } from "@supabase/supabase-js";

/**
 * This exports a *SupabaseClient instance* — NOT a function.
 * This fixes the "Property 'from' does not exist on type '() => SupabaseClient'" error.
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,  // service role key - server only
  {
    auth: {
      persistSession: false,
    },
  }
);
