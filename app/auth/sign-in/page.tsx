// app/auth/sign-in/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    alert("Magic link sent!");
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-screen px-6">
      <div className="auth-card w-full">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Sign in
        </h1>

        <p className="text-neutral-400 text-center mb-6 text-sm">
          Enter your email to receive a secure magic link.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
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
      </div>
    </div>
  );
}


