// server/memory-utils.ts
import { randomBytes, createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/* -------------------------- helpers: encoding / ids ------------------------- */

function b64url(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function keyFingerprint(keyBytes: Uint8Array): string {
  const h = createHash("sha256").update(keyBytes).digest();
  return b64url(h.subarray(0, 16)); // compact id
}

/* ---------------------------- workspace key logic --------------------------- */

export type InitKeyRef = {
  workspace_id: string;
  key_id: string; // non-secret id of key
};

/**
 * Ensure a symmetric key exists for a workspace.
 * Assumes table public.mca.workspace_keys with:
 *  - workspace_id uuid
 *  - key_b64url text (secret, protect w/ RLS)
 *  - key_id text unique (non-secret fingerprint)
 *  - created_at timestamptz default now()
 */
export async function initWorkspaceKey(
  supabase: SupabaseClient<Database>,
  workspaceId: string
): Promise<InitKeyRef> {
  if (!workspaceId) throw new Error("workspaceId is required");

  const { data: existing, error: existErr } = await supabase
    .from("mca.workspace_keys")
    .select("workspace_id,key_id")
    .eq("workspace_id", workspaceId)
    .limit(1)
    .maybeSingle();

  if (existErr) throw existErr;
  if (existing) return { workspace_id: existing.workspace_id, key_id: existing.key_id };

  const keyBytes = randomBytes(32);
  const key_b64url = b64url(keyBytes);
  const fingerprint = keyFingerprint(keyBytes);

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

/* ------------------------ memory encryption (placeholder) ------------------- */

/**
 * encryptIfNeeded
 * For now: pass-through (no encryption). Return shape matches a future encrypted flow.
 * You can upgrade this to fetch the workspace key and encrypt payloads.
 */
export type EncryptResult = {
  cipher: "none" | "v1-aesgcm";
  payload: string; // the stored value (ciphertext or plaintext)
};

export async function encryptIfNeeded(
  _supabase: SupabaseClient<Database>,
  _workspaceId: string,
  plaintext: string
): Promise<EncryptResult> {
  // TODO: implement AES-GCM with key from mca.workspace_keys if required
  return { cipher: "none", payload: plaintext };
}

/* ------------------------------ quotas (simple) ----------------------------- */

/**
 * quotaOk
 * Simple gate using an env-configured byte quota. For now it doesn't query totals;
 * it just checks incoming size against a max chunk limit. Replace with a true total
 * usage calculation when ready.
 *
 * ENV: MEMORY_QUOTA_BYTES (default 40 MiB)
 */
export async function quotaOk(
  _supabase: SupabaseClient<Database>,
  _userId: string,
  incomingBytes: number
): Promise<boolean> {
  const limit = parseInt(process.env.MEMORY_QUOTA_BYTES || "", 10) || 40 * 1024 * 1024;
  // allow writes up to limit per item (conservative). Replace with sum(current_usage)+incomingBytes check.
  return incomingBytes <= limit;
}

/* --------------------------------- audit log -------------------------------- */

/**
 * writeAudit
 * Non-fatal attempt to persist an audit record. Schema is intentionally generic;
 * adjust to your table when ready.
 *
 * Assumes table: public.mca.audit_log { id, action, user_id, workspace_id, meta, created_at }
 */
export async function writeAudit(
  supabase: SupabaseClient<Database>,
  params: {
    action: string;
    user_id?: string | null;
    workspace_id?: string | null;
    meta?: Record<string, unknown> | null;
  }
): Promise<void> {
  try {
    await supabase.from("mca.audit_log").insert({
      action: params.action,
      user_id: params.user_id ?? null,
      workspace_id: params.workspace_id ?? null,
      meta: params.meta ?? null,
    });
  } catch (err) {
    // Don't fail the request for audit write issues
    console.warn("writeAudit warning:", err);
  }
}
