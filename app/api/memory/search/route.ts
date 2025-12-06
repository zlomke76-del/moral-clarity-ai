// app/api/memory/search/route.ts

import { NextResponse } from "next/server";
import { searchMemories } from "@/lib/memory";

export async function POST(req: Request) {
  const { user_key, query, k = 8 } = await req.json();

  if (!user_key) {
    return new NextResponse("user_key required", { status: 400 });
  }

  if (!query) {
    return new NextResponse("query required", { status: 400 });
  }

  // searchMemories only accepts (user_key, query)
  const hits = await searchMemories(user_key, query);

  return NextResponse.json({ hits });
}
