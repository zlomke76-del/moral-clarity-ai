// app/api/memory/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { quotaOk, encryptIfNeeded, writeAudit } from "@/server/memory-utils";

const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const { workspaceId, bucketId, content, title, tags, sensitivity, authorUid } = await req.json();

  // 1) quota
  const ok = await quotaOk(supa, authorUid, Buffer.byteLength(content, "utf8"));
  if (!ok) return NextResponse.json({ error: "Memory quota exceeded." }, { status: 402 });

  // 2) encrypt if restricted
  const { storedContent, isEncrypted } = await encryptIfNeeded(supa, workspaceId, content, sensitivity);

  // 3) insert
  const { data, error } = await supa.from("mca.memory_items").insert({
    bucket_id: bucketId,
    author_uid: authorUid,
    title,
    content: storedContent,
    tags,
    sensitivity
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // 4) vectorize (optional async queue)
  // enqueueVectorize(data.id, storedContent, isEncrypted);

  // 5) audit
  await writeAudit(supa, { item_id: data.id, actor_uid: authorUid, action: "create", details: { isEncrypted } });

  return NextResponse.json({ id: data.id }, { status: 201 });
}
