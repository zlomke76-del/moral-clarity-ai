// lib/supabase/server.ts
// Fully Next.js 16 compatible — no async cookie conflict.

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClientServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * GET cookie — always call cookies() INSIDE the function
         * so TS never treats it as a Promise.
         */
        get(name: string) {
          const store = cookies();        // ALWAYS sync
          const value = store.get(name)?.value;
          return value;
        },

        /**
         * SET cookie
         */
        set(name, value, options) {
          try {
            const store = cookies();       // ALWAYS sync
            store.set(name, value, options);
          } catch (_) {
            // ignored in SSR
          }
        },

        /**
         * REMOVE cookie
         */
        remove(name: string, options) {
          try {
            const store = cookies();       // ALWAYS sync
            store.delete(name, options);
          } catch (_) {
            // ignored in SSR
          }
        },
      },
    }
  );
}

