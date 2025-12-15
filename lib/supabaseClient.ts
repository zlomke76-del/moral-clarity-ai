// lib/supabaseClient.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Browser-side Supabase client.
 *
 * IMPORTANT:
 * - No SupabaseClient typing
 * - No schema generics
 * - Inference only
 */

let client: ReturnType<typeof createClientComponentClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createClientComponentClient();
  }
  return client;
}

export default getSupabaseClient;
