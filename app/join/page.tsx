'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Prevent prerendering — render client-side only
export const dynamic = 'force-dynamic';
// (Remove the revalidate export that was causing the error)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function JoinInner() {
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

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        router.replace(`/login?next=/join?token=${encodeURIComponent(token)}`);
        return;
      }

      const base = process.env.NEXT_PUBLIC_SUPABASE_URL!; // e.g. https://abc123xyz.supabase.co
      const fnUrl = `${base.replace('.supabase.co', '')}.functions.supabase.co/join?token=${encodeURIComponent(token)}`;

      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();

      setMessage(res.ok ? (data.message || 'Joined successfully.') : (data.error || 'Join failed.'));
      // Optionally redirect after success:
      // if (res.ok) router.replace('/dashboard');
    })();
  }, [router, searchParams]);

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-4">Invite</h1>
      <p>{message}</p>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Invite</h1>
        <p>Preparing…</p>
      </main>
    }>
      <JoinInner />
    </Suspense>
  );
}
