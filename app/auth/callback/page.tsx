// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [state, setState] = useState<"working" | "ok" | "err">("working");
  const [msg, setMsg] = useState<string>("Finalizing your sign-in…");

  useEffect(() => {
    const run = async () => {
      try {
        const sb = createSupabaseBrowser();

        // Case A: Email OTP / magic-link via query params
        const tokenHash = search.get("token_hash");
        const type = (search.get("type") || "").toLowerCase();
        const email = search.get("email") || undefined;

        if (tokenHash && type) {
          // Types that Supabase accepts for verifyOtp:
          // 'magiclink' | 'recovery' | 'invite' | 'email_change'
          const validType = ["magiclink", "recovery", "invite", "email_change"].includes(
            type
          )
            ? (type as
                | "magiclink"
                | "recovery"
                | "invite"
                | "email_change")
            : undefined;

          if (!validType) {
            throw new Error(`Unsupported link type: ${type}`);
          }

          const { error } = await sb.auth.verifyOtp({
            type: validType,
            token_hash: tokenHash,
            email, // Supabase will use it when needed (if present)
          });
          if (error) throw error;

          setState("ok");
          setMsg("Signed in. Redirecting…");
          router.replace("/studio"); // <- change if your app's home is different
          return;
        }

        // Case B: OAuth or legacy hash (#access_token) – SDK handles it automatically
        // We just check whether a session exists now.
        const { data, error } = await sb.auth.getSession();
        if (error) throw error;

        if (data.session) {
          setState("ok");
          setMsg("Signed in. Redirecting…");
          router.replace("/studio"); // <- change if needed
          return;
        }

        // If we’re here, we didn’t detect/verify anything.
        setState("err");
        setMsg(
          "Email link is invalid or has expired. Please request a new sign-in link."
        );
      } catch (e: any) {
        setState("err");
        setMsg(e?.message || "Could not complete sign-in.");
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ marginBottom: 8 }}>
          {state === "working" ? "Signing you in…" : state === "ok" ? "Success" : "Something went wrong"}
        </h1>
        <p style={{ color: state === "err" ? "#d33" : "#999" }}>{msg}</p>
        {state === "err" && (
          <p style={{ marginTop: 16 }}>
            <a href="/login">Go back to sign in</a>
          </p>
        )}
      </div>
    </main>
  );
}
