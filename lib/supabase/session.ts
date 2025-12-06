// lib/supabase/session.ts
// Server-side user/session utilities (Next.js 16 compatible)

import type { User } from "@supabase/supabase-js";
import { supabaseServer } from "./server";

/**
 * Get the current authenticated user (server-safe).
 * Works in RSC, layouts, pages, route handlers, and server actions.
 */
export async function getCurrentUser(): Promise<User | null> {
  // supabaseServer is now the *client*, not a function
  const supabase = supabaseServer;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}

/**
 * Get session information (optional helper if needed later)
 */
export async function getSession() {
  const supabase = supabaseServer;

  const { data, error } = await supabase.auth.getSession();
  if (error) return null;

  return data.session ?? null;
}
