// app/auth/callback/page.tsx (client)
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      router.replace("/auth/sign-in");
      return;
    }

    // POST to /auth/exchange
    fetch("/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token, refresh_token }),
    }).then(() => {
      router.replace("/app");   // ⭐ ALWAYS redirect to /app
    });
  }, []);

  return <p>Signing you in…</p>;
}

