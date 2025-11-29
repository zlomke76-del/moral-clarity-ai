// app/auth/sign-in/page.tsx
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useSupabase } from "@/lib/supabase/provider";

export default function SignInPage() {
  // Reuse the singleton Supabase client from the global provider
  const { supabase } = useSupabase();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // After login, go to /app (not /memory)
          emailRedirectTo: `${origin}/auth/callback?next=/app`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-slate-100">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-950/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <h1 className="text-xl font-semibold mb-2">Magic Key</h1>
        <p className="text-sm text-slate-300 mb-4">
          Enter your email and we&apos;ll send you a secure sign-in link.
        </p>

        {sent ? (
          <p className="text-sm text-emerald-300">
            Check your email for a sign-in link. You can close this window.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-900/30 border border-red-700/60 rounded px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-60"
            >
              {loading ? "Sending link..." : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

