"use client";

import { useEffect } from "react";

export default function CallbackPage() {
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      window.location.href = "/auth/error?err=MissingTokens";
      return;
    }

    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      window.location.href = "/auth/error?err=InvalidTokens";
      return;
    }

    fetch("/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token, refresh_token }),
    })
      .then((res) => res.json())
      .then((out) => {
        if (out.error) {
          window.location.href = `/auth/error?err=${out.error}`;
        } else {
          window.location.href = "/app";
        }
      })
      .catch(() => {
        window.location.href = "/auth/error?err=ExchangeFailed";
      });
  }, []);

  return (
    <div className="text-white p-10 text-center">
      Finishing sign-in…
    </div>
  );
}
