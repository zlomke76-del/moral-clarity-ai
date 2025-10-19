// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sb = createSupabaseBrowser();

  useEffect(() => {
    (async () => {
      try {
        // A. If it’s a PKCE/code link (preferred), exchange it:
        const code = params.get("code");
        if (code) {
          const { error } = await sb.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // B. If a hash link got here, absorb it:
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash?.includes("access_token")) {
          const q = new URLSearchParams(hash.replace(/^#/, ""));
          const access_token = q.get("access_token");
          const refresh_token = q.get("refresh_token");
          if (access_token && refresh_token) {
            await sb.auth.setSession({ access_token, refresh_token });
            // clear the hash
            window.history.replaceState({}, "", window.location.pathname);
          }
        }
      } catch (err) {
        console.error("Auth callback failed:", err);
      } finally {
        // All paths end on home; your home will decide what to render.
        router.replace("/");
      }
    })();
  }, [params, router, sb]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="opacity-70">Signing you in…</div>
    </main>
  );
}
