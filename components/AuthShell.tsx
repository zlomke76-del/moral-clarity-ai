"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";

function normalizeRedirectPath(value: string | null) {
  const requested = value ?? "/app";

  if (!requested.startsWith("/") || requested.startsWith("//")) {
    return "/app";
  }

  if (requested.startsWith("/auth/")) {
    return "/app";
  }

  return requested;
}

export default function AuthShell() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = normalizeRedirectPath(
    searchParams?.get("redirectedFrom") ?? searchParams?.get("redirect")
  );

  const sendMagicLink = useCallback(async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    try {
      setLoading(true);

      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("redirect", redirectTo);

      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: callbackUrl.toString(),
        },
      });

      if (error) {
        console.error("[AuthShell] signIn error", error);
        alert("Failed to send magic link.");
      } else {
        setEmail(normalizedEmail);
        alert("Check your email for the sign-in link.");
      }
    } finally {
      setLoading(false);
    }
  }, [email, redirectTo]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Sign in</h1>

      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm"
      />

      <button
        onClick={sendMagicLink}
        disabled={loading}
        className="rounded bg-yellow-500 px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send Magic Link"}
      </button>
    </div>
  );
}
