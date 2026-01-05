// lib/supabase/server.ts
// ------------------------------------------------------------
// SERVER-ONLY Supabase client factory
//
// Canonical rules:
// - Do NOT stub or override cookies unless you fully implement them
// - Let @supabase/ssr manage PKCE + base64 cookies internally
// - Passing an empty cookies adapter causes session recovery failures
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient(accessToken?: string) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Optional Authorization header for service-to-service or
      // explicitly forwarded access tokens
      global: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : undefined,

      // IMPORTANT:
      // Do NOT provide a cookies adapter here.
      // If omitted, Supabase will correctly read and write
      // base64-encoded auth cookies on its own.
    }
  );
}
