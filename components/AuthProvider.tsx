// components/AuthProvider.tsx
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
      // Back off only on rate limits
      if (status !== 429) return 0;
      const tries = ++retryRef.current.tries;
      // 0.5s, 1s, 2s, 4s, max 8s
      const delay = Math.min(8000, 500 * Math.pow(2, tries - 1));
      return delay;
    };

    (async () => {
      // Single bootstrap
      const { data, error } = await supabase.auth.getSession();
      if (!alive) return;
      if (error) console.warn('getSession error', error);
      setReady(true);
    })();

    // Single listener
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // If refresh quietly fails with 400/429, supabase-js won’t always expose status.
      // Proactively test a light endpoint that requires auth and back off on 429 if you surface it in your API.
      try {
        // No-op; you can ping a tiny “/api/ping” that returns 200 when authorized.
      } catch (e: any) {
        const status = e?.status ?? e?.response?.status;
        const delay = backoff(status);
        if (delay > 0) {
          clearTimeout(retryRef.current.timer);
          retryRef.current.timer = setTimeout(() => supabase.auth.refreshSession(), delay);
          return;
        }
      }

      // If refresh token is invalid (400), force sign-out to break the loop
      if (!session) {
        try { await supabase.auth.signOut(); } catch {}
      } else {
        // On success, reset backoff
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
