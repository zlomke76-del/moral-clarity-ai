'use client';

/**
 * Dev-only helper.
 *
 * Right now we keep this as a no-op so it never blocks production builds.
 * If you want to wire it to Supabase later, you can import your browser client
 * and call a test edge function from here.
 */
export async function pingMemory(note: string = 'hello from UI') {
  // Non-blocking stub: just log and return a simple object.
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[pingMemory] stub called with note:', note);
  }

  return {
    ok: true,
    note,
  };
}
