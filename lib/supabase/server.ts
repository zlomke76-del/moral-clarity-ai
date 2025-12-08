// lib/supabase/server.ts
// ----------------------------------------------
// Supabase SSR client for server actions / loaders
// Completely avoids Next.js 16 cookies() type bugs
// ----------------------------------------------

import { headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClientServer() {
  // Read raw cookie header safely
  const cookieHeader = headers().get("cookie") ?? "";

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const match = cookieHeader
            .split(";")
            .map((v) => v.trim())
            .find((x) => x.startsWith(name + "="));

          return match ? match.split("=")[1] : undefined;
        },

        set() {
          // SSR cannot mutate cookies — silently ignored
        },

        remove() {
          // SSR cannot mutate cookies — silently ignored
        },
      },
    }
  );
}

