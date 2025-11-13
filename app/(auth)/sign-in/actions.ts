// app/(auth)/sign-in/actions.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // After password login, send them straight into the app
  window.location.assign('/app');
}

/**
 * Standard magic-link for any user (uses the current origin for redirect)
 * IMPORTANT: send magic links directly to /app, not through /auth or /auth/callback
 */
export async function sendMagicLink(email: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // ⬅️ key change: no /auth, no callback, no ?next layer
      emailRedirectTo: `${origin}/app`,
    },
  });

  if (error) throw error;
}
