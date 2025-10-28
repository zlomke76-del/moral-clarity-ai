// server/memory-utils.ts
import { randomBytes, createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Base64url encode without padding.
 */
function b64url(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/**
 * Deterministic, short id for a key material (non-secret).
 * We DO NOT store raw key material here—this is only a fingerprint for reference.
 */
function keyFingerprint(keyBytes: Uint8Array): string {
  const h = createHash("sha256").update(keyBytes).digest();
  // take first 16 bytes for a compact id
  return b64url(h.subarray(0, 16));
}

export type InitKeyRef = {
  workspace_id: string;
  key_id: string; // fingerprint/id of the stored key (non-secret)
};

/**
 * Ensure a symmetric key exists for a workspace.
 * - If missing, generates a new 32-byte key and stores it in mca.workspace_keys.
 * - Returns a stable reference containing {workspace_id, key_id}.
 *
 * Table assumptions:
 *   - public.mca.workspace_keys has columns:
 *       - workspace_id (uuid, pk/fk to mca.workspaces.id)
 *       - key_b64url (text)         // the secret, stored server-side; restrict RLS!
 *       - key_id (text, unique)     // non-secret fingerprint/id
 *       - created_at (timestamptz)  // default now()
 *   - RLS allows service role insert/select
 */
export async function initWorkspaceKey(
  supabase: SupabaseClient<Database>,
  workspaceId: string
): Promise<InitKeyRef> {
  if (!workspaceId) {
    throw new Error("workspaceId is required");
  }

  // 1) Does a key already exist?
  const { data: existing, error: existErr } = await supabase
    .from("mca.workspace_keys")
    .select("workspace_id,key_id")
    .eq("workspace_id", workspaceId)
    .limit(1)
    .maybeSingle();

  if (existErr) throw existErr;

  if (existing) {
    return { workspace_id: existing.workspace_id, key_id: existing.key_id };
  }

  // 2) Generate a new 32-byte random key and store it
  const keyBytes = randomBytes(32);
  const key_b64url = b64url(keyBytes);
  const fingerprint = keyFingerprint(keyBytes); // non-secret id

  const { data: inserted, error: insErr } = await supabase
    .from("mca.workspace_keys")
    .insert({
      workspace_id: workspaceId,
      key_b64url,
      key_id: fingerprint,
    })
    .select("workspace_id,key_id")
    .single();

  if (insErr) throw insErr;

  return { workspace_id: inserted.workspace_id, key_id: inserted.key_id };
}
