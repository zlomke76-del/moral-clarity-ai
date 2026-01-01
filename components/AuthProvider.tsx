'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/browser';

type RetryState = {
  tries: number;
  timer?: ReturnType<typeof setTimeout>;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const retryRef = useRef<RetryState>({ tries: 0 });

  useEffect(() => {
    let alive = true;

    const backoff = (status?: number) => {
      if (status !== 429) return 0;
      const tries = ++retryRef.current.tries;
      return Math.min(8000, 500 * Math.pow(2, tries - 1)); // 0.5s – 8s
    };

    (async () => {
      const { error } = await supabase.auth.getSession();
      if (!alive) return;
      if (error) {
        console.warn('[AuthProvider] getSession error', error);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        try {
          // Optional: ping an authenticated endpoint if needed
        } catch (err: any) {
          const status = err?.status ?? err?.response?.status;
          const delay = backoff(status);

          if (delay > 0) {
            if (retryRef.current.timer) {
              clearTimeout(retryRef.current.timer);
            }

            retryRef.current.timer = setTimeout(
              () => supabase.auth.refreshSession(),
              delay,
            );
            return;
          }
        }

        // Reset backoff on successful session
        if (session) {
          retryRef.current.tries = 0;
        }
      },
    );

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
      if (retryRef.current.timer) {
        clearTimeout(retryRef.current.timer);
      }
    };
  }, []);

  return <>{children}</>;
}
