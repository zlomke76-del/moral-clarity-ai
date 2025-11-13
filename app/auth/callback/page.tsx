'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const run = async () => {
      const code = params.get('code');
      const next = params.get('next') || '/app';

      if (!code) {
        router.replace('/auth/sign-in?err=Missing code');
        return;
      }

      // ⭐ This is the missing piece
      const { error } = await supabase.auth.exchangeCodeForSession({ code });

      if (error) {
        console.error('[Callback] exchange error', error);
        router.replace('/auth/sign-in?err=' + encodeURIComponent(error.message));
        return;
      }

      router.replace(next);
    };

    run();
  }, [params, router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <p>Finishing sign-in…</p>
    </div>
  );
}
