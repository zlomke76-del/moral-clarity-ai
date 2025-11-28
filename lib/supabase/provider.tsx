"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";

const SupabaseContext = createContext<any>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabase must be used inside <SupabaseProvider>");
  return ctx;
}
