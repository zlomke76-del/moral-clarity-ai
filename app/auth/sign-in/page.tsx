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
    <div
      className="
        relative 
        z-[99999] 
        min-h-screen 
        w-full 
        flex 
        items-center 
        justify-center 
        bg-[#050505]
        text-white
      "
    >
      {/* Subtle radial glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[480px] h-[480px] bg-cyan-500/20 blur-[160px] rounded-full animate-pulse"></div>
      </div>

      {/* SIGN-IN CARD */}
      <div
        className="
          relative 
          w-full 
          max-w-md 
          px-8 
          py-10 
          rounded-2xl 
          border border-white/10 
          bg-white/5 
          backdrop-blur-2xl 
          shadow-[0_0_40px_rgba(0,0,0,0.55)]
        "
      >
        {/* Key Icon */}
        <div className="flex justify-center mb-6">
          <img
            src="/Magic key.png"
            alt="Magic Key"
            className="
              h-16 w-16 
              drop-shadow-[0_0_20px_rgba(0,200,255,0.45)]
              animate-[pulse_3s_ease-in-out_infinite]
            "
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-center mb-1">Sign in</h1>

        {/* Subtitle */}
        <p className="text-center text-neutral-400 mb-8 text-sm">
          Enter your email to receive a secure magic link.
        </p>

        {/* MESSAGE AFTER SENDING */}
        {sent ? (
          <div className="text-center text-green-400 text-sm font-medium">
            ✨ Magic link sent — check your inbox.
          </div>
        ) : (
          <form onSubmit={signIn} className="space-y-4">
            {/* Email Input */}
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full 
                px-4 
                py-3 
                rounded-xl 
                bg-black/40 
                border border-white/10 
                text-white 
                placeholder-neutral-500 
                focus:border-cyan-500 
                focus:outline-none 
                transition
              "
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="
                w-full 
                py-3 
                rounded-xl 
                bg-gradient-to-r 
                from-cyan-600 
                to-blue-600 
                text-white 
                font-medium 
                shadow-lg 
                shadow-cyan-900/40 
                hover:scale-[1.02] 
                transition-transform
              "
            >
              Send magic link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}




