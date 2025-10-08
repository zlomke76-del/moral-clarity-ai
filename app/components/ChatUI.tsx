"use client";

import { useEffect, useState } from "react";
// NOTE: relative import (no @ alias required)
import { supabase } from "../../lib/supabaseClient";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [canWrite, setCanWrite] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setEmail((data.user?.email as string | undefined) ?? null);
    });
    (async () => {
      const uid = (await supabase.auth.getUser()).data.user?.id ?? null;
      if (!uid) return;
      const { data } = await supabase.rpc("can_add_memory", { uid });
      if (typeof data === "boolean") setCanWrite(data);
    })();
  }, []);

  async function onSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const json = await res.json();
      const output = json?.reply ?? "(no reply)";
      setMessages((m) => [...m, { role: "assistant", content: output }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Error: ${e?.message ?? e}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function startCheckout() {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, seats: 1 }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert("Checkout failed to start.");
    } catch (e) {
      alert("Checkout error");
    }
  }

  async function signInWithMagicLink() {
    const emailToUse =
      email ?? prompt("Enter your email for magic-link sign-in") ?? "";
    if (!emailToUse) return;
    const { error } = await supabase.auth.signInWithOtp({ email: emailToUse });
    if (error) alert(error.message);
    else alert("Check your inbox for the sign-in link.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUserId(null);
    setEmail(null);
  }

  return (
    <div className="mx-auto max-w-4xl w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Moral Clarity AI — Bridge</h1>
        <div className="flex gap-3">
          {!userId ? (
            <button
              className="rounded bg-black text-white px-3 py-2"
              onClick={signInWithMagicLink}
            >
              Sign in
            </button>
          ) : (
            <>
              <span className="text-sm text-gray-400">{email}</span>
              <button className="rounded border px-3 py-2" onClick={signOut}>
                Sign out
              </button>
            </>
          )}
          <button
            className="rounded bg-indigo-600 text-white px-3 py-2"
            onClick={startCheckout}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      <div className="border rounded p-4 h-[50vh] overflow-auto bg-white text-black">
        {messages.length === 0 ? (
          <div className="text-gray-500">Ask anything to get started…</div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`my-2 ${m.role === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-3 py-2 rounded ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {m.content}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          disabled={loading || !canWrite}
          placeholder={
            canWrite ? "Type your message…" : "Free limit reached. Upgrade to continue."
          }
          className="flex-1 border rounded px-3 py-2 text-black"
        />
        <button
          onClick={onSend}
          disabled={loading || !canWrite}
          className="rounded bg-black text-white px-4 py-2"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
