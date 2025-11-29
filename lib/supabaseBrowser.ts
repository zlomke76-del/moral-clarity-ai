// lib/supabaseBrowser.ts
// Back-compat shim so existing imports keep working.
// New code should import from "./supabase/client" directly.

"use client";

import { supabaseBrowser } from "./supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Legacy helper used in a few client utilities:
 *   import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
 */
export function getSupabaseBrowser(): SupabaseClient {
  return supabaseBrowser();
}

// Keep default + named export for newer code:
export default supabaseBrowser;
export { supabaseBrowser };
export type { SupabaseClient };
