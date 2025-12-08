// app/auth/sign-in/page.tsx
"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const supabase = createSupabaseBrowser();

  const send = async (e: any) => {
    e.preventDefault();

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://studio.moralclarity.ai/auth/callback",
      },
    });

    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <form onSubmit={send} className="space-y-4">
        <h1 className="text-xl font-semibold">Sign In</h1>

        <input
          type="email"
          className="px-3 py-2 rounded text-black"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded text-white"
        >
          Send Magic Link
        </button>

        {sent && (
          <p className="text-green-400">
            Check your email for a sign-in link.
          </p>
        )}
      </form>
    </div>
  );
}





