// lib/supabase/node.ts
// NODE-ONLY Supabase client (service key)

import { createClient } from "@supabase/supabase-js";

export const supabaseNode = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: { persistSession: false },
  }
);
