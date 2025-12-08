// ------------------------------------------------------------
// Unified Supabase Session Helpers
// Next.js 16 safe — NO implicit cookies() or headers() here.
// Caller MUST provide cookieHeader when on server/edge.
// ------------------------------------------------------------

import { createClientServer } from "./server";
import { createClientBrowser } from "./client";

/**
 * SERVER / EDGE SAFE SESSION READER
 * Caller must pass cookieHeader from:
 *   - req.headers.get("cookie") (Edge routes)
 *   - headers().get("cookie") (SSR pages)
 */
export async function getServerSession(cookieHeader: string | null = "") {
  const sb = createClientServer(cookieHeader ?? "");

  const { data, error } = await sb.auth.getSession();
  if (error) {
    console.warn("[getServerSession] error:", error);
    return null;
  }

  return data.session ?? null;
}

/**
 * BROWSER SESSION READER
 * Works normally using local storage + auto refresh.
 */
export async function getBrowserSession() {
  const sb = createClientBrowser();

  const { data, error } = await sb.auth.getSession();
  if (error) {
    console.warn("[getBrowserSession] error:", error);
    return null;
  }

  return data.session ?? null;
}
