// lib/supabaseSessionProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseBrowser } from "./supabaseBrowser";

const SessionContext = createContext(null);

export function SupabaseSessionProvider({ children }) {
  const supabase = createSupabaseBrowser();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  return (
    <SessionContext.Provider value={{ session, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSupabaseSession() {
  return useContext(SessionContext);
}
