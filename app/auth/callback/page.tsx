"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser"; // your browser client factory
import { useRouter } from "next/navigation";

function parseHash(search: string) {
  // Supabase magic-link puts tokens in the URL hash (#access_token=...).
  // We convert it into a URLSearchParams to read values.
  const hash = search.startsWith("#") ? search.slice(1) : search;
  return new URLSearchParams(hash);
}

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"working"|"done"|"error">("working");
  const [message, setMessage] = useState<string>("Finishing sign-in…");

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient();

        // 1) Try code exchange (PKCE / OAuth). If there's a `code` param,
        // Supabase will exchange and set the session.
        const { error: codeErr } = await supabase.auth.exchangeCodeForSession();
        if (!codeErr) {
          setStatus("done");
          router.replace("/studio"); // wherever you want to land
          return;
        }

        // 2) Fallback: magic-link tokens come in the hash (#access_token=...).
        const params = parseHash(window.location.hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const error = params.get("error");
        const error_description = params.get("error_description");

        if (error) {
          setStatus("error");
          setMessage(
            error === "access_denied"
              ? (error_description ?? "This sign-in link is invalid or expired.")
              : `Sign-in error: ${error_description ?? error}`
          );
          return;
        }

        if (access_token && refresh_token) {
          const { error: setErr } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (setErr) throw setErr;

          setStatus("done");
          router.replace("/studio"); // destination after login
          return;
        }

        // Nothing to exchange and no tokens present
        setStatus("error");
        setMessage("No sign-in token found. Please request a new link.");
      } catch (e: any) {
        setStatus("error");
        setMessage(e?.message ?? "Could not complete sign-in.");
      }
    };

    run();
  }, [router]);

  if (status === "working") {
    return (
      <div className="mx-auto max-w-md p-8">
        <h1 className="text-xl font-semibold">Signing you in…</h1>
        <p className="mt-2 text-sm text-gray-500">
          Please wait a moment.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-md p-8">
        <h1 className="text-xl font-semibold">We couldn’t sign you in</h1>
        <p className="mt-3 text-sm text-red-600">{message}</p>
        <a
          className="mt-6 inline-block rounded bg-black px-4 py-2 text-white"
          href="/login"
        >
          Get a new sign-in link
        </a>
      </div>
    );
  }

  return null;
}
