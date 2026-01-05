// lib/supabase/server.ts
// ------------------------------------------------------------
// SERVER-ONLY Supabase client factory
//
// Canonical rules:
// - Required by @supabase/ssr typings to provide `cookies`
// - MUST be a transparent pass-through (never stubbed)
// - MUST NOT JSON.parse or decode cookies
// - Supabase handles base64 / PKCE internally
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createSupabaseServerClient(accessToken?: string) {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : undefined,

      // REQUIRED by @supabase/ssr types.
      // This MUST be a real pass-through adapter.
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Server routes MAY set cookies (not middleware)
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );
}
