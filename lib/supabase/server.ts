// /lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Server-side Supabase client for authenticated SSR.
 *
 * MUST NOT be async — it must return the client directly.
 */
export function createClientServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          /* Next.js middleware/proxy will handle */
        },
        remove() {
          /* no-op */
        },
      },
    }
  );
}
