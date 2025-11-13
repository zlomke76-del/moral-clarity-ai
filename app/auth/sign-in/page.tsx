'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function SignIn() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get('err');
    if (e) setErr(e);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      const supabase = createSupabaseBrowser();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Supabase will send the magic link directly to /app
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) throw error;
      setEmailSent(true);
    } catch (e: any) {
      console.error('[auth/sign-in] magic link error', e);
      setErr(e?.message ?? 'Failed to send magic link');
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 p-6 bg-black/40">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        {emailSent ? (
          <p>Check your email for a magic link.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              className="w-full rounded-md bg-neutral-900 p-3 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="w-full rounded-md bg-amber-500/90 hover:bg-amber-500 p-3 font-medium"
              type="submit"
            >
              Send magic link
            </button>
            {err && <p className="text-red-400 text-sm">{err}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
