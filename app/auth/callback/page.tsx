// app/auth/callback/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

// Prevent static export / prerender issues
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const sb = createSupabaseBrowser();

  useEffect(() => {
    (async () => {
      try {
        // A) PKCE/code links
        const code = params.get("code");
        if (code) {
          const { error } = await sb.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // B) Hash-based links (access_token / refresh_token in the hash)
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash?.includes("access_token")) {
          const q = new URLSearchParams(hash.replace(/^#/, ""));
          const access_token = q.get("access_token");
          const refresh_token = q.get("refresh_token");
          if (access_token && refresh_token) {
            await sb.auth.setSession({ access_token, refresh_token });
            // Clean the hash so refreshes don't re-run this
            window.history.replaceState({}, "", window.location.pathname);
          }
        }
      } catch (err) {
        console.error("Auth callback failed:", err);
      } finally {
        router.replace("/"); // home decides what to show (FeatureGrid vs marketing)
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="opacity-70">Signing you in…</div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="opacity-70">Preparing sign-in…</div>
        </main>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
