// components/CallbackShell.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

type Status = 'idle' | 'exchanging' | 'success' | 'error' | 'no-code';

export default function CallbackShell() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createSupabaseBrowser();

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setStatus('exchanging');
      setMessage('Exchanging auth code for session…');

      const code = params?.get('code') ?? null;
      const next = params?.get('next') || '/app';

      if (!code) {
        setStatus('no-code');
        setMessage('Missing auth code in URL');
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth exchange failed: missing code in URL'),
        );
        return;
      }

      // IMPORTANT: pass a plain string, not an object
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (cancelled) return;

      if (error) {
        console.error('[CallbackShell] exchangeCodeForSession error', error);
        setStatus('error');
        setMessage(error.message ?? 'Unable to finish sign-in');
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent(
              'Auth exchange failed: ' + (error.message || 'unknown error'),
            ),
        );
        return;
      }

      if (!data.session) {
        setStatus('error');
        setMessage('No session returned from auth exchange');
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth exchange failed: no session returned'),
        );
        return;
      }

      setStatus('success');
      setMessage('Sign-in successful, redirecting…');
      router.replace(next);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [params, router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center text-sm text-white">
        <p className="mb-2 font-semibold">Finishing sign-in…</p>
        <p className="mb-1">
          Status:{' '}
          <span className="font-mono bg-neutral-800 px-2 py-1 rounded">
            {status}
          </span>
        </p>
        {message && (
          <p className="mt-1 text-xs opacity-70 break-all">{message}</p>
        )}
      </div>
    </div>
  );
}
