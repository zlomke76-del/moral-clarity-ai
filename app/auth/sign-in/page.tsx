"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"sending"|"sent"|"error">("idle");
  const next =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next") || "/app"
      : "/app";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    setState(error ? "error" : "sent");
  }

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 p-6">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2"
          />
          <button className="w-full rounded-md bg-blue-600 py-2 font-semibold">
            Send magic link
          </button>
        </form>
        {state === "sending" && <p className="mt-3 text-sm">Sending…</p>}
        {state === "sent" && <p className="mt-3 text-sm">Check your email.</p>}
        {state === "error" && (
          <p className="mt-3 text-sm text-red-400">Couldn’t send link.</p>
        )}
      </div>
    </div>
  );
}
