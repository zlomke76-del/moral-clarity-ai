'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      // Handle implicit OAuth flow (#access_token in hash)
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const access_token = hash.get('access_token');
      const refresh_token = hash.get('refresh_token');

      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
        // Clean URL & go to app
        window.history.replaceState({}, '', '/auth/callback');
        router.replace('/app');
        return;
      }

      // Handle PKCE/code flow (?code=)
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        router.replace('/app');
        return;
      }

      router.replace('/auth/sign-in');
    }
    run();
  }, [router]);

  return null;
}
