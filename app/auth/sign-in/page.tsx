// app/auth/sign-in/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createSupabaseBrowser();

      const { error: supaError } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          // Supabase will send the user here with ?code=...
          emailRedirectTo: "https://studio.moralclarity.ai/auth/callback",
        },
      });

      if (supaError) {
        console.error("[sign-in] signInWithOtp error:", supaError);
        setError(supaError.message || "Something went wrong sending your magic link.");
        return;
      }

      setMessage(
        "Magic link sent. Check your email and click the link to finish signing in."
      );
    } catch (err) {
      console.error("[sign-in] unexpected error:", err);
      setError("Unexpected error while trying to send the magic link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Sign in to Moral Clarity AI</h1>
        <p className="text-sm text-slate-400 mb-6">
          Enter your email and we&apos;ll send you a one-time magic link to sign in.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-900/40 border border-red-700 px-3 py-2 text-sm text-red-100">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-md bg-emerald-900/30 border border-emerald-700 px-3 py-2 text-sm text-emerald-100">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending magic link…" : "Send magic link"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500">
          Having trouble? Make sure you&apos;re using the same email you used before.
        </p>
      </div>
    </main>
  );
}




