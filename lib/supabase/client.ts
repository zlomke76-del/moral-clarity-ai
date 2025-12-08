// /lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client — persistent session enabled.
 * Automatically reads/writes auth cookies via the browser.
 */
export function createClientBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
}
