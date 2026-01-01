'use client';

import { supabase } from '@/lib/supabase/browser';

/**
 * Default storage bucket.
 * Ensure this bucket exists in Supabase Storage.
 * Make it public only if you need public URLs.
 */
const DEFAULT_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'attachments';

/**
 * Browser-side storage helper.
 * Uses the single authoritative browser Supabase client.
 */
export function bucket(name: string = DEFAULT_BUCKET) {
  const storage = supabase.storage.from(name);

  return {
    upload: storage.upload.bind(storage),
    getPublicUrl: storage.getPublicUrl.bind(storage),

    // Expose raw instance only if absolutely needed
    _raw: storage,
  };
}
