'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === 'undefined') return;

    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const nextParam = url.searchParams.get('next') || '/app';

        // Simple open-redirect protection: require a leading slash
        const next =
          typeof nextParam === 'string' && nextParam.startsWith('/')
            ? nextParam
            : '/app';

        if (!code) {
          console.error('[Callback] missing auth code in URL', url.toString());
          router.replace(
            '/auth/error?err=' +
              encodeURIComponent('Auth exchange failed: missing code in URL'),
          );
          return;
        }

        const supabase = createSupabaseBrowser();

        // PKCE exchange: Supabase handles code_verifier internally (stored client-side)
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          url.toString(),
        );

        if (error) {
          console.error('[Callback] exchange error', error);

          const message = (error as any)?.message ?? String(error ?? '');

          // Normalize common PKCE error into more helpful copy
          if (
            message.toLowerCase().includes('code') &&
            message.toLowerCase().includes('verifier')
          ) {
            router.replace(
              '/auth/error?err=' +
                encodeURIComponent(
                  'Auth exchange failed: both code and verifier must be present. ' +
                    'Please open the sign-in link on the same device and browser where you requested it, ' +
                    'or request a new magic link.',
                ),
            );
            return;
          }

          router.replace(
            '/auth/error?err=' +
              encodeURIComponent(message || 'Auth exchange failed'),
          );
          return;
        }

        if (!data?.session) {
          console.error('[Callback] no session returned from exchange');
          router.replace(
            '/auth/error?err=' +
              encodeURIComponent('Auth exchange failed: no session returned'),
          );
          return;
        }

        // Success: go to the requested page
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
