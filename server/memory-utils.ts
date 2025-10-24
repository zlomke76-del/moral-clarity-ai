// server/memory-utils.ts
import { createClient } from "@supabase/supabase-js";
import { aesGcmEncryptRaw, unwrapWorkspaceKey } from "./crypto";

type Supa = ReturnType<typeof createClient>;

//— Encrypt content if sensitivity === 'restricted'
export async function encryptIfNeeded(
  supa: Supa,
  workspaceId: string,
  content: string,
  sensitivity: string
): Promise<{ storedContent: string; isEncrypted: boolean }> {
  if (sensitivity !== "restricted") {
    return { storedContent: content, isEncrypted: false };
  }

  // get key_ref from DB
  const { data, error } = await supa
    .from("mca.workspace_keys")
    .select("key_ref")
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Workspace key not found; initialize a key for this workspace.");
  }

  const rawKey = unwrapWorkspaceKey(data.key_ref);
  const { ciphertext, iv, tag } = aesGcmEncryptRaw(rawKey, content);
  return {
    storedContent: JSON.stringify({ ct: ciphertext, iv, tag }),
    isEncrypted: true,
  };
}

export async function quotaOk(supa: Supa, userUid: string, incomingBytes: number) {
  const [{ data: used, error: e1 }, { data: lim, error: e2 }] = await Promise.all([
    supa.rpc("mca.user_bytes_used", { p_user: userUid }),
    supa.rpc("mca.user_bytes_limit", { p_user: userUid }),
  ]);
  if (e1 || e2) throw new Error((e1?.message ?? e2?.message) || "Quota check failed");
  const usedNum = Number(used ?? 0);
  const limNum = Number(lim ?? 0);
  return usedNum + incomingBytes < limNum;
}

export async function writeAudit(
  supa: Supa,
  row: { item_id: string; actor_uid: string; action: "create" | "update" | "delete" | "read" | "share"; details?: any }
) {
  await supa.from("mca.memory_audit").insert({ ...row });
}

/**
 * One-time helper: create & store a workspace key.
 * Returns the stored key_ref string.
 */
export async function initWorkspaceKey(supa: Supa, workspaceId: string) {
  // if exists, return
  const existing = await supa.from("mca.workspace_keys").select("key_ref").eq("workspace_id", workspaceId).maybeSingle();
  if (existing.data) return existing.data.key_ref;

  // generate 32-byte key
  const key = Buffer.from(require("crypto").randomBytes(32));
  const { wrapWorkspaceKeyLocal } = await import("./crypto");
  const key_ref = wrapWorkspaceKeyLocal(key);

  const { error } = await supa.from("mca.workspace_keys").insert({ workspace_id: workspaceId, key_ref });
  if (error) throw new Error(error.message);
  return key_ref;
}
