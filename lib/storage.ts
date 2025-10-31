// /lib/storage.ts
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export const UPLOAD_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_UPLOAD_BUCKET || "uploads";

export function bucket() {
  const sb = createSupabaseBrowser();
  return sb.storage.from(UPLOAD_BUCKET);
}

export async function uploadBlob(
  key: string,
  file: Blob,
  contentType?: string
) {
  const b = bucket();
  const { error } = await b.upload(key, file, {
    upsert: false,
    contentType: contentType || "application/octet-stream",
  });
  if (error) throw error;
  const { data } = b.getPublicUrl(key);
  return data.publicUrl;
}
