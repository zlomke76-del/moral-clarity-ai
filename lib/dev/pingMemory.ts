// lib/dev/pingMemory.ts
'use client';

/**
 * Dev stub for pinging the memory system.
 *
 * This used to call `createClient()` from `@/lib/supabase/client`,
 * but that module no longer exports that helper. To keep production
 * builds clean and avoid hard-wiring a second Supabase client, this
 * now acts as a no-op logging helper.
 *
 * If you want to re-enable real pings later, you can:
 *  - import your actual Supabase browser client here, or
 *  - call a dedicated `/api/dev/ping-memory` route instead.
 */
export async function pingMemory(note: string = 'hello from UI'): Promise<void> {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.debug('[pingMemory] stub invoked', { note });
  }
  // No-op: intentionally does nothing in production.
}
