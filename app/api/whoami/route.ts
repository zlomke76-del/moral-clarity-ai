import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.headers.get("cookie")?.match(new RegExp(`${name}=([^;]+)`))?.[1],
        set: () => {},
        remove: () => {},
      } as any,
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  return NextResponse.json({
    projectRef: process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/^https:\/\/(.+?)\.supabase\.co$/)?.[1],
    user: user ? { id: user.id, email: user.email } : null,
    error: error?.message ?? null,
  });
}
