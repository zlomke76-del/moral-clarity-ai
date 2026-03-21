"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { KeyRound, Mail, Sparkles, ShieldCheck } from "lucide-react";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function sendLink() {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError(null);
    setSending(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="grid h-screen min-h-0 w-screen grid-cols-[260px_minmax(0,1fr)] overflow-hidden bg-transparent text-white">
      <aside className="h-full overflow-y-auto border-r border-white/8 bg-neutral-950/70 backdrop-blur-xl">
        <NeuralSidebar />
      </aside>

      <section className="relative flex min-h-0 h-full w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_26%),radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.07),transparent_24%),linear-gradient(180deg,rgba(4,10,24,0.96)_0%,rgba(3,8,20,0.99)_100%)]" />

        <div className="relative z-10 flex w-full items-center justify-center px-8 py-10">
          <div className="w-full max-w-5xl">
            <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col justify-center">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  Secure Access
                </div>

                <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Sign in to Moral Clarity AI
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
                  Access Studio tools, workspace memory, and secure system
                  functions through a private magic link.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/80">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white/88">
                          Private entry
                        </div>
                        <div className="mt-1 text-xs leading-5 text-white/45">
                          No password to remember. Access is delivered to your
                          inbox.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/80">
                        <KeyRound className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white/88">
                          Magic link flow
                        </div>
                        <div className="mt-1 text-xs leading-5 text-white/45">
                          Fast sign-in designed for a clean, low-friction
                          workspace handoff.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.08),transparent_24%)]" />

                <div className="relative z-10 p-7 sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_10px_30px_rgba(250,204,21,0.15)]">
                      <KeyRound className="h-5 w-5 text-neutral-950" />
                    </div>

                    <div>
                      <div className="text-lg font-semibold tracking-tight text-white">
                        Studio Sign-In
                      </div>
                      <div className="mt-1 text-sm text-white/45">
                        Continue with your email address
                      </div>
                    </div>
                  </div>

                  {sent ? (
                    <div className="rounded-2xl border border-emerald-400/18 bg-emerald-400/8 p-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                          <Mail className="h-5 w-5 text-emerald-300" />
                        </div>

                        <div>
                          <h2 className="text-base font-semibold text-white">
                            Check your email
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-white/65">
                            We sent a secure sign-in link to{" "}
                            <span className="font-medium text-white/90">
                              {email}
                            </span>
                            . Open the message and follow the link to continue.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-white/75"
                        >
                          Email address
                        </label>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
                          <Mail className="h-5 w-5 shrink-0 text-white/45" />
                          <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") void sendLink();
                            }}
                            className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/30"
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <button
                        onClick={sendLink}
                        disabled={sending}
                        className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-amber-300/30 bg-[linear-gradient(180deg,rgba(255,215,0,0.95),rgba(255,200,0,0.85))] px-5 text-sm font-semibold text-neutral-950 shadow-[0_12px_28px_rgba(255,215,0,0.16),inset_0_1px_0_rgba(255,255,255,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                      >
                        {sending ? "Sending…" : "Send Magic Link"}
                      </button>

                      <p className="text-xs leading-5 text-white/42">
                        By continuing, you’ll receive a secure link for this
                        browser session.
                      </p>

                      {error && (
                        <div className="rounded-2xl border border-rose-400/18 bg-rose-400/10 px-4 py-3 text-sm text-rose-100/90">
                          {error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
