// app/auth/page.tsx
"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const next = encodeURIComponent(searchParams?.next || "/app");
  const emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback?next=${next}`;

  async function send() {
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
      <input
        className="mb-3 w-full rounded border border-zinc-700 bg-zinc-900 p-2"
        placeholder="you@example.com"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
      />
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white"
        onClick={send}
      >
        Send magic link
      </button>
      {sent && (
        <p className="mt-3 text-sm text-zinc-400">
          Check your email for the sign-in link.
        </p>
      )}
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
    </main>
  );
}
