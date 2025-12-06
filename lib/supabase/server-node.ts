// lib/supabase/server-node.ts
// Node-only Supabase client (full service role key)

import { createClient } from "@supabase/supabase-js";

// Prevent accidental import inside Edge runtime
if (process.env.NEXT_RUNTIME === "edge") {
  throw new Error(
    "server-node.ts was imported in an Edge environment. Use supabaseEdge instead."
  );
}

export const supabaseServerNode = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!, // full service key, server only
  {
    auth: {
      persistSession: false,
    },
  }
);
