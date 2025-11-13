'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

const CANONICAL_BASE =
  typeof process.env.NEXT_PUBLIC_SITE_URL === 'string'
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
    : undefined;

export default function SignInPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If someone lands on auth at the wrong origin (e.g. moralclarity.ai),
  // bounce them to studio.moralclarity.ai so auth is consistent.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!CANONICAL_BASE) return;

    try {
      const currentOrigin = window.location.origin;
      const canonicalOrigin = new URL(CANONICAL_BASE).origin;

      if (currentOrigin !== canonicalOrigin) {
        const search = window.location.search || '';
        const canonicalUrl = `${canonicalOrigin}/auth/sign-in${search}`;
        window.location.replace(canonicalUrl);
      }
    } catch (e) {
      console.error('[auth/sign-in] canonical redirect error', e);
    }
  }, []);

  // Surface ?err= from callback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const e = params.get('err');
    if (e) setErr(e);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();

      const baseUrl =
        CANONICAL_BASE && typeof window !== 'undefined'
          ? new URL(CANONICAL_BASE).origin
          : typeof window !== 'undefined'
          ? window.location.origin
          : '';

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Magic link will redirect back here; implicit flow will read tokens from URL.
          emailRedirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(
            '/app',
          )}`,
        },
      });

      if (error) throw error;
      setEmailSent(true);
    } catch (e: any) {
      console.error('[auth/sign-in] magic link error', e);
      setErr(
        e?.message ??
          'Failed to send magic link. Please double-check your email and try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-black text-white">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 p-6 bg-black/40">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>

        {emailSent ? (
          <div className="space-y-2 text-sm text-neutral-200">
            <p>Check your email for a magic sign-in link.</p>
            <p className="text-neutral-400">
              For security, open the link on the same device and browser where
              you requested it.
            </p>
          </div>
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
              className="w-full rounded-md bg-amber-500/90 hover:bg-amber-500 p-3 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading || !email}
            >
              {loading ? 'Sending magic link…' : 'Send magic link'}
            </button>
            {err && <p className="text-red-400 text-sm">{err}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
