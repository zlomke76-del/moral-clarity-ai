'use client';

import { useEffect, useState } from 'react';

export default function AuthErrorPage() {
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const e = params.get('err');
    if (e) setErr(e);
  }, []);

  return (
    <main className="min-h-screen grid place-items-center bg-black text-white p-6">
      <div className="w-full max-w-md rounded-xl border border-red-500/40 p-6 bg-red-950/30">
        <h1 className="text-xl font-semibold mb-3">Sign-in error</h1>
        <p className="text-sm mb-4">
          Something went wrong while trying to finish your sign-in.
        </p>
        {err && (
          <p className="text-sm text-red-300 break-all">
            <span className="font-mono text-xs uppercase opacity-70">
              Details:
            </span>{' '}
            {err}
          </p>
        )}
        {!err && (
          <p className="text-sm opacity-70">
            Please try requesting a new magic link from the sign-in page.
          </p>
        )}

        <button
          className="mt-6 rounded-md bg-amber-500/90 hover:bg-amber-500 px-4 py-2 text-sm font-medium"
          onClick={() => {
            window.location.assign('/auth/sign-in');
          }}
        >
          Back to sign in
        </button>
      </div>
    </main>
  );
}
