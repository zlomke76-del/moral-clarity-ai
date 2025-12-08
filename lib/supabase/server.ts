// /lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Server-side Supabase client for authenticated SSR.
 * MUST be async, because cookies() is async in Next.js 16.
 */
export async function createClientServer() {
  const cookieStore = await cookies(); // <-- REQUIRED in Next.js 16

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          /* Next.js proxy handles cookie write */
        },
        remove() {
          /* no-op */
        },
      },
    }
  );
}
