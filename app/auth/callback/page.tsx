"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Handles both flows:
 * - Hash tokens (#access_token, #refresh_token) from magic links
 * - PKCE/code flow (?code=...)
 */
export default function AuthCallback() {
  const router = useRouter();
  const search = useSearchParams();
  const [msg, setMsg] = useState("Completing sign-in…");

  useEffect(() => {
    (async () => {
      try {
        // If we have a code param, use PKCE exchange:
        const code = search.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          // Otherwise parse hash tokens (magic link style)
          const hash = window.location.hash; // e.g. #access_token=...&refresh_token=...
          const params = new URLSearchParams(hash.replace(/^#/, ""));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");
          if (!access_token || !refresh_token) {
            throw new Error("Missing tokens in callback URL.");
          }
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) throw error;
        }

        // Optional: honor ?next=/app
        const next = search.get("next") || "/app";
        setMsg("Signed in. Redirecting…");
        router.replace(next);
      } catch (e: any) {
        console.error("Auth callback error:", e);
        setMsg(`Sign-in failed: ${e?.message ?? "Unknown error"}`);
      }
    })();
  }, [router, search]);

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="rounded-2xl border border-zinc-800 p-6">
        <p className="text-sm text-zinc-300">{msg}</p>
      </div>
    </div>
  );
}
