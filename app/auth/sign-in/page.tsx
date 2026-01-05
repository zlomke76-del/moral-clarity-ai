"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink() {
    setError(null);

    // ✅ Initialize Supabase ONLY when sending the link
    const supabase = createClientComponentClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <main>
      <h1>Sign in to Moral Clarity AI</h1>

      {sent ? (
        <p>Check your email for the sign-in link.</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendLink}>Send Magic Link</button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
