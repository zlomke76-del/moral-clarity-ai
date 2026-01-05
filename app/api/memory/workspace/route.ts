import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // ✅ MUST await the async Supabase client factory
    const supabase = await createSupabaseServerClient();

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

    // If this route is only checking auth / workspace access,
    // return success once the user is confirmed.
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
