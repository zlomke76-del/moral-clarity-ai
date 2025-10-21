"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const pathname = usePathname();

  // Normalize route — works for /auth, /auth/signin, /auth/sign-in
  useEffect(() => {
    const normalized = pathname.toLowerCase();
    if (normalized === "/auth/signin" || normalized === "/auth/sign-in") {
      // stay here — same page handles them
    }
  }, [pathname]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");

    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) throw error;
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <h1 className="text-xl font-semibold mb-2 text-center">
          Sign in to <span className="text-blue-400">Moral Clarity AI</span>
        </h1>
        <p className="text-sm text-zinc-400 mb-6 text-center">
          We’ll email you a secure magic link to continue.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-500 transition"
            disabled={state === "sending"}
          >
            {state === "sending" ? "Sending..." : "Send magic link"}
          </button>
        </form>

        {state === "sent" && (
          <p className="mt-4 text-sm text-green-400 text-center">
            ✅ Check your email for a sign-in link.
          </p>
        )}
        {state === "error" && (
          <p className="mt-4 text-sm text-red-400 text-center">
            ⚠️ Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
