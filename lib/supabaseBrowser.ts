// lib/supabaseBrowser.ts
'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * HMR-safe singleton (prevents multiple clients during dev Fast Refresh)
 * We attach it to globalThis to keep one instance per tab.
 */
declare global {
  // eslint-disable-next-line no-var
  var __SB_CLIENT__: SupabaseClient | undefined;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    // Fail loudly and early—way easier to debug than silent undefined.
    throw new Error(`Missing ${name}. Check your .env and Vercel project vars.`);
  }
  return v;
}

export function getSupabaseBrowser(): SupabaseClient {
  if (globalThis.__SB_CLIENT__) return globalThis.__SB_CLIENT__ as SupabaseClient;

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anon = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  // Namespaced storage key so multiple deployments don’t collide in localStorage
  const storageKey = `mcai:${process.env.NEXT_PUBLIC_DEPLOY_ENV ?? 'local'}:auth`;

  const client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,      // keep for PKCE/redirect flows
      flowType: 'pkce',              // explicit (works with your redirect-based sign-in)
      multiTab: false,               // 💥 reduce refresh storms while you debug (set true once stable)
      storageKey,                    // avoid clobbering between preview/prod
    },
    // Optional: small fingerprint so you can spot Studio traffic in logs
    global: { headers: { 'x-app': 'moralclarity-studio' } },
  });

  globalThis.__SB_CLIENT__ = client;
  return client;
}
