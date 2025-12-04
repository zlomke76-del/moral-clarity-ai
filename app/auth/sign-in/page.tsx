"use client";

import React, { useState } from "react";
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Dark overlay to ensure visibility */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* SIGN-IN CARD */}
      <div className="relative z-10 w-full max-w-md px-8 py-10 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <img
            src="/Magic key.png"
            alt="Magic Key"
            className="h-16 w-16 drop-shadow-[0_0_15px_rgba(0,180,255,0.4)] animate-[pulse_3s_ease-in-out_infinite]"
          />
        </div>

        <h1 className="text-3xl font-semibold text-center mb-2 text-white">
          Sign in
        </h1>

        <p className="text-center text-neutral-400 mb-8 text-sm">
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
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-blue-900/40 hover:scale-[1.02] transition-transform"
            >
              Send magic link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}



