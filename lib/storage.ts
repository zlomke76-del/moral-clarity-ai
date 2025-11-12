'use client';

import { getSupabaseBrowser } from '@/lib/supabaseBrowser';

const DEFAULT_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET ||
  'attachments'; // ensure this bucket exists and is public if you need public URLs

export function bucket(name: string = DEFAULT_BUCKET) {
  const supabase = getSupabaseBrowser();
  const storage = supabase.storage.from(name);

  return {
    upload: storage.upload.bind(storage),
    getPublicUrl: storage.getPublicUrl.bind(storage),
    // expose the raw instance if needed:
    _raw: storage,
  };
}
