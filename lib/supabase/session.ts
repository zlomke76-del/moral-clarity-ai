// lib/supabase/session.ts
import type { User } from "@supabase/supabase-js";
import { createServerSupabase } from "./server";

/** Get current user (server-side, safe in RSC/layout/pages) */
export async function getCurrentUser(): Promise<User | null> {
  const supa = createServerSupabase();
  const { data } = await supa.auth.getUser();
  return data.user ?? null;
}

/** Get current session if you need access token/exp, etc. */
export async function getCurrentSession() {
  const supa = createServerSupabase();
  const { data } = await supa.auth.getSession();
  return data.session ?? null;
}
