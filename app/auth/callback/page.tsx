'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const run = async () => {
      const url = new URL(window.location.href);
      const nextParam = url.searchParams.get('next') || '/app';

      const next =
        typeof nextParam === 'string' && nextParam.startsWith('/')
          ? nextParam
          : '/app';

      const supabase = createSupabaseBrowser();

      try {
        // With implicit flow + detectSessionInUrl, the first Supabase call
        // will parse the URL, store the session, and then getSession()
        // returns the current user/session.
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Callback] getSession error', error);
          router.replace(
            '/auth/error?err=' +
              encodeURIComponent(error.message || 'Auth callback failed'),
          );
          return;
        }

        if (!data.session) {
          console.error('[Callback] no session after implicit callback');
          router.replace(
            '/auth/error?err=' +
              encodeURIComponent(
                'Auth callback failed: no session could be established. Please request a new magic link.',
              ),
          );
          return;
        }

        router.replace(next);
      } catch (err: any) {
        console.error('[Callback] unexpected error', err);
        router.replace(
          '/auth/error?err=' +
            encodeURIComponent('Unexpected error during callback'),
        );
      }
    };

    void run();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p>Finishing sign-in…</p>
    </div>
  );
}
