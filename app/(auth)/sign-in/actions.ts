// app/(auth)/sign-in/actions.ts (client component or hook)
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function signInWithPassword(email: string, password: string) {
  const origin = window.location.origin;
  const { error } = await supabase.auth.signInWithPassword({
    email, password,
    options: { emailRedirectTo: `${origin}/auth?next=%2Fapp` }
  });
  if (error) throw error;
}

export async function signInWithPasskey() {
  const origin = window.location.origin;
  const { error } = await supabase.auth.signInWithPasskey({
    options: { emailRedirectTo: `${origin}/auth?next=%2Fapp` }
  });
  if (error) throw error;
}
