import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userKey } = await req.json();

  if (!userKey) {
    return NextResponse.json(
      { error: "userKey required" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  // Create a fresh conversation (no guessing, no reuse)
  const { data, error } = await supabase
    .from("chat.conversations")
    .insert({
      user_key: userKey,
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ conversationId: data.id });
}
