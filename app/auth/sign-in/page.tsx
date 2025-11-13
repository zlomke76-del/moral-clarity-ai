// app/auth/sign-in/page.tsx
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

/**
 * /auth/sign-in
 * Magic link sign-in screen for studio.moralclarity.ai
 */
export default function AuthSignInPage() {
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
          // Magic link goes to /auth?next=/app
          emailRedirectTo: `${window.location.origin}/auth?next=%2Fapp`,
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
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 p-6 bg-black/60">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        {emailSent ? (
          <p className="text-sm text-neutral-200">
            Check your email for a magic link to open the app.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              className="w-full rounded-md bg-neutral-900 p-3 outline-none text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="w-full rounded-md bg-amber-500/90 hover:bg-amber-500 p-3 font-medium text-sm"
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
