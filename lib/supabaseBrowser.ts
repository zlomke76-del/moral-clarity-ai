// lib/supabaseBrowser.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Critical: tells Supabase to use PKCE and store code_verifier
        flowType: 'pkce',
      },
    }
  );
}
