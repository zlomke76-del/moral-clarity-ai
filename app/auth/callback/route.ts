"use client";

import { useEffect } from "react";

export default function CallbackPage() {

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      window.location.href = "/auth/error?err=MissingTokens";
      return;
    }

    // Convert #access_token=...&refresh_token=... into an object
    const params = new URLSearchParams(hash.replace("#", ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      window.location.href = "/auth/error?err=InvalidTokens";
      return;
    }

    // Send tokens to our server route to establish session cookies
    fetch("/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token,
        refresh_token,
      }),
    })
      .then((res) => res.json())
      .then((out) => {
        if (out.error) {
          window.location.href = `/auth/error?err=${out.error}`;
        } else {
          window.location.href = "/app"; // SUCCESS
        }
      })
      .catch(() => {
        window.location.href = "/auth/error?err=ServerExchangeFailed";
      });

  }, []);

  return (
    <div className="text-white p-10 text-center">
      Finishing sign-in…
    </div>
  );
}

