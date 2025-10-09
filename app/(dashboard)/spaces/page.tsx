import { createServerClient, type CookieOptions, type CookieMethodsServer } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function SpacesPage() {
  const cookieStore = cookies();

  const cookieAdapter: CookieMethodsServer = {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
    set(name: string, value: string, options?: CookieOptions) {
      cookieStore.set({ name, value, ...options });
    },
    remove(name: string, options?: CookieOptions) {
      // remove == set with maxAge 0
      cookieStore.set({ name, value: '', ...options, maxAge: 0 });
    },
  } as unknown as CookieMethodsServer; // <- makes TS happy across minor @supabase/ssr variants

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );

  // …rest of the page
}
