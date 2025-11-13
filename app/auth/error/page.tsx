'use client';

import { useEffect, useState } from 'react';

export default function AuthErrorPage() {
  const [err, setErr] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const e = params.get('err');

    if (e) {
      setErr(e);

      const lower = e.toLowerCase();

      // Common PKCE / magic link failure hints
      if (
        lower.includes('exchange failed') ||
        (lower.includes('code') && lower.includes('verifier'))
      ) {
        setHint(
          'For security, you need to open the magic sign-in link on the same device and browser where you requested it. If you forwarded the email or switched devices, request a new link and open it directly.'
        );
      } else if (lower.includes('missing code')) {
        setHint(
          'The sign-in link may be incomplete or expired. Try requesting a new magic link from the sign-in page.'
        );
      } else if (lower.includes('no session returned')) {
        setHint(
          'We could not establish a session from this sign-in attempt. Please request a new magic link and try again.'
        );
      }
    }
  }, []);

  const handleBack = () => {
    if (typeof window === 'undefined') return;
    window.location.assign('/auth/sign-in');
  };

  return (
    <main className="min-h-screen grid place-items-center bg-black text-white p-6">
      <div className="w-full max-w-md rounded-xl border border-red-500/40 p-6 bg-red-950/30">
        <h1 className="text-xl font-semibold mb-3">Sign-in error</h1>

        <p className="text-sm mb-3">
          Something went wrong while trying to finish your sign-in.
        </p>

        {hint && (
          <p className="text-sm mb-4 text-red-100">
            {hint}
          </p>
        )}

        {!hint && !err && (
          <p className="text-sm opacity-70 mb-4">
            Please try requesting a new magic link from the sign-in page.
          </p>
        )}

        {err && (
          <div className="mt-2 text-xs text-red-300 break-all">
            <div className="font-mono uppercase opacity-70 mb-1">
              Technical details
            </div>
            <div>{err}</div>
          </div>
        )}

        <button
          className="mt-6 rounded-md bg-amber-500/90 hover:bg-amber-500 px-4 py-2 text-sm font-medium"
          onClick={handleBack}
        >
          Back to sign in
        </button>
      </div>
    </main>
  );
}
