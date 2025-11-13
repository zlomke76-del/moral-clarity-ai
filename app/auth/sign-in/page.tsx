'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';

export default function SignInPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pull any ?err=... from the URL (e.g. from /auth/callback redirect)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const e = params.get('err');

    if (e) {
      // Normalize common Supabase PKCE error into something human-readable
      if (e.toLowerCase().includes('exchange_failed')) {
        setErr(
          'Sign-in link could not be verified. Please open the link on the same device where you requested it, or request a new link.'
        );
      } else if (
        e.toLowerCase().includes('code') &&
        e.toLowerCase().includes('verifier')
      ) {
        setErr(
          'We could not complete the secure login exchange. Please request a new sign-in link and open it on the same device.'
        );
      } else {
        setErr(e);
      }
    }
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();

      // Use NEXT_PUBLIC_SITE_URL if defined, otherwise fall back to the current origin.
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Supabase will send the magic link here (PKCE flow)
          // e.g. https://studio.moralclarity.ai/auth/callback?code=...&next=%2Fapp
          emailRedirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent(
            '/app'
          )}`,
        },
      });

      if (error) throw error;
      setEmailSent(true);
    } catch (e: any) {
      cons
