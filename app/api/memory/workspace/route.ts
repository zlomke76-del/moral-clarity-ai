import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // Create a mutable response so Supabase can refresh cookies if needed
  const response = NextResponse.json({});

  try {
    // Next.js 16–compatible Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            const cookieHeader = req.headers.get("cookie") ?? "";
            const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
            return match?.[1];
          },
          set(name, value, options) {
            response.cookies.set(name, value, options);
          },
          remove(name, options) {
            response.cookies.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Return the same response object so cookies persist
    return NextResponse.json({
      ok: true,
      user_id: user.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message ?? "Internal server error",
      },
      { status: 500 }
    );
  }
}
