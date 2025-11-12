'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams(); // Vercel still marks this as possibly null
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // ❗ Absolute TS-safe guard required by Vercel
      if (!params) {
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth exchange failed: missing search params')
        );
        return;
      }

      const code = params.get('code');
      const next = params.get('next') || '/app';

      if (!code) {
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Auth exchange failed: missing code')
        );
        return;
      }

      // PKCE exchange happens *in the browser* (where verifier exists)
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (cancelled) return;

      if (error) {
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent(`Auth exchange failed: ${error.message}`)
        );
        return;
      }

      router.replace(next);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [params, router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">Finishing sign-in…</p>
    </div>
  );
}
