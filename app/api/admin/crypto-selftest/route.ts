// app/api/admin/crypto-selftest/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  initWorkspaceKey,
  encryptIfNeeded,
  decryptIfPossible,
} from "../../../../server/memory-utils";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../../types/supabase";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Supabase env not configured");
  return createClient<Database>(url, key, { db: { schema: "mca" } });
}

/**
 * Round-trip AES-GCM self-test:
 *  - POST/GET { workspaceId } or ?workspaceId=
 *  - returns { ok, workspace_id, key_id, ciphertext, roundtripPlain, wasEncrypted }
 */
export async function POST(req: Request) {
  try {
    const supabase = getAdminSupabase();

    const url = new URL(req.url);
    const contentType = req.headers.get("content-type") || "";
    let workspaceId: string | undefined =
      url.searchParams.get("workspaceId") ?? undefined;

    if (!workspaceId && contentType.includes("application/json")) {
      const body = (await req.json()) ?? {};
      workspaceId = body.workspaceId || body.workspace_id;
    }
    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId required" }, { status: 400 });
    }

    const ref = await initWorkspaceKey(supabase, workspaceId);

    const probe = `mca-crypto-selftest:${new Date().toISOString()}`;
    const enc = await encryptIfNeeded(supabase, workspaceId, probe, "secret");
    const dec = await decryptIfPossible(supabase, workspaceId, enc.storedContent);

    const ok = dec.plaintext === probe && dec.wasEncrypted === true;

    return NextResponse.json({
      ok,
      workspace_id: ref.workspace_id,
      key_id: ref.key_id,
      ciphertext: enc.storedContent,
      roundtripPlain: dec.plaintext,
      wasEncrypted: dec.wasEncrypted,
    });
  } catch (err: any) {
    console.error("[crypto-selftest] error:", err?.message ?? err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "selftest error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
