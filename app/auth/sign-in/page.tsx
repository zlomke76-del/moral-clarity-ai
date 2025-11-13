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

  // 1) If someone hits this page on the wrong origin (e.g. moralclarity.ai),
  //    bounce them to the canonical studio sign-in, preserving query params.
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

  // 2) Surfacing ?err= from callback (if any)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const e = params.get('err');

    if (e) {
      const lower = e.toLowerCase();

      if (lower.includes('exchange failed')) {
        setErr(
          'Sign-in link could not be verified. Please open the link on the same device and browser where you requested it, or request a new link.',
        );
      } else if (lower.includes('code') && lower.includes('verifier')) {
        setErr(
          'We could not complete the secure login exchange. Please request a new sign-in link and open it on the same device.',
        );
      } else {
        setErr(e);
      }
    }
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();

      // 🔑 Always use the canonical origin for the callback.
      // Fallback to window.origin if NEXT_PUBLIC_SITE_URL isn't set (dev).
      const baseUrl =
        CANONICAL_BASE && typeof window !== 'undefined'
          ? new URL(CANONICAL_BASE).origin
          : typeof window !== 'undefined'
          ? window.location.origin
          : '';

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Supabase will send the magic link here (PKCE flow)
          // e.g. https://studio.moralclarity.ai/auth/callback?code=...&next=%2Fapp
          emailRedirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(
            '/app',
          )}`,
        },
      });

      if (error) throw error;
      setEmailSent(true);
    } catch (e: any) {
      console.error('[auth/sign-in] magic link error', e);

      const message: string =
        e?.message ??
        'Failed to send magic link. Please double-check your email and try again.';

      if (
        message.toLowerCase().includes('exchange_failed') ||
        (message.toLowerCase().includes('code') &&
          message.toLowerCase().includes('verifier'))
      ) {
        setErr(
          'Sign-in link could not be verified. Please open the link on the same device and browser where you requested it, or request a new magic link.',
        );
      } else {
        setErr(message);
      }
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
