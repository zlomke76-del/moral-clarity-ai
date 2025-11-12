'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/app';

      // If there's no code, bounce back to sign-in with an error
      if (!code) {
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent(
              'Auth exchange failed: invalid request: missing code'
            )
        );
        return;
      }

      // Do the PKCE exchange in the *browser* (where the verifier lives)
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (cancelled) return;

      if (error) {
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent(`Auth exchange failed: ${error.message}`)
        );
        return;
      }

      // On success, go to the app (or whatever was passed as next)
      router.replace(next);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">Finishing sign-in…</p>
    </div>
  );
}
