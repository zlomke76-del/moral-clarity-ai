// app/auth/callback/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

// Ensure Node runtime and no prerendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<FallbackUI />}>
      <AuthCallbackInner />
    </Suspense>
  );
}

function FallbackUI() {
  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div>
        <h1>Finalizing your sign-in…</h1>
        <p style={{ color: "#888" }}>Please wait.</p>
      </div>
    </main>
  );
}

function AuthCallbackInner() {
  const router = useRouter();
  const search = useSearchParams();

  const [state, setState] = useState<"working" | "ok" | "err">("working");
  const [msg, setMsg] = useState("Finalizing your sign-in…");

  useEffect(() => {
    const run = async () => {
      try {
        const sb = createSupabaseBrowser();

        // Case A: magic link / recovery / invite / email_change
        const tokenHash = search.get("token_hash");
        const type = (search.get("type") || "").toLowerCase();
        const email = search.get("email") || undefined;

        if (tokenHash && type) {
          const validType = ["magiclink", "recovery", "invite", "email_change"].includes(type)
            ? (type as "magiclink" | "recovery" | "invite" | "email_change")
            : undefined;

          if (!validType) throw new Error(`Unsupported link type: ${type}`);

          const { error } = await sb.auth.verifyOtp({
            type: validType,
            token_hash: tokenHash,
            email,
          });
          if (error) throw error;

          setState("ok");
          setMsg("Signed in. Redirecting…");
          router.replace("/studio");
          return;
        }

        // Case B: OAuth or legacy #access_token hash in URL (SDK already processed it)
        const { data, error } = await sb.auth.getSession();
        if (error) throw error;

        if (data.session) {
          setState("ok");
          setMsg("Signed in. Redirecting…");
          router.replace("/studio");
          return;
        }

        setState("err");
        setMsg("Email link is invalid or has expired. Please request a new link.");
      } catch (e: any) {
        setState("err");
        setMsg(e?.message ?? "Could not complete sign-in.");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: 8 }}>
          {state === "working" ? "Signing you in…" : state === "ok" ? "Success" : "Something went wrong"}
        </h1>
        <p style={{ color: state === "err" ? "#d33" : "#888" }}>{msg}</p>
        {state === "err" && (
          <p style={{ marginTop: 16 }}>
            <a href="/login">Go back to sign in</a>
          </p>
        )}
      </div>
    </main>
  );
}
