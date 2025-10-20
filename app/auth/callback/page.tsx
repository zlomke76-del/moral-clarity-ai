// app/auth/callback/page.tsx
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
      // Grab tokens from the URL hash
      const hash = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hash.get('access_token');
      const refresh_token = hash.get('refresh_token');

      if (access_token && refresh_token) {
        // Persist session (sets cookies via supabase-js)
        await supabase.auth.setSession({ access_token, refresh_token });
        // Optional: clean up the hash for a pretty URL
        const clean = window.location.pathname;
        window.history.replaceState({}, '', clean);
        router.replace('/app');
        return;
      }

      // Newer PKCE flow? Handle `?code=`:
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        router.replace('/app');
        return;
      }

      // Fallback
      router.replace('/auth/sign-in');
    }
    run();
  }, [router]);

  return null;
}
