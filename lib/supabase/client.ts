// lib/supabase/client.ts
// Canonical browser-side Supabase client (Next.js 16+)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Custom cookie storage to enforce domain=".moralclarity.ai"
class DomainCookieStorage {
  getItem(key: string) {
    return globalThis?.document?.cookie
      ?.split("; ")
      ?.find((row) => row.startsWith(key + "="))
      ?.split("=")[1] ?? null;
  }

  setItem(key: string, value: string) {
    document.cookie = `${key}=${value}; Path=/; Domain=.moralclarity.ai; SameSite=None; Secure`;
  }

  removeItem(key: string) {
    document.cookie = `${key}=; Path=/; Domain=.moralclarity.ai; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure`;
  }
}

export function supabaseBrowser(): SupabaseClient {
  return createClient(URL, ANON, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: new DomainCookieStorage(), // <-- THIS IS THE KEY FIX
    },
  });
}

export function createSupabaseBrowser(): SupabaseClient {
  return supabaseBrowser();
}

export type { SupabaseClient };
