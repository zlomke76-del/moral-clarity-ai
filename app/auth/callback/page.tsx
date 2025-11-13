'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const nextEntry = url.searchParams.get('next') || '/app';

        const next =
          typeof nextEntry === 'string' && nextEntry.startsWith('/')
            ? nextEntry
            : '/app';

        if (!code) {
          router.replace(
            '/auth/error?err=' +
              encodeURIComponent('Missing code in URL'),
          );
          return;
        }

        const supabase = createSupabaseBrowser();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          router.replace(
            '/auth/error?err=' + encodeURIComponent(error.message),
          );
          return;
        }

        if (!data?.session) {
          router.replace(
            '/auth/error?err=' +
              encodeURIComponent('No session returned'),
          );
          return;
        }

        router.replace(next);
      } catch (err: any) {
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
