"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignInPage() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) setSent(true);
  }

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-4">Sign in</h1>

      <p className="text-neutral-400 text-sm mb-6">
        Enter your email to receive a secure magic link.
      </p>

      {sent ? (
        <div className="text-green-400 text-sm text-center">
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
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Send magic link
          </button>
        </form>
      )}
    </div>
  );
}

