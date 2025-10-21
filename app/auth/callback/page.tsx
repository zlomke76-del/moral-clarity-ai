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
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token,
        }).then(() => {
          // ✅ Redirect user into the actual app dashboard
          router.replace('/app');
        });
      } else {
        router.replace('/auth/sign-in');
      }
    } else {
      router.replace('/auth/sign-in');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-zinc-400">
      Redirecting...
    </div>
  );
}
