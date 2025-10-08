'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

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
        // send to your existing login route then bounce back
        router.replace(`/login?next=/join?token=${encodeURIComponent(token)}`);
        return;
      }

      // call your Supabase Edge Function
      const res = await fetch(
        `https://<YOUR-PROJECT-REF>.functions.supabase.co/join?token=${encodeURIComponent(token)}`,
        { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Joined successfully.');
        // optional: send them somewhere useful
        // router.replace('/dashboard');
      } else {
        setMessage(data.error || 'Join failed.');
      }
    })();
  }, [router, searchParams, supabase]);

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-4">Invite</h1>
      <p>{message}</p>
    </main>
  );
}
