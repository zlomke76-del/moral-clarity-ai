"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase/client";

export default function ChatUI() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const supabase = createClientBrowser();

        const { data, error } = await supabase.auth.getUser();

        if (cancelled) return;
        if (error) return;

        setUserId(data.user?.id ?? null);
      } catch {
        // silent fail — UI should not block on auth
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
