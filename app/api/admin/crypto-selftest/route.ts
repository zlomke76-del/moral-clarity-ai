/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { encryptIfNeeded, decryptIfPossible } from "@/server/memory-utils";

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

  const wsId = process.env.MCA_WORKSPACE_ID || "diagnostic";
  const secret = "hello";
  const enc = await encryptIfNeeded(supabase as any, wsId, secret, "secret");
  const dec = await decryptIfPossible(supabase as any, wsId, enc.storedContent);

  return NextResponse.json({
    ok: dec.plaintext === secret,
    encrypted: enc.isEncrypted,
  });
}
