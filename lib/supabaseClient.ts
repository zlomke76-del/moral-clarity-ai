// /lib/supabaseClient.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * App Router–safe Supabase client.
 *
 * - Cookie-backed
 * - Middleware-compatible
 * - Magic-link safe
 * - Single source of truth
 */
export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClientComponentClient();
  }

  return client;
}

export default getSupabaseClient;
