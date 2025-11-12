// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get('code');
  const next = params.get('next') || '/app';

  useEffect(() => {
    (async () => {
      try {
        if (!code) {
          router.replace(next);
          return;
        }
        const supabase = getSupabaseBrowser();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        // Ignore “already used” errors; just push to app
        router.replace(next);
      } catch {
        router.replace(next);
      }
    })();
  }, [code, next, router]);

  return null;
}
