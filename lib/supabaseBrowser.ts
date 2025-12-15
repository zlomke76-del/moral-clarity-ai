// lib/supabaseBrowser.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Single browser Supabase client for the App Router.
 *
 * IMPORTANT:
 * - Uses @supabase/auth-helpers-nextjs
 * - Cookie-backed
 * - Middleware-compatible
 * - DO NOT add flowType / implicit / PKCE overrides here
 */
export function createSupabaseBrowser(): SupabaseClient {
  if (!client) {
    client = createClientComponentClient();
  }

  return client;
}

/**
 * Backwards-compat alias.
 * Existing imports continue to work.
 */
export function getSupabaseBrowser(): SupabaseClient {
  return createSupabaseBrowser();
}
