// app/(auth)/sign-in/actions.ts
'use client';

import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

const supabase = createSupabaseBrowser();

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // After password login, send them straight into the app
  window.location.assign('/app');
}

/**
 * Standard magic-link for any user (uses the current origin for redirect).
 * Uses implicit flow via the browser client and lands on /auth?next=/app.
 */
export async function sendMagicLink(email: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Supabase will redirect here after the user clicks the magic link
      // Example: https://studio.moralclarity.ai/auth?next=%2Fapp#access_token=...
      emailRedirectTo: `${origin}/auth?next=%2Fapp`,
    },
  });

  if (error) throw error;
}
