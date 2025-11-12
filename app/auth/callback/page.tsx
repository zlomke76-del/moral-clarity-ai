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
      // ‼️ Explicit null-safe guards (Vercel TS fix)
      const code = searchParams ? searchParams.get('code') : null;
      const next = searchParams ? searchParams.get('next') || '/app' : '/app';

      if (!code) {
        router.replace(
          '/auth/sign-in?err=Auth+exchange+failed%3A+invalid+request%3A+missing+code'
        );
        return;
      }

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
