import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import {
  initWorkspaceKey,
  encryptIfNeeded,
  decryptIfPossible,
} from "../../../../server/memory-utils"; // <-- fixed depth

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function badAuth() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (!token || token !== process.env.ADMIN_TASKS_TOKEN) return badAuth();

  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId") || "";
  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
  }

  const supa: SupabaseClient<Database> = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const keyRef = await initWorkspaceKey(supa, workspaceId);

    const sample = `mca-selftest:${Date.now()}`;
    const { storedContent, isEncrypted } = await encryptIfNeeded(
      supa,
      workspaceId,
      sample,
      "secret"
    );
    const { plaintext, wasEncrypted } = await decryptIfPossible(
      supa,
      workspaceId,
      storedContent
    );

    const ok = plaintext === sample;

    return NextResponse.json(
      {
        ok,
        keyRef,
        isEncrypted,
        wasEncrypted,
        sampleLen: sample.length,
        storedLen: storedContent.length,
      },
      { status: ok ? 200 : 500 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
