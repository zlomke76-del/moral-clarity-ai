// components/AuthProvider.tsx
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

type RetryState = {
  tries: number;
  timer?: ReturnType<typeof setTimeout>;
};

/**
 * Lightweight auth wiring:
 * - Does NOT gate rendering on "ready"
 * - Sets up onAuthStateChange with basic backoff for 429s
 * - Keeps the UI always visible (no more black screen while waiting)
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createSupabaseBrowser();
  const retryRef = useRef<RetryState>({ tries: 0 });

  useEffect(() => {
    let alive = true;

    const backoff = (status?: number) => {
      if (status !== 429) return 0;
      const tries = ++retryRef.current.tries;
      return Math.min(8000, 500 * Math.pow(2, tries - 1)); // 0.5s → 8s
    };

    // Prime session once on mount (but don't block rendering on it)
    (async () => {
      const { error } = await supabase.auth.getSession();
      if (!alive) return;
      if (error) console.warn('[AuthProvider] getSession error', error);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        try {
          // optional: ping a tiny authorized endpoint here if you want
        } catch (err: any) {
          const status = err?.status ?? err?.response?.status;
          const delay = backoff(status);
          if (delay > 0) {
            if (retryRef.current.timer) clearTimeout(retryRef.current.timer);
            retryRef.current.timer = setTimeout(
              () => supabase.auth.refreshSession(),
              delay,
            );
            return;
          }
        }

        if (!session) {
          try {
            await supabase.auth.signOut();
          } catch {
            // ignore
          }
        } else {
          retryRef.current.tries = 0;
        }
      },
    );

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
      if (retryRef.current.timer) clearTimeout(retryRef.current.timer);
    };
  }, [supabase]);

  // 🔑 Key change: ALWAYS render children; don't hide them behind `ready`
  return <>{children}</>;
}
