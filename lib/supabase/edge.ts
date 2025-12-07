// lib/supabase/edge.ts
// EDGE-safe Supabase client (no browser storage)

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
