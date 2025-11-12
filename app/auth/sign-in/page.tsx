'use client';

import { useEffect, useMemo, useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // read ?err= from URL once on mount
  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get('err');
    if (e) setErr(e);
  }, []);

  // map short error codes to human text
  const friendlyErr = useMemo(() => {
    if (!err) return null;
    switch (err) {
      case 'missing_code':
        return 'Magic link is missing a code. Please request a new link.';
      case 'exchange_failed':
        return 'Sign-in failed to exchange the code. Use the newest email link—codes are single-use and expire quickly.';
      case 'callback_exception':
        return 'Unexpected error during sign-in. Please try again.';
      default:
        return err;
    }
  }, [err]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSending(true);
    try {
      const origin = window.location.origin; // e.g. https://studio.moralclarity.ai
      const res = await fetch('/api/clarity', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fn: 'auth_send_magic_link',
          email,
          redirectTo: `${origin}/auth/callback?next=/app`,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j?.ok) {
        throw new Error(j?.error || 'Failed to send sign-in email');
      }
      setEmailSent(true);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to send sign-in email');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 p-6 bg-black/40">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>

        {friendlyErr && (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {friendlyErr}
          </div>
        )}

        {emailSent ? (
          <p className="text-sm">
            Check <span className="font-medium">{email}</span> for your magic link.
            Use the most recent email—links are single-use.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              className="w-full rounded-md bg-neutral-900 p-3 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={sending}
            />
            <button
              className="w-full rounded-md bg-amber-500/90 hover:bg-amber-500 p-3 font-medium disabled:opacity-60"
              type="submit"
              disabled={sending}
            >
              {sending ? 'Sending…' : 'Send magic link'}
            </button>

            {err && !friendlyErr && (
              <p className="text-red-400 text-sm">{err}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
