'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Joining…');

  useEffect(() => {
    (async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Missing invite token.');
        return;
      }

      // ensure user is signed in
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        router.replace(`/login?next=/join?token=${encodeURIComponent(token)}`);
        return;
      }

      // Build the Edge Function URL from your env var (no hardcoding project ref)
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL!; // e.g. https://abc123xyz.supabase.co
      const fnUrl = `${base.replace('.supabase.co', '')}.functions.supabase.co/join?token=${encodeURIComponent(token)}`;

      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Joined successfully.');
        // router.replace('/dashboard'); // optional redirect
      } else {
        setMessage(data.error || 'Join failed.');
      }
    })();
  }, [router, searchParams]);

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-4">Invite</h1>
      <p>{message}</p>
    </main>
  );
}
