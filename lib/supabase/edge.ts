// lib/supabase/edge.ts
// Edge-safe Supabase client for API routes (NO service key)

import { createClient } from "@supabase/supabase-js";

export const supabaseEdge = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
  {
    auth: {
      persistSession: false,
    },
  }
);
