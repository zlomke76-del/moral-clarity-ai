'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/app';

      if (!code) {
        // No code in URL – nothing to exchange
        setStatus('error');
        setMessage('Missing auth code in URL.');
        return;
      }

      try {
        const supabase = createSupabaseBrowser();

        // Browser client knows about the PKCE verifier it set earlier
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;

        // Success – send them into the app
        router.replace(next);
      } catch (err: any) {
        console.error('[auth/callback] exchange failed', err);
        const msg = err?.message ?? 'Auth exchange failed';
        setStatus('error');
        setMessage(msg);

        // Bounce back to sign-in with a clean error in the URL
        router.replace(`/auth/sign-in?err=${encodeURIComponent(msg)}`);
      }
    };

    run();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md w-full rounded-xl border border-neutral-800 p-6 bg-black/40 text-center">
        <h1 className="text-xl font-semibold mb-4">Signing you in…</h1>
        {status === 'loading' ? (
          <p className="text-neutral-300 text-sm">
            Please wait a moment while we complete your sign-in.
          </p>
        ) : (
          <p className="text-red-400 text-sm">
            {message ?? 'Something went wrong during the sign-in process.'}
          </p>
        )}
      </div>
    </main>
  );
}
