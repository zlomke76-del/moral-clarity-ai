// lib/supabase/edge.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Shared Edge-runtime Supabase client.
 * MUST be a singleton module so Edge optimizer does not choke.
 */
export const supabaseEdge = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: { persistSession: false },
  }
);
