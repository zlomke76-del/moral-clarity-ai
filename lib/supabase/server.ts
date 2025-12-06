// lib/supabase/server.ts
// Edge-safe server Supabase client (Next.js 16+)

import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,   // service key for RLS-disabled server ops
  {
    auth: {
      persistSession: false,
    },
  }
);
