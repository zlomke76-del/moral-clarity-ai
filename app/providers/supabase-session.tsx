"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export type SupabaseSessionValue = {
  session: any;
  loading: boolean;
};

const SupabaseSessionContext = createContext<SupabaseSessionValue | null>(null);

export function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseBrowser();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!ignore) {
        setSession(data.session ?? null);
        setLoading(false);
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!ignore) {
          setSession(newSession ?? null);
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

export function useSupabaseSession() {
  const ctx = useContext(SupabaseSessionContext);
  if (!ctx) throw new Error("useSupabaseSession must be used inside <SupabaseSessionProvider>");
  return ctx;
}


