"use client";

import { useState } from "react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function sendMagicLink() {
    if (!email) return;
    setStatus("sending");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (!error) setStatus("sent");
    else setStatus("idle");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#05070A] text-white px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-[#0A0D12] border border-[#1a1f27] shadow-xl p-10 flex flex-col items-center">
        
        {/* Magic Key Graphic */}
        <div className="mb-6">
          <Image
            src="/Magic key.png"
            alt="Magic Key"
            width={90}
            height={90}
            className="opacity-90 drop-shadow-lg"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Sign in
        </h1>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Enter your email to receive a secure magic link.
        </p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full px-4 py-3 rounded-lg
            bg-[#0F141B] border border-[#20262f]
            focus:border-blue-500 focus:outline-none
            text-sm
          "
        />

        {/* Button */}
        <button
          onClick={sendMagicLink}
          disabled={status === "sending"}
          className={`
            w-full mt-4 py-3 rounded-lg text-sm font-medium
            text-white
            ${status === "sending"
              ? "bg-blue-700 opacity-60 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 cursor-pointer"}
          `}
        >
          {status === "sent"
            ? "Magic Link Sent ✓"
            : status === "sending"
            ? "Sending…"
            : "Send magic link"}
        </button>

        {/* Footer message */}
        {status === "sent" && (
          <p className="text-green-400 text-xs mt-4 text-center">
            Check your inbox — your secure sign-in link is on its way.
          </p>
        )}
      </div>
    </div>
  );
}


