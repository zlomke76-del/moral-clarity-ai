"use client";

import { useEffect, useState } from "react";

export default function AuthErrorPage() {
  const [err, setErr] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const e = params.get("err");

    if (e) {
      setErr(e);

      const lower = e.toLowerCase();

      // Smart hint system for common Supabase magic-link / PKCE issues
      if (
        lower.includes("exchange failed") ||
        (lower.includes("code") && lower.includes("verifier"))
      ) {
        setHint(
          "For security, you must open the magic sign-in link on the same device and browser where you requested it."
        );
      } else if (lower.includes("missing code")) {
        setHint(
          "The sign-in link may be incomplete or expired. Request a new magic link and try again."
        );
      } else if (lower.includes("no session returned")) {
        setHint(
          "We could not establish a session from this sign-in attempt. Please request a new magic link."
        );
      }
    }
  }, []);

  const handleBack = () => {
    if (typeof window === "undefined") return;
    window.location.assign("/auth/sign-in");
  };

  return (
    <main className="min-h-screen grid place-items-center text-white px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-red-500/40 bg-black/40 backdrop-blur-xl p-6 shadow-xl shadow-red-900/20">
        <h1 className="text-xl font-semibold mb-2 text-red-200">
          Sign-in Error
        </h1>

        <p className="text-sm opacity-80 mb-4">
          Something went wrong while trying to finish your sign-in.
        </p>

        {hint && (
          <p className="text-sm mb-4 text-red-100 leading-relaxed">{hint}</p>
        )}

        {!hint && !err && (
          <p className="text-sm opacity-70 mb-4">
            Please request a new magic link from the sign-in page.
          </p>
        )}

        {err && (
          <div className="mt-4 text-xs text-red-300 break-words">
            <div className="font-mono uppercase opacity-60 mb-1">
              Technical details
            </div>
            <div>{err}</div>
          </div>
        )}

        <button
          onClick={handleBack}
          className="mt-6 w-full rounded-md bg-amber-500/90 hover:bg-amber-500 px-4 py-2 text-sm font-medium text-black transition"
        >
          Back to Sign In
        </button>
      </div>
    </main>
  );
}
