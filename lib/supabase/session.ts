// lib/supabase/session.ts
import type { User } from "@supabase/supabase-js";
import { supabaseServer } from "./server";

/**
 * Get current user (server-side safe)
 * Works in RSC, layouts, pages, server actions.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}
