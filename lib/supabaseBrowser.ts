// Minimal browser-side Supabase client (used by /app/auth/* and /app/page.tsx)
import { createClient } from "@supabase/supabase-js";

export function createSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !key) {
    // Keep dev builds from crashing; pages can guard for null
    console.warn("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return null as any;
  }
  return createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

// Default export for existing imports: `import supabase from '@/lib/supabaseBrowser'`
export default createSupabaseBrowser;
