// /lib/supabase/session.ts
// ------------------------------------------------------------
// Centralized session resolver for both server + client.
// This version is fully compatible with Next.js 16 and with the
// new cookieHeader-based createClientServer() implementation.
// ------------------------------------------------------------

import { headers } from "next/headers";
import { createClientServer } from "./server";
import { createClientBrowser } from "./client";

/**
 * Get the authenticated Supabase session in a SERVER environment.
 * IMPORTANT:
 *   - We must pass the raw cookie header into createClientServer()
 *     because Next.js 16 no longer exposes valid cookie objects for SSR.
 *   - This ensures API routes (/api/chat, orchestrator, memory reads)
 *     correctly receive the logged-in user identity.
 */
export async function getServerSession() {
  // Read raw cookie header safely
  const cookieHeader = headers().get("cookie") ?? "";

  // Create SSR supabase client with correct cookie state
  const supabase = createClientServer(cookieHeader);

  // Retrieve session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

/**
 * Get the session in a browser environment.
 * The browser client manages cookies + refresh automatically.
 */
export async function getBrowserSession() {
  const supabase = createClientBrowser();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

