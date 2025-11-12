// lib/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerClient as _createServerClient } from '@supabase/ssr';
// If you have a Database type, import it and add <Database> below.
// import type { Database } from '@/types/supabase'; // optional

export function createServerSupabase() {
  const cookieStore = cookies();

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // no-op on edge where set may be restricted during build
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              expires: new Date(0),
            });
          } catch {
            // no-op
          }
        },
      },
    }
  );
}

// Also export an alias that some files might already use.
export const createServerClient = createServerSupabase;
