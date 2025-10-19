// app/auth/callback/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

/** Keep this page dynamic so Vercel doesn't try to prerender it */
export const dynamic = "force-dynamic";
export const revalidate = false; // <- important: boolean, not an object/shape

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const sb = createSupabaseBrowser();

  useEffect(() => {
    (async () => {
      try {
        // A) PKCE/code callback
        const code = params.get("code");
        if (code) {
          const { error } = await sb.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // B) Hash-based (access_token/refresh_token in URL hash)
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash?.includes("access_token")) {
          const q = new URLSearchParams(hash.replace(/^#/, ""));
          const access_token = q.get("access_token");
          const refresh_token = q.get("refresh_token");
          if (access_token && refresh_token) {
            await sb.auth.setSession({ access_token, refresh_token });
            // Clean hash so refreshes don't repeat this
            window.history.replaceState({}, "", window.location.pathname);
          }
        }
      } catch (err) {
        console.error("Auth callback failed:", err);
      } finally {
        // Send the user to the homepage; the homepage decides what to show
        router.replace("/");
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
