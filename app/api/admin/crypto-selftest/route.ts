/* app/api/admin/crypto-selftest/route.ts */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { encryptIfNeeded, decryptIfPossible, initWorkspaceKey } from "@/lib/memory-utils";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    return NextResponse.json(
      { ok: false, error: "Missing Supabase env (URL or SERVICE_ROLE)" },
      { status: 500 }
    );
  }

  const supa = createClient(url, service, { auth: { persistSession: false } });
  const workspaceId = process.env.MCA_WORKSPACE_ID || "diagnostic";

  try {
    // Ensure a key exists
    await initWorkspaceKey(supa as any, workspaceId);

    // Round-trip test
    const secret = "hello";
    const enc = await encryptIfNeeded(supa as any, workspaceId, secret, "secret");
    const dec = await decryptIfPossible(supa as any, workspaceId, enc.storedContent);

    return NextResponse.json({
      ok: dec.plaintext === secret,
      encrypted: enc.isEncrypted,
      plaintext: dec.plaintext,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
