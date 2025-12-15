// lib/supabaseBrowser.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client.
 *
 * Rules:
 * - Cookie-backed (required for App Router)
 * - Single instance (prevents auth desync)
 * - No schema generics (prevents TS incompatibilities)
 */
let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowser(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClientComponentClient();
  }

  return browserClient;
}

/**
 * Backwards-compat alias.
 * Keep this so existing imports do not break.
 */
export function getSupabaseBrowser(): SupabaseClient {
  return createSupabaseBrowser();
}
