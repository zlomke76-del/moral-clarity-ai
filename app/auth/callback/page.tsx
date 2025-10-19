// app/auth/callback/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * If you're using the Supabase Auth helpers for Next.js (SSR),
 * import your pre-wired client creator. If you don't have one yet,
 * see the inline "fallback" client creator below.
 */
import { createClient } from "@/lib/supabase/server"; // <-- preferred
// If you DON'T have "@/lib/supabase/server", uncomment this fallback:
/*
import { createServerClient, type CookieOptions } from "@supabase/ssr";

function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}
*/

export const runtime = "nodejs";            // Auth prefers Node runtime
export const dynamic = "force-dynamic";     // Never prerender this route
export const revalidate = 0;                // Must be a number or false (not an object)
export const fetchCache = "force-no-store"; // Avoid caching anything here

type SearchParams = {
  code?: string;
  next?: string;
  error?: string;
  error_description?: string;
};

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { code, next, error, error_description } = searchParams;

  // If provider returned an error, punt to a friendly error page
  if (error) {
    const qs = new URLSearchParams({
      error,
      ...(error_description ? { error_description } : {}),
    }).toString();
    redirect(`/auth/error?${qs}`);
  }

  // Exchange the authorization code for a session and set cookies
  if (code) {
    const supabase = createClient();
    // This will set the sb-* cookies via the SSR helpers’ cookie adapters
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      const qs = new URLSearchParams({
        error: "exchange_failed",
        error_description: exchangeError.message,
      }).toString();
      redirect(`/auth/error?${qs}`);
    }
  }

  // Where to redirect the user after login
  // (provider can pass ?next=...; sanitize/fallback to "/")
  const target =
    (next && safeNextPath(next)) ||
    (typeof next === "string" && decodeURIComponent(next)) ||
    "/";

  redirect(target);
}

/**
 * Very small guard against open-redirects. Only allow same-origin paths.
 * Returns a safe path (starting with "/") or null.
 */
function safeNextPath(value: string | undefined): string | null {
  if (!value) return null;
  try {
    // Disallow absolute URLs; allow only app-internal paths
    if (value.startsWith("/")) return value;
    // If someone passed a full URL, require it to be same-origin path
    const url = new URL(value, "http://localhost"); // base won’t be used for absolute paths starting with "/"
    return url.pathname.startsWith("/") ? url.pathname + url.search + url.hash : null;
  } catch {
    return null;
  }
}
