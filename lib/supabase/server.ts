// lib/supabase/server.ts
// ------------------------------------------------------------
// SERVER-ONLY Supabase client factory (Next.js 16+)
//
// Canonical rules:
// - cookies() is ASYNC in Next 16
// - cookies adapter is REQUIRED by @supabase/ssr typings
// - Adapter MUST be transparent (no parsing, no decoding)
// - Supabase handles base64 / PKCE internally
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient(accessToken?: string) {
  const cookieStore = await cookies();

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

      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },

        set(name: string, value: string, options: any) {
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
