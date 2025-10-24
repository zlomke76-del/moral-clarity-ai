// server/memory-utils.ts
export async function encryptIfNeeded(supa, workspaceId: string, content: string, sensitivity: string) {
  if (sensitivity !== "restricted") return { storedContent: content, isEncrypted: false };

  const keyRef = await supa.from("mca.workspace_keys").select("key_ref").eq("workspace_id", workspaceId).maybeSingle();
  const rawKey = await unwrapKeyFromVaultOrKMS(keyRef.data.key_ref); // your KMS/Vault call
  const { ciphertext, iv, tag } = await aesGcmEncrypt(rawKey, content);
  return { storedContent: JSON.stringify({ ct: ciphertext, iv, tag }), isEncrypted: true };
}

export async function quotaOk(supa, userUid: string, incomingBytes: number) {
  const [{ data: used }, { data: lim }] = await Promise.all([
    supa.rpc("mca.user_bytes_used", { p_user: userUid }),
    supa.rpc("mca.user_bytes_limit", { p_user: userUid })
  ]);
  return Number(used ?? 0) + incomingBytes < Number(lim ?? 0);
}

export async function writeAudit(supa, row: { item_id: string, actor_uid: string, action: string, details?: any }) {
  await supa.from("mca.memory_audit").insert({ ...row });
}
