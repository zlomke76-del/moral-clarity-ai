// app/auth/callback/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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

  if (error) {
    const qs = new URLSearchParams({
      error,
      ...(error_description ? { error_description } : {}),
    }).toString();
    redirect(`/auth/error?${qs}`);
  }

  if (code) {
    const supabase = createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const qs = new URLSearchParams({
        error: "exchange_failed",
        error_description: exchangeError.message,
      }).toString();
      redirect(`/auth/error?${qs}`);
    }
  }

  const target =
    (next && safeNextPath(next)) ||
    (typeof next === "string" && decodeURIComponent(next)) ||
    "/";

  redirect(target);
}

function safeNextPath(value: string | undefined): string | null {
  if (!value) return null;
  try {
    if (value.startsWith("/")) return value;
    const url = new URL(value, "http://localhost");
    return url.pathname.startsWith("/") ? url.pathname + url.search + url.hash : null;
  } catch {
    return null;
  }
}
