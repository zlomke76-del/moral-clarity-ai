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
 * Signature matches /app/api/memory/route.ts expectations:
 *   encryptIfNeeded(supa, workspaceId, content, sensitivity)
 * Returns:
 *   { storedContent: string, isEncrypted: boolean }
 *
 * Currently pass-through (no encryption). You can later:
 *  1) fetch key from mca.workspace_keys by workspaceId,
 *  2) AES-GCM encrypt `content`,
 *  3) return { storedContent: base64url(ciphertext), isEncrypted: true }.
 */
export async function encryptIfNeeded(
  _supabase: SupabaseClient<Database>,
  _workspaceId: string,
  content: string,
  _sensitivity?: string // e.g., 'public' | 'restricted' | 'secret'
): Promise<{ storedContent: string; isEncrypted: boolean }> {
  // TODO: implement real encryption when ready.
  return { storedContent: content, isEncrypted: false };
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
  return incomingBytes <= limit;
}

/* --------------------------------- audit log -------------------------------- */
/**
 * writeAudit
 * Accepts multiple calling shapes, including:
 *   { item_id, actor_uid, action, details, workspace_id }
 *   { user_id, action, meta, workspace_id }
 * Maps them to a consistent insert payload.
 *
 * Assumes table: public.mca.audit_log with columns:
 *   action text, user_id uuid/null, workspace_id uuid/null,
 *   item_id uuid/null, meta jsonb/null, created_at timestamptz default now()
 */
export async function writeAudit(
  supabase: SupabaseClient<Database>,
  params: {
    action: string;
    user_id?: string | null;
    actor_uid?: string | null;
    workspace_id?: string | null;
    item_id?: string | null;
    meta?: Record<string, unknown> | null;
    details?: Record<string, unknown> | null;
  }
): Promise<void> {
  try {
    const payload = {
      action: params.action,
      // prefer explicit user_id; else fallback to actor_uid
      user_id: params.user_id ?? params.actor_uid ?? null,
      workspace_id: params.workspace_id ?? null,
      item_id: params.item_id ?? null,
      // prefer details; else meta
      meta: (params.details ?? params.meta) ?? null,
    };

    await supabase.from("mca.audit_log").insert(payload);
  } catch (err) {
    // Non-fatal by design
    console.warn("writeAudit warning:", err);
  }
}
