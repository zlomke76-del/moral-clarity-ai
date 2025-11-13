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
      const code = url.searchParams.get('code');
      const nextParam = url.searchParams.get('next') || '/app';

      // Guard against weird external URLs
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

      let sessionErrorMessage: string | null = null;

      try {
        // Try to exchange the code for a session.
        // In some setups Supabase may already have done this internally,
        // in which case this can throw with the code/verifier error.
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('[Callback] exchange error (returned)', error);
          sessionErrorMessage =
            (error as any)?.message ?? 'Auth exchange failed';
        }

        if (data?.session) {
          // Happy path: we got a session directly.
          router.replace(next);
          return;
        }
      } catch (err: any) {
        console.error('[Callback] exchange error (thrown)', err);
        sessionErrorMessage =
          err?.message ??
          'Auth exchange failed: both code and verifier must be present';
      }

      // 🔍 At this point, the exchange either errored or returned no session.
      // Check if Supabase actually has a session anyway (e.g., first exchange
      // succeeded internally, then the second one fails with the PKCE error).
      try {
        const { data: sessionData, error: sessionCheckError } =
          await supabase.auth.getSession();

        if (sessionCheckError) {
          console.error('[Callback] getSession error', sessionCheckError);
        }

        if (sessionData?.session) {
          console.log(
            '[Callback] session present after exchange error, continuing',
          );
          router.replace(next);
          return;
        }
      } catch (err: any) {
        console.error('[Callback] unexpected getSession error', err);
      }

      // ❌ No session at all – now we treat it as a real failure.
      const message = (sessionErrorMessage || '').toLowerCase();

      if (
        message.includes('code') &&
        message.includes('verifier')
      ) {
        router.replace(
          '/auth/error?err=' +
            encodeURIComponent(
              'Auth exchange failed: both code and verifier must be present. Please open the sign-in link on the same device and browser where you requested it, or request a new magic link.',
            ),
        );
        return;
      }

      router.replace(
        '/auth/error?err=' +
          encodeURIComponent(
            sessionErrorMessage || 'Auth exchange failed: no session returned',
          ),
      );
    };

    void run();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p>Finishing sign-in…</p>
    </div>
  );
}
