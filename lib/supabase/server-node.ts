// lib/supabase/server-node.ts
// Node-only Supabase client (server pages & actions only)
// NEVER imported into edge routes

import { createClient } from "@supabase/supabase-js";

if (typeof process === "undefined" || process.env.NEXT_RUNTIME === "edge") {
  throw new Error("server-node Supabase client was imported in an Edge environment.");
}

export const supabaseServerNode = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!, // allowed ONLY on Node
  {
    auth: {
      persistSession: false,
    },
  }
);
