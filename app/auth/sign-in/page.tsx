"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignInPage() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="flex w-full h-full items-center justify-center p-6">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl z-10">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Sign in
        </h1>

        <p className="text-neutral-400 text-center mb-6 text-sm">
          Enter your email to receive a secure magic link.
        </p>

        {sent ? (
          <div className="text-center text-green-400 text-sm">
            ✨ Magic link sent — check your inbox.
          </div>
        ) : (
          <form onSubmit={signIn} className="space-y-4">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg hover:scale-[1.02] transition-transform"
            >
              Send magic link
            </button>
          </form>
        )}

        {error && (
          <div className="text-red-500 text-center mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
