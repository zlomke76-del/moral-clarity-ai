"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ChatUI() {
  const supabase = createClientComponentClient();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (cancelled) return;
        if (error) return;

        setUserId(data.user?.id ?? null);
      } catch {
        // Silent fail — UI must not block on auth
      }
    }

    resolveUser();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return (
    <div>
      {userId ? (
        <p>User authenticated</p>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  );
}
