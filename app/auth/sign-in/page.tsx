"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      alert("There was an issue sending your magic link.");
    } else {
      alert("Magic link sent! Check your email.");
    }
  }

  return (
    <div className="auth-card w-full max-w-xl">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">
        Sign in
      </h1>

      <p className="text-neutral-400 text-center mb-6 text-sm">
        Enter your email to receive a secure magic link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10
          text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500
          text-white font-medium shadow-lg hover:scale-[1.02] transition-transform"
        >
          Send magic link
        </button>
      </form>
    </div>
  );
}


