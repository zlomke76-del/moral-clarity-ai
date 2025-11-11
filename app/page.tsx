'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function HomeShell() {
  const router = useRouter();
  const pathname = usePathname();

  // instantiate only on client
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createSupabaseBrowser();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!alive) return;

        if (error) {
          // if we’re already on /auth, don’t loop
          if (!pathname?.startsWith('/auth')) {
            router.replace('/auth?next=%2Fapp');
          }
          return;
        }

        const session: Session | null = data.session ?? null;
        if (session) {
          if (pathname !== '/app') router.replace('/app');
        } else {
          if (!pathname?.startsWith('/auth')) {
            router.replace('/auth?next=%2Fapp');
          }
        }
      } catch {
        if (!pathname?.startsWith('/auth')) {
          router.replace('/auth?next=%2Fapp');
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [supabase, router, pathname]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="opacity-70">Loading…</div>
    </main>
  );
}
