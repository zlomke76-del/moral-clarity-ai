// components/CallbackShell.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

type Status = 'idle' | 'checking' | 'no-session' | 'success' | 'error';

export default function CallbackShell() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createSupabaseBrowser();

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setStatus('checking');
      setMessage('Checking session…');

      const next = params?.get('next') || '/app';

      const { data, error } = await supabase.auth.getSession();

      if (cancelled) return;

      if (error) {
        console.error('[CallbackShell] getSession error', error);
        setStatus('error');
        setMessage(error.message ?? 'Failed to load session');
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth failed: unable to load session'),
        );
        return;
      }

      if (!data.session) {
        setStatus('no-session');
        setMessage('No active session');
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth failed: no active session'),
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
