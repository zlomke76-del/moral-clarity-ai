/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { initWorkspaceKey } from "@/server/memory-utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { workspaceId } = await request.json();
  if (!workspaceId) {
    return NextResponse.json({ ok: false, error: "workspaceId required" }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookies().get(name)?.value,
        set: () => {},
        remove: () => {},
      } as any,
    }
  );

  const ref = await initWorkspaceKey(supabase as any, workspaceId);
  return NextResponse.json({ ok: true, ref });
}
