"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* -------------------------------------------------------
   CONTEXT
-------------------------------------------------------- */

type SupabaseContextValue = {
  session: Session | null;
  loading: boolean;
};

const SupabaseSessionContext =
  createContext<SupabaseContextValue | undefined>(undefined);

/* -------------------------------------------------------
   PROVIDER
-------------------------------------------------------- */

export function SupabaseSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!ignore) {
        setSession(session ?? null);
        setLoading(false);
      }
    }

    loadSession();

    // Typed listener fixes build error
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, newSession: Session | null) => {
        if (!ignore) {
          setSession(newSession ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseSessionContext.Provider value={{ session, loading }}>
      {children}
    </SupabaseSessionContext.Provider>
  );
}

/* -------------------------------------------------------
   HOOK
-------------------------------------------------------- */

export function useSupabaseSession() {
  const ctx = useContext(SupabaseSessionContext);
  if (!ctx) {
    throw new Error(
      "useSupabaseSession must be used inside <SupabaseSessionProvider>"
    );
  }
  return ctx;
}


