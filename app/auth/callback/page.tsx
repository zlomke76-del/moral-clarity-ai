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
      // pull params from the URL
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/app';

      // if there's no code, bounce back to sign-in with an error
      if (!code) {
        router.replace(
          '/auth/sign-in?err=Auth+exchange+failed%3A+invalid+request%3A+missing+code'
        );
        return;
      }

      // exchange the auth code for a Supabase session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (cancelled) return;

      if (error) {
        router.replace(
          `/auth/sign-in?err=${encodeURIComponent(
            `Auth exchange failed: ${error.message}`
          )}`
        );
        return;
      }

      // on success, send them where they were headed (default /app)
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
