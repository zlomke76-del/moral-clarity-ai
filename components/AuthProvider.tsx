'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";   // <-- FIXED IMPORT

type RetryState = {
  tries: number;
  timer?: ReturnType<typeof setTimeout>;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseBrowser();   // <-- FIXED CALL
  const retryRef = useRef<RetryState>({ tries: 0 });

  useEffect(() => {
    let alive = true;

    const backoff = (status?: number) => {
      if (status !== 429) return 0;
      const tries = ++retryRef.current.tries;
      return Math.min(8000, 500 * Math.pow(2, tries - 1)); // 0.5s → 8s
    };

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

        // Just reset backoff on non-null session; don't force signOut on null
        if (session) {
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

  return <>{children}</>;
}
