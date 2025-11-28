// app/providers/supabase-session.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

type SupabaseSessionValue = {
  session: Session | null;
  loading: boolean;
};

const SupabaseSessionContext =
  createContext<SupabaseSessionValue | undefined>(undefined);

export function SupabaseSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
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

export function useSupabaseSession() {
  const ctx = useContext(SupabaseSessionContext);
  if (!ctx) {
    throw new Error(
      'useSupabaseSession must be used inside <SupabaseSessionProvider>'
    );
  }
  return ctx;
}


