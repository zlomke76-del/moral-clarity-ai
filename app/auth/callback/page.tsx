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
  const params = useSearchParams(); // TS thinks this might be null in your env
  const supabase = createSupabaseBrowser();

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      console.log('[callback] effect started');

      // Explicit guard to satisfy TypeScript / Vercel
      if (!params) {
        console.warn('[callback] search params object is null');
        setStatus('no-params');
        setMessage('Missing search params');
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth exchange failed: missing search params')
        );
        return;
      }

      const code = params.get('code');
      const next = params.get('next') || '/app';

      console.log('[callback] code:', code, 'next:', next);

      if (!code) {
        console.warn('[callback] no code found in URL');
        setStatus('no-code');
        setMessage('No code found in callback URL');
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth exchange failed: missing code')
        );
        return;
      }

      setStatus('exchanging');
      setMessage('Exchanging auth code…');
      console.log('[callback] calling exchangeCodeForSession');

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (cancelled) {
        console.log('[callback] cancelled, aborting');
        return;
      }

      if (error) {
        console.error('[callback] exchangeCodeForSession error:', error);
        setStatus('error');
        setMessage(error.message || 'Unknown auth error');

        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent(`Auth exchange failed: ${error.message}`)
        );
        return;
      }

      console.log('[callback] exchange success, redirecting to', next);
      setStatus('success');
      setMessage('Sign-in successful, redirecting…');

      router.replace(next);
    };

    run();

    return () => {
      cancelled = true;
      console.log('[callback] cleanup');
    };
  }, [params, router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center text-sm text-gray-200">
        <p className="mb-2">Finishing sign-in…</p>
        <p className="opacity-70">
          Status: <span className="font-mono">{status}</span>
        </p>
        {message && (
          <p className="mt-1 text-xs opacity-60 break-all">{message}</p>
        )}
      </div>
    </div>
  );
}
