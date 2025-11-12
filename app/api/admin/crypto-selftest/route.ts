/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
<<<<<<< HEAD
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { encryptIfNeeded, decryptIfPossible } from "@/server/memory-utils";
=======
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import {
  initWorkspaceKey,
  encryptIfNeeded,
  decryptIfPossible,
} from "@/lib/memory-utils";
>>>>>>> origin/speedinsights-install

export const runtime = "nodejs";

export async function GET() {
  // Minimal self-test that also validates the import compiles
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

<<<<<<< HEAD
  const wsId = process.env.MCA_WORKSPACE_ID || "diagnostic";
  const secret = "hello";
  const enc = await encryptIfNeeded(supabase as any, wsId, secret, "secret");
  const dec = await decryptIfPossible(supabase as any, wsId, enc.storedContent);

  return NextResponse.json({
    ok: dec.plaintext === secret,
    encrypted: enc.isEncrypted,
  });
=======
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
>>>>>>> origin/speedinsights-install
}

