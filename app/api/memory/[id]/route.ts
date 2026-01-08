// app/api/memory/[id]/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    /* ------------------------------------------------------------
       AUTH: Bearer token required
    ------------------------------------------------------------ */
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    /* ------------------------------------------------------------
       Supabase client bound to user token (RLS enforced)
    ------------------------------------------------------------ */
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ------------------------------------------------------------
       Params + body
    ------------------------------------------------------------ */
    const memoryId = params.id;
    if (!memoryId) {
      return NextResponse.json(
        { error: "Memory ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { content } = body;

    if (content === undefined) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    /* ------------------------------------------------------------
       UPDATE — ownership enforced by RLS + WHERE
    ------------------------------------------------------------ */
    const { data: updated, error: updateError } = await supabase
      .schema("memory")
      .from("memories")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memoryId)
      .eq("user_id", userData.user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Memory not found or not owned by user" },
        { status: 404 }
      );
    }

    /* ------------------------------------------------------------
       Success
    ------------------------------------------------------------ */
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
