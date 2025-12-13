"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Supabase sends session data in the URL hash
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : "";

        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (!access_token || !refresh_token) {
          router.replace("/auth/sign-in");
          return;
        }

        // Exchange tokens for httpOnly cookies (server-side)
        const res = await fetch("/auth/exchange", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token,
            refresh_token,
          }),
        });

        if (!res.ok) {
          router.replace("/auth/sign-in");
          return;
        }

        // At this point cookies are set and observable
        router.replace("/app");
      } catch (err) {
        router.replace("/auth/sign-in");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-neutral-500">Signing you in…</p>
    </main>
  );
}
