// app/providers/supabase-provider.tsx
"use client";

import { createContext, useContext, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Create a single client instance for the whole app
  const [client] = useState(() => createClientComponentClient());
  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const client = useContext(SupabaseContext);
  if (!client) {
    throw new Error("useSupabase must be used inside <SupabaseProvider>");
  }
  return client;
}
