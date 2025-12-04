// lib/supabase/server.ts
// Next.js 16+ compatible server Supabase client (Supabase v2)

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Server-side Supabase client
 * Handles auth cookies automatically using @supabase/ssr
 */
export async function supabaseServer() {
  const cookieStore = await cookies(); // Next.js 16 returns a Promise

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // READ cookie
        get(name: string) {
          return cookieStore.get(name)?.value;
        },

        // SET cookie – Next.js 16 requires writing via cookieStore.set()
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (err) {
            console.warn("Cookie set failed (SSR context):", err);
          }
        },

        // REMOVE cookie
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (err) {
            console.warn("Cookie remove failed:", err);
          }
        },
      },
    }
  );
}

