'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function HomeShell() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = typeof window === 'undefined' ? null : createSupabaseBrowser();
    if (!supabase) return;

    let alive = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!alive) return;

        // ERROR fallback
        if (error) {
          if (!pathname?.startsWith('/auth')) router.replace('/auth?next=%2Fstudio');
          return;
        }

        const session: Session | null = data.session ?? null;

        if (session) {
          // AUTHENTICATED → always send to /studio
          if (pathname !== '/studio') router.replace('/studio');
        } else {
          // NOT AUTHENTICATED → redirect to auth with next=/studio
          if (!pathname?.startsWith('/auth')) router.replace('/auth?next=%2Fstudio');
        }
      } catch {
        if (!pathname?.startsWith('/auth')) router.replace('/auth?next=%2Fstudio');
      }
    })();

    return () => {
      alive = false;
    };
  }, [router, pathname]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="opacity-70">Loading…</div>
    </main>
  );
}

