'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export function CallbackClient() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        // If there’s no session, kick them to sign-in
        if (error || !data?.session) {
          router.replace('/auth/sign-in');
          return;
        }

        // If there IS a session, default to the app home
        router.replace('/app');
      } catch (e) {
        console.error('[CallbackClient] session check failed', e);
        router.replace('/auth/sign-in');
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">Finishing sign-in…</p>
    </div>
  );
}

// Export both named + default to be compatible with any existing imports
export default CallbackClient;
