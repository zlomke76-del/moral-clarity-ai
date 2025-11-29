// lib/supabase.ts
// Back-compat shim over the new Supabase modules.

import { supabaseBrowser } from "./supabase/client";
import { createServerSupabase } from "./supabase/server";
import { createAdminSupabase } from "./supabase/admin";

/**
 * Server-side Supabase client using the anon key + cookie auth.
 * Matches the previous `supabaseServer()` API.
 */
export function supabaseServer() {
  return createServerSupabase();
}

/**
 * Service-role Supabase client.
 * Matches the previous `supabaseService()` API.
 */
export function supabaseService() {
  return createAdminSupabase();
}

/**
 * Re-export browser helper so old code that did
 * `import { supabaseBrowser } from "@/lib/supabase"`
 * still works.
 */
export { supabaseBrowser };
