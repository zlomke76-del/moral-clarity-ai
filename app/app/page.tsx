"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AppPage() {
  const [session, setSession] = useState(null);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    window.location.href = "/auth/sign-in";
    return null;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome to Moral Clarity AI</h1>
      <p>Your workspace will appear here once Six Blocks syncs.</p>
    </div>
  );
}
