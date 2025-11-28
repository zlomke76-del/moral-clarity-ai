// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    async function handle() {
      // This just ensures the client has time to read the session from URL.
      await supabase.auth.getSession();

      const next = params?.get('next') || '/';
      router.replace(next);
    }

    handle();
  }, [router, params]);

  return (
    <main className="min-h-screen grid place-items-center bg-black text-white">
      <div className="text-sm text-neutral-300">
        Finishing sign-in&hellip;
      </div>
    </main>
  );
}


