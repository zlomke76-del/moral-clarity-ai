'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

type RetryState = {
  tries: number;
  timer?: ReturnType<typeof setTimeout>;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  // Correct Supabase client factory
  const supabase = createSupabaseBrowser();

  const [ready, setReady] = useState(false);
  const unsubRef = useRef<() => void>();
  const retryRef = useRef<RetryState>({ tries: 0 });

  useEffect(() => {
    let alive = true;

    const backoff = (status?: number) => {
      if (status !== 429) return 0;
      const tries = ++retryRef.current.tries;
      return Math.min(8000, 500 * Math.pow(2, tries - 1)); // 0.5s → 1 → 2 → 4 → 8
    };

    // Initial session load
    (async () => {
      const { error } = await supabase.auth.getSession();
      if (!alive) return;
      if (error) console.warn('getSession error', error);
      setReady(true);
    })();

    // Auth state change subscription
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        try {
          // Optionally: call an authenticated endpoint to detect 429s
        } catch (err: any) {
          const status = err?.status ?? err?.response?.status;
          const delay = backoff(status);
          if (delay > 0) {
            // Retry refresh with exponential backoff
            if (retryRef.current.timer) clearTimeout(retryRef.current.timer);
            retryRef.current.timer = setTimeout(
              () => supabase.auth.refreshSession(),
              delay
            );
            return;
          }
        }

        if (!session) {
          // Signed out → make sure client reflects that
          try {
            await supabase.auth.signOut();
          } catch {
            // ignore
          }
        } else {
          // Reset retry state on success
          retryRef.current.tries = 0;
        }
      }
    );

    unsubRef.current = () => sub.subscription.unsubscribe();

    return () => {
      alive = false;
      unsubRef.current?.();
      if (retryRef.current.timer) clearTimeout(retryRef.current.timer);
    };
  }, [supabase]);

  if (!ready) return null;

  return <>{children}</>;
}
