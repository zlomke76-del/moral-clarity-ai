"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignInPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");

  async function sendLink() {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main>
      <h1>Sign in to Moral Clarity AI</h1>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendLink}>Send Magic Link</button>
    </main>
  );
}



