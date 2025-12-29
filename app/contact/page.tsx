"use client";

import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Contact</h1>

      <p className="text-zinc-400">
        Email:{" "}
        <a className="text-blue-400" href="mailto:support@moralclarity.ai">
          support@moralclarity.ai
        </a>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Your name"
          required
          className="w-full rounded-md bg-zinc-900 border border-zinc-700 p-2 text-white"
        />

        <input
          name="email"
          type="email"
          placeholder="Your email"
          required
          className="w-full rounded-md bg-zinc-900 border border-zinc-700 p-2 text-white"
        />

        <textarea
          name="message"
          placeholder="Your message"
          required
          rows={5}
          className="w-full rounded-md bg-zinc-900 border border-zinc-700 p-2 text-white"
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        {status === "sent" && (
          <p className="text-green-400">Message sent. We’ll be in touch.</p>
        )}

        {status === "error" && (
          <p className="text-red-400">
            Something went wrong. Please email us directly.
          </p>
        )}
      </form>

      <p className="text-zinc-400 text-sm">
        We typically reply within 1–2 business days.
      </p>
    </section>
  );
}
