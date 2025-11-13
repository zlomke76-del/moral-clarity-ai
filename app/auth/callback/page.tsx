'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();

  // Non-null assertion: on the client, this is always defined.
  const params = useSearchParams()!;
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const run = async () => {
      const code = params.get('code');
      const next = params.get('next') || '/app';

      if (!code) {
        router.replace('/auth/sign-in?err=Missing code');
        return;
      }

      // ⭐ Critical PKCE step: exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession({ code });

      if (error) {
        console.error('[Callback] exchange error', error);
        router.replace(
          '/auth/sign-in?err=' +
            encodeURIComponent(error.message ?? 'Auth exchange failed'),
        );
        return;
      }

      router.replace(next);
    };

    void run();
  }, [params, router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center text-sm">
        <p className="mb-2 font-semibold">Finishing sign-in…</p>
        <p className="opacity-70">Exchanging auth code for a session…</p>
      </div>
    </div>
  );
}
