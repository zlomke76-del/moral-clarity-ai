// app/providers/supabase-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------
// Context
// ---------------------------------------------
const SupabaseContext = createContext<SupabaseClient | null>(null);

// ---------------------------------------------
// Provider
// ---------------------------------------------
export function SupabaseProvider({ children }: { children: ReactNode }) {
  // We must create the client ONLY in the browser.
  const [client, setClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    setClient(supabase);
  }, []);

  // During SSR or first paint, return children without a client.
  if (!client) return <>{children}</>;

  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  );
}

// ---------------------------------------------
// Hook
// ---------------------------------------------
export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (ctx === null) {
    throw new Error("useSupabase must be used inside <SupabaseProvider>");
  }
  return ctx;
}
