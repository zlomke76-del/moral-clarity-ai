"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

/*
IMPORTANT PRINCIPLES (DO NOT VIOLATE):

1. userKey must ONLY come from authenticated identity.
2. No constants, no defaults, no guessing.
3. Identity resolution happens explicitly here.
4. If auth is missing, userKey stays undefined.
*/

export function useSolaceMemory() {
  const [memReady, setMemReady] = useState(false);
  const memoryCacheRef = useRef<any[]>([]);

  // Authenticated user identity (undefined until resolved)
  const [userKey, setUserKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function resolveIdentity() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user?.id) {
          setUserKey(session.user.id);
        } else {
          setUserKey(undefined);
        }
      } catch (err) {
        console.error("[useSolaceMemory] auth resolution failed", err);
        setUserKey(undefined);
      } finally {
        if (mounted) setMemReady(true);
      }
    }

    resolveIdentity();

    // Keep identity in sync (login / logout / refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUserKey(session?.user?.id);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    userKey,
    memReady,
    memoryCacheRef,
  };
}
