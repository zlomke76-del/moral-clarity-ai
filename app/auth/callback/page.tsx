'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const next = url.searchParams.get('next') || '/app';

        if (!code) {
          console.error('[Callback] missing auth code in URL');
          router.replace(
            '/auth/sign-in?err=' +
              encodeURIComponent('Auth exchange failed: missing code in URL'),
          );
          return;
        }

        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('[Callback] exchange error', error);
          router.replace(
            '/auth/sign-in?err=' +
              encodeURIComponent(error.message || 'Auth exchange failed'),
          );
          return;
        }

        if (!data.session) {
          console.error('[Callback] no session returned');
          router.replace(
            '/auth/sign-in?err=' +
              encodeURIComponent('Auth exchange failed: no session returned'),
          );
          return;
        }

        router.replace(next);
      } catch (err: any) {
        console.error('[Callback] unexpected error', err);
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent('Unexpected error during callback'),
        );
      }
    };

    run();
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p>Finishing sign-in…</p>
    </div>
  );
}
