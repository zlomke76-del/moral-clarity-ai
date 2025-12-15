import { NextResponse } from "next/server";

/**
 * Magic-link callback (IMPLICIT FLOW)
 *
 * Supabase JS running in the browser will:
 * - Read the access token from the URL fragment
 * - Persist the session automatically (localStorage)
 *
 * This route exists ONLY to redirect the user into /app.
 * It must NOT attempt cookie access, PKCE exchange, or session mutation.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);

  // Preserve hash fragment (access_token lives there)
  const redirectUrl = new URL("/app", url.origin);
  redirectUrl.hash = url.hash;

  return NextResponse.redirect(redirectUrl);
}
