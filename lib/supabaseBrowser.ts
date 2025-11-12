// lib/supabaseBrowser.ts
'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

declare global {
  // eslint-disable-next-line no-var
  var __SB_CLIENT__: SupabaseClient | undefined;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. Check your .env and Vercel project vars.`);
  return v;
}

export function getSupabaseBrowser(): SupabaseClient {
  if (globalThis.__SB_CLIENT__) return globalThis.__SB_CLIENT__ as SupabaseClient;

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anon = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const storageKey = `mcai:${process.env.NEXT_PUBLIC_DEPLOY_ENV ?? 'local'}:auth`;

  const client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      multiTab: false, // enable later if you want cross-tab auth
      storageKey,
    },
    global: { headers: { 'x-app': 'moralclarity-studio' } },
  });

  globalThis.__SB_CLIENT__ = client;
  return client;
}

// 🔁 Back-compat alias for older imports:
export const createSupabaseBrowser = getSupabaseBrowser;
