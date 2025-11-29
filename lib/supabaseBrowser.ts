// lib/supabaseBrowser.ts
// Back-compat shim so existing imports keep working.
// Newer code should import from "./supabase/client" directly.

"use client";

import { supabaseBrowser as coreSupabaseBrowser } from "./supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Primary browser client wrapper.
 * This matches the behavior of supabaseBrowser() from lib/supabase/client.
 */
export function supabaseBrowser(): SupabaseClient {
  return coreSupabaseBrowser();
}

/**
 * Legacy helper used in a few client utilities:
 *   import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
 */
export function getSupabaseBrowser(): SupabaseClient {
  return coreSupabaseBrowser();
}

/**
 * Legacy helper used in auth callback and some older code:
 *   import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
 */
export function createSupabaseBrowser(): SupabaseClient {
  return coreSupabaseBrowser();
}

// Default export for newer code that does:
//   import supabaseBrowser from "@/lib/supabaseBrowser";
export default supabaseBrowser;

// Only export the *other* helpers as named exports.
// supabaseBrowser is already a named export via the function declaration above.
export { getSupabaseBrowser, createSupabaseBrowser };

export type { SupabaseClient };
