'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

type Status =
  | 'idle'
  | 'no-params'
  | 'no-code'
  | 'exchanging'
  | 'success'
  | 'error';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createSupabaseBrowser();

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      console.log('[auth/callback] effect start');

      // TS / Vercel guard
      if (!params) {
        console.warn('[auth/callback] params is null');
        setStatus('no-params');
        setMessage('Missing search params');
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth exchange failed: missing search params'),
        );
        return;
      }

      const code = params.get('code');
      const next = params.get('next') || '/app';

      console.log('[auth/callback] code:', code, 'next:', next);

      if (!code) {
        console.warn('[auth/callback] no code in URL');
        setStatus('no-code');
        setMessage('No code in callback URL');
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth exchange failed: missing code'),
        );
        return;
      }

      setStatus('exchanging');
      setMessage('Exchanging auth code…');
      console.log('[auth/callback] calling exchangeCodeForSession');

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (cancelled) {
        console.log('[auth/callback] cancelled, aborting');
        return;
      }

      if (error) {
        console.error('[auth/callback] exchange error:', error);
        setStatus('error');
        setMessage(error.message || 'Unknown auth error');

        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent(`Auth exchange failed: ${error.message}`),
        );
        return;
      }

      console.log('[auth/callback] success, redirecting to', next);
      setStatus('success');
      setMessage('Sign-in successful, redirecting…');

      router.replace(next);
    };

    run();

    return () => {
      cancelled = true;
      console.log('[auth/callback] cleanup');
    };
  }, [params, router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center text-sm text-white">
        <p className="mb-2 font-semibold">Auth callback page</p>
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
