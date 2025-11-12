// Node-only crypto helpers for workspace-scoped encryption.
// Uses Supabase "mca" schema tables:
//   - mca.workspace_keys: { workspace_id uuid pk, key_b64 text not null, created_at timestamptz }
// AES-GCM with 256-bit random key per workspace.

import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

type AnySB = SupabaseClient<any>;

// --- constants ---
const KEY_BYTES = 32; // 256-bit
const IV_BYTES = 12;  // recommended for AES-GCM
const TAG_BYTES = 16; // implicit via GCM

// Stored payload format: enc:v1:<base64(iv + ciphertext + tag)>
const PREFIX = 'enc:v1:';

// --- internals ---
function mca(supa: AnySB) {
  return (supa as unknown as SupabaseClient<any>).schema('mca');
}

function toB64(u8: Uint8Array) {
  return Buffer.from(u8).toString('base64');
}
function fromB64(b64: string) {
  return new Uint8Array(Buffer.from(b64, 'base64'));
}

async function getOrCreateKey(supa: AnySB, workspaceId: string): Promise<Buffer> {
  // 1) try read
  const { data: have, error: readErr } = await mca(supa)
    .from('workspace_keys')
    .select('key_b64')
    .eq('workspace_id', workspaceId)
    .limit(1)
    .maybeSingle();

  if (readErr) throw readErr;
  if (have?.key_b64) {
    return Buffer.from(have.key_b64, 'base64');
  }

  // 2) create
  const key = crypto.randomBytes(KEY_BYTES);
  const key_b64 = key.toString('base64');

  const { error: insErr } = await mca(supa)
    .from('workspace_keys')
    .insert({ workspace_id: workspaceId, key_b64 });

  if (insErr) {
    // race? re-read
    const { data: again, error: readErr2 } = await mca(supa)
      .from('workspace_keys')
      .select('key_b64')
      .eq('workspace_id', workspaceId)
      .limit(1)
      .maybeSingle();
    if (readErr2) throw readErr2;
    if (!again?.key_b64) throw insErr;
    return Buffer.from(again.key_b64, 'base64');
  }
  return key;
}

// --- public API ---

/**
 * Ensure a workspace AES key exists and return a reference summary.
 */
export async function initWorkspaceKey(supa: AnySB, workspaceId: string) {
  const key = await getOrCreateKey(supa, workspaceId);
  return {
    workspaceId,
    keyBytes: key.length,
    alg: 'AES-256-GCM',
  };
}

/**
 * Encrypt plaintext with the workspace key.
 * Returns a string suitable for storage and a flag `isEncrypted = true`.
 * `sensitivity` is accepted for API compatibility; not used to switch modes here.
 */
export async function encryptIfNeeded(
  supa: AnySB,
  workspaceId: string,
  plaintext: string,
  _sensitivity: 'public' | 'secret' | string = 'secret'
): Promise<{ storedContent: string; isEncrypted: boolean }> {
  const key = await getOrCreateKey(supa, workspaceId);
  const iv = crypto.randomBytes(IV_BYTES);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const payload = Buffer.concat([iv, ct, tag]); // iv | ciphertext | tag
  return { storedContent: PREFIX + payload.toString('base64'), isEncrypted: true };
}

/**
 * Attempt to decrypt previously-stored content. If it does not look encrypted,
 * return it as-is with wasEncrypted=false.
 */
export async function decryptIfPossible(
  supa: AnySB,
  workspaceId: string,
  storedContent: string
): Promise<{ plaintext: string; wasEncrypted: boolean }> {
  if (!storedContent?.startsWith(PREFIX)) {
    return { plaintext: storedContent ?? '', wasEncrypted: false };
  }
  const key = await getOrCreateKey(supa, workspaceId);
  const b64 = storedContent.slice(PREFIX.length);
  const payload = Buffer.from(b64, 'base64');

  if (payload.length < IV_BYTES + TAG_BYTES + 1) {
    // malformed, return raw to avoid data loss
    return { plaintext: storedContent, wasEncrypted: false };
  }

  const iv = payload.subarray(0, IV_BYTES);
  const tag = payload.subarray(payload.length - TAG_BYTES);
  const ct = payload.subarray(IV_BYTES, payload.length - TAG_BYTES);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return { plaintext: pt.toString('utf8'), wasEncrypted: true };
}
