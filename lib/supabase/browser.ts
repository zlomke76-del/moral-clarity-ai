import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-only Supabase client
 * - Singleton per browser context
 * - Prevents multiple GoTrue instances
 * - Safe across RSC boundaries
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or ANON_KEY");
}

declare global {
  // eslint-disable-next-line no-var
  var __supabaseBrowser__: SupabaseClient | undefined;
}

export const supabase: SupabaseClient =
  globalThis.__supabaseBrowser__ ??
  (globalThis.__supabaseBrowser__ = createBrowserClient(url, anon));
