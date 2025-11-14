// lib/uploads/client.ts
'use client';

import { bucket } from '@/lib/storage';
import type { UploadAttachment, UploadError, UploadResult } from './types';

const DEFAULT_BUCKET = 'attachments';

function getBucket() {
  // If you ever want per-workspace buckets, change it here only.
  return bucket(DEFAULT_BUCKET);
}

/**
 * Core uploader for File / Blob inputs.
 * This is the only place that talks to Supabase storage on the client.
 */
export async function uploadFiles(
  files: FileList | File[] | Blob[],
  opts?: { prefix?: string }
): Promise<UploadResult> {
  const b = getBucket();
  const arr = Array.from(files as any as File[]);
  const prefix = (opts?.prefix || 'uploads') + '/';

  const attachments: UploadAttachment[] = [];
  const errors: UploadError[] = [];

  for (const f of arr) {
    try {
      const fileName = f instanceof File ? f.name || 'pasted-image.png' : 'blob.bin';
      const safeName = encodeURIComponent(fileName.replace(/\s+/g, '_'));
      const path = `${prefix}${crypto.randomUUID()}_${safeName}`;

      const { error } = await b.upload(path, f as any, {
        upsert: false,
        cacheControl: '3600',
        contentType: (f as any).type || 'application/octet-stream',
      });
      if (error) throw error;

      const { data } = b.getPublicUrl(path);

      attachments.push({
        name: fileName,
        url: data.publicUrl,
        type: (f as any).type || 'application/octet-stream',
        size: (f as any).size ?? undefined,
      });
    } catch (e: any) {
      errors.push({
        fileName: (f as any).name || 'blob',
        message: e?.message || String(e),
      });
    }
  }

  return { attachments, errors };
}

/**
 * Convenience helper for <input type="file" /> onChange.
 */
export async function uploadFromInput(
  fileList: FileList | null,
  opts?: { prefix?: string }
): Promise<UploadResult> {
  if (!fileList || fileList.length === 0) {
    return { attachments: [], errors: [] };
  }
  return uploadFiles(fileList, opts);
}

/**
 * Paste handler: call from onPaste of your composer.
 * Automatically detects images/files in the clipboard and uploads them.
 */
export async function uploadFromPasteEvent(
  e: ClipboardEvent,
  opts?: { prefix?: string }
): Promise<UploadResult> {
  const items = e.clipboardData?.items;
  if (!items || !items.length) return { attachments: [], errors: [] };

  const blobs: File[] = [];
  for (const item of Array.from(items)) {
    if (item.kind === 'file') {
      const f = item.getAsFile();
      if (f) blobs.push(f);
    }
  }
  if (!blobs.length) return { attachments: [], errors: [] };

  return uploadFiles(blobs, opts);
}
