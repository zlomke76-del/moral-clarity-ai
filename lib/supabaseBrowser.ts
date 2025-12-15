// lib/supabaseBrowser.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Browser-side Supabase client (App Router safe).
 *
 * IMPORTANT:
 * - No SupabaseClient typing
 * - No schema generics
 * - Let inference win
 * - Single instance to avoid auth desync
 */

let browserClient: ReturnType<typeof createClientComponentClient> | null = null;

export function createSupabaseBrowser() {
  if (!browserClient) {
    browserClient = createClientComponentClient();
  }
  return browserClient;
}

/**
 * Backwards-compat alias.
 */
export function getSupabaseBrowser() {
  return createSupabaseBrowser();
}
