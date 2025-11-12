// components/AuthShell.tsx
"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthShell() {
  const supabase = createSupabaseBrowser();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // null-safe in strict mode
  const nextParamRaw = searchParams?.get("next") ?? "/app";
  const nextParam = encodeURIComponent(nextParamRaw);

  const base =
    process.env.NEXT_PUBLIC_APP_BASE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");

  const emailRedirectTo =
    base ? `${base}/auth/callback?next=${nextParam}` : undefined;

  const send = useCallback(async () => {
    setErr(null);
    setSent(false);

    if (!email || !email.includes("@")) {
      setErr("Please enter a valid email.");
      return;
    }
    if (!emailRedirectTo) {
      setErr("Missing base URL.");
      return;
    }

    setPending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo },
      });
      if (error) setErr(error.message);
      else setSent(true);
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong.");
    } finally {
      setPending(false);
    }
  }, [email, emailRedirectTo, supabase]);

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-1 text-2xl font-semibold">Sign in</h1>
      <p className="mb-6 text-sm opacity-70">
        We’ll email you a one-time magic link.
      </p>

      <label htmlFor="email" className="mb-1 block text-sm opacity-80">
        Email
      </label>
      <input
        id="email"
        className="mb-3 w-full rounded border border-zinc-700 bg-zinc-900 p-2"
        placeholder="you@example.com"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        autoComplete="email"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            void send();
          }
        }}
      />

      <button
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
        onClick={send}
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? "Sending…" : "Send magic link"}
      </button>

      {sent && (
        <p className="mt-3 text-sm text-zinc-300">
          Check <strong>{email}</strong> for your sign-in link.
        </p>
      )}
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

      <p className="mt-6 text-xs opacity-60">
        After sign-in you’ll be sent to:{" "}
        <code className="opacity-80">{nextParamRaw}</code>
      </p>
    </main>
  );
}
