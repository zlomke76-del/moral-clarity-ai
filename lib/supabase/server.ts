// lib/supabase/server.ts
// Edge-safe Supabase client for server-side memory, news, research, persona, etc.

import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!, // ← MUST use service key for memory writes
  {
    auth: {
      persistSession: false, // Edge runtime: no sessions, no cookies
    },
  }
);


