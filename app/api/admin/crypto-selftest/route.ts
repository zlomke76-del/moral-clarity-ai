/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import {
  initWorkspaceKey,
  encryptIfNeeded,
  decryptIfPossible,
} from "@/server/memory-utils";

export const runtime = "nodejs";

/** Create a server-side Supabase client (service key preferred) */
function getAdminSupabase(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET() {
  const supa = getAdminSupabase();
  const workspaceId =
    process.env.MCA_WORKSPACE_ID || "diagnostic";

  try {
    // Make sure a key exists
    await initWorkspaceKey(supa, workspaceId);

    // Round-trip a small secret
    const secret = "hello";
    const enc = await encryptIfNeeded(supa, workspaceId, secret, "secret");
    const dec = await decryptIfPossible(supa, workspaceId, enc.storedContent);

    return NextResponse.json({
      ok: dec.plaintext === secret,
      wasEncrypted: enc.isEncrypted,
      workspaceId,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}
