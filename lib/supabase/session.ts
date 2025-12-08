// /lib/supabase/session.ts
import { createClientServer } from "./server";
import { createClientBrowser } from "./client";

/**
 * Get the session in a server environment.
 */
export async function getServerSession() {
  const supabase = await createClientServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the session in a browser environment.
 */
export async function getBrowserSession() {
  const supabase = createClientBrowser();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
