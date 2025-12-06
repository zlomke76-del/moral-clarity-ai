// lib/supabase/node.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseNode = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
);
