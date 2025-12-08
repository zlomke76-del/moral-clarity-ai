// lib/supabase/server.ts
// ------------------------------------------------------
// Supabase SSR client - Next.js 16 compatible (cookies sync)
// ------------------------------------------------------

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClientServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * GET COOKIE
         * Next.js 16 cookies() is synchronous — MUST NOT await.
         */
        get(name: string) {
          const store = cookies();              // ✅ sync
          return store.get(name)?.value;
        },

        /**
         * SET COOKIE
         * Next.js does allow writing cookies in server components,
         * but may no-op during SSR render. That’s fine.
         */
        set(name, value, options) {
          try {
            const store = cookies();            // ✅ sync
            store.set(name, value, options);
          } catch (_) {
            // Silent ignore – Next.js blocks SSR mutation sometimes.
          }
        },

        /**
         * REMOVE COOKIE
         */
        remove(name: string, options) {
          try {
            const store = cookies();            // ✅ sync
            store.delete(name, options);
          } catch (_) {
            // Silent ignore
          }
        },
      },
    }
  );
}
