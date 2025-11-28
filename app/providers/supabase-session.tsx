"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

export function useSupabaseSession() {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!ignore) {
        setSession(session);
        setLoading(false);
      }
    }

    load();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!ignore) {
          setSession(newSession);
          setLoading(false);
        }
      }
    );

    return () => {
      ignore = true;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { session, loading };
}
