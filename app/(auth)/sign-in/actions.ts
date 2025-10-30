// app/(auth)/sign-in/actions.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  window.location.assign('/app');
}

/** Standard magic-link for any user (uses the current origin for redirect) */
export async function sendMagicLink(email: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth?next=%2Fapp` },
  });
  if (error) throw error;
}
