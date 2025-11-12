'use client';

import { useEffect, useRef, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseBrowser();
  const [ready, setReady] = useState(false);
  const unsubRef = useRef<() => void>();
  const retryRef = useRef<{ tries: number; timer?: any }>({ tries: 0 });

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
      if (error) console.warn('getSession error', error);
      setReady(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        // Optionally ping a tiny authorized endpoint to detect 429/400
      } catch (e: any) {
        const status = e?.status ?? e?.response?.status;
        const delay = backoff(status);
        if (delay > 0) {
          clearTimeout(retryRef.current.timer);
          retryRef.current.timer = setTimeout(() => supabase.auth.refreshSession(), delay);
          return;
        }
      }

      if (!session) {
        try { await supabase.auth.signOut(); } catch {}
      } else {
        retryRef.current.tries = 0;
      }
    });

    unsubRef.current = () => sub.subscription.unsubscribe();

    return () => {
      alive = false;
      unsubRef.current?.();
      clearTimeout(retryRef.current.timer);
    };
  }, [supabase]);

  return ready ? <>{children}</> : null;
}
