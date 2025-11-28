// lib/supabaseBrowser.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

let client = null;

export function createSupabaseBrowser() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: 'implicit',
          detectSessionInUrl: true,
          autoRefreshToken: true,
          persistSession: true,
        },
      }
    );
  }

  return client;
}

