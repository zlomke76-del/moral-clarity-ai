// server/memory-utils.ts
import { randomBytes, createHash, webcrypto } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/* =============================================================================
 * Encoding & small utils
 * ========================================================================== */

function b64urlEncode(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64urlDecode(b64u: string): Uint8Array {
  const pad = b64u.length % 4 === 2 ? "==" : b64u.length % 4 === 3 ? "=" : "";
  const base64 = b64u.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return new Uint8Array(Buffer.from(base64, "base64"));
}

function keyFingerprint(keyBytes: Uint8Array): string {
  const h = createHash("sha256").update(keyBytes).digest();
  return b64urlEncode(h.subarray(0, 16)); // compact id
}

const subtle = webcrypto.subtle;

/* =============================================================================
 * Workspace Key Management
 *  - Table: mca.workspace_keys { workspace_id uuid, key_b64url text, key_id text, created_at timestamptz }
 *  - RLS: allow service role only for select/insert on key_b64url
 * ========================================================================== */

export type InitKeyRef = {
  workspace_id: string;
  key_id: string; // non-secret id of key
};

export async function initWorkspaceKey(
  supabase: SupabaseClient<Database>,
  workspaceId: string
): Promise<InitKeyRef> {
  if (!workspaceId) throw new Error("workspaceId is required");

  const { data: existing, error: existErr } = await supabase
    .schema("mca")
    .from("workspace_keys")
    .select("workspace_id,key_id")
    .eq("workspace_id", workspaceId)
    .limit(1)
    .maybeSingle();

  if (existErr) throw existErr;
  if (existing) return { workspace_id: existing.workspace_id, key_id: existing.key_id };

  const keyBytes = randomBytes(32); // 256-bit
  const key_b64url = b64urlEncode(keyBytes);
  const fingerprint = keyFingerprint(keyBytes);

  const { data: inserted, error: insErr } = await supabase
    .schema("mca")
    .from("workspace_keys")
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

/* Cache keys in-memory for the serverless lifetime to reduce round trips */
const keyCache = new Map<string, Uint8Array>();

async function getWorkspaceKeyBytes(
  supabase: SupabaseClient<Database>,
  workspaceId: string
): Promise<Uint8Array> {
  const cached = keyCache.get(workspaceId);
  if (cached) return cached;

  const { data, error } = await supabase
    .schema("mca")
    .from("workspace_keys")
    .select("key_b64url")
    .eq("workspace_id", workspaceId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data?.key_b64url) {
    // If key is missing, create it proactively
    await initWorkspaceKey(supabase, workspaceId);
    const { data: data2, error: e2 } = await supabase
      .schema("mca")
      .from("workspace_keys")
      .select("key_b64url")
      .eq("workspace_id", workspaceId)
      .limit(1)
      .maybeSingle();
    if (e2) throw e2;
    if (!data2?.key_b64url) throw new Error("workspace key missing after init");
    const kb2 = b64urlDecode(data2.key_b64url);
    keyCache.set(workspaceId, kb2);
    return kb2;
  }

  const keyBytes = b64urlDecode(data.key_b64url);
  keyCache.set(workspaceId, keyBytes);
  return keyBytes;
}

/* =============================================================================
 * AES-GCM (v1)
 *  - We encrypt when sensitivity !== 'public'
 *  - Payload format (base64url):
 *      version(1 byte = 0x01) | iv(12 bytes) | ciphertext+authTag(...)
 * ========================================================================== */

const PAYLOAD_VERSION_V1 = 0x01;

async function importAesKey(raw: Uint8Array): Promise<CryptoKey> {
  return subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function concatBytes(a: Uint8Array, b: Uint8Array, c: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length + c.length);
  out.set(a, 0);
  out.set(b, a.length);
  out.set(c, a.length + b.length);
  return out;
}

function textEncoder() {
  return new TextEncoder();
}

function textDecoder() {
  return new TextDecoder();
}

/**
 * Encrypt content if sensitivity indicates we should.
 * Returns { storedContent, isEncrypted }.
 */
export async function encryptIfNeeded(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  content: string,
  sensitivity?: string // 'public' | 'restricted' | 'secret'
): Promise<{ storedContent: string; isEncrypted: boolean }> {
  const shouldEncrypt = sensitivity && sensitivity !== "public";

  if (!shouldEncrypt) {
    return { storedContent: content, isEncrypted: false };
  }

  const keyBytes = await getWorkspaceKeyBytes(supabase, workspaceId);
  const key = await importAesKey(keyBytes);

  const iv = randomBytes(12); // recommended length for GCM
  const data = textEncoder().encode(content);

  const cipherBuf = await subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  const cipher = new Uint8Array(cipherBuf);

  const version = new Uint8Array([PAYLOAD_VERSION_V1]);
  const full = concatBytes(version, iv, cipher);
  const storedContent = b64urlEncode(full); // compact, safe for text columns

  return { storedContent, isEncrypted: true };
}

/**
 * Attempt decryption. If payload is not encrypted (no version byte), returns it as-is.
 * Useful for admin tools / migrations.
 */
export async function decryptIfPossible(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  storedContent: string
): Promise<{ plaintext: string; wasEncrypted: boolean }> {
  const bytes = b64urlDecode(storedContent);
  if (bytes.length > 0 && bytes[0] === PAYLOAD_VERSION_V1) {
    if (bytes.length < 1 + 12 + 1) throw new Error("cipher payload too short");
    const iv = bytes.subarray(1, 13);
    const cipher = bytes.subarray(13);

    const keyBytes = await getWorkspaceKeyBytes(supabase, workspaceId);
    const key = await importAesKey(keyBytes);

    const plainBuf = await subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
    const plaintext = textDecoder().decode(new Uint8Array(plainBuf));
    return { plaintext, wasEncrypted: true };
  }
  // Not our encrypted format; treat as plaintext
  return { plaintext: storedContent, wasEncrypted: false };
}

/* =============================================================================
 * Quotas (placeholder: per-item gate). Replace with total-usage calc later.
 * ========================================================================== */

export async function quotaOk(
  _supabase: SupabaseClient<Database>,
  _userId: string,
  incomingBytes: number
): Promise<boolean> {
  const limit = parseInt(process.env.MEMORY_QUOTA_BYTES || "", 10) || 40 * 1024 * 1024;
  return incomingBytes <= limit;
}

/* =============================================================================
 * Audit Log (accepts multiple shapes)
 *  - Table: mca.audit_log { action text, user_id uuid?, workspace_id uuid?, item_id uuid?, meta jsonb?, created_at timestamptz }
 * ========================================================================== */

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
      user_id: params.user_id ?? params.actor_uid ?? null,
      workspace_id: params.workspace_id ?? null,
      item_id: params.item_id ?? null,
      meta: (params.details ?? params.meta) ?? null,
    };
    await supabase.schema("mca").from("audit_log").insert(payload);
  } catch (err) {
    console.warn("writeAudit warning:", err);
  }
}
