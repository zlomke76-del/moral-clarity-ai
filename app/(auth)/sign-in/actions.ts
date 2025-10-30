// app/(auth)/sign-in/actions.ts
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Navigate after session is set in the browser
  window.location.assign('/app');
}

export async function signInWithPasskey() {
  // Requires Passkeys enabled in Supabase Auth → Providers
  const { error } = await supabase.auth.signInWithPasskey();
  if (error) throw error;

  window.location.assign('/app');
}
