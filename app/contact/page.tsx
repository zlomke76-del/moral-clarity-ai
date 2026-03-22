"use client";

import { FormEvent, useEffect, useState } from "react";

export default function Page() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const [isInstitutional, setIsInstitutional] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsInstitutional(params.get("type") === "institutional");
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      context: isInstitutional ? "institutional" : "general",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-black text-zinc-200 px-6 py-24">
      <section className="mx-auto w-full max-w-2xl space-y-12">

        {/* HERO */}
        <header className="space-y-4">
          <p className="text-xs tracking-widest text-zinc-500">
            CONTACT · STEWARDSHIP CHANNEL
          </p>

          <h1 className="text-3xl font-serif tracking-tight">
            {isInstitutional
              ? "Institutional & Governance Inquiry"
              : "Contact — Moral Clarity AI"}
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
            This channel connects directly to the Moral Clarity stewardship team.
            Submissions are reviewed by humans and evaluated in context.
          </p>
        </header>

        <hr className="border-zinc-700/60" />

        {/* INTENT FRAMING */}
        <section className="space-y-2 text-sm leading-relaxed">
          <p className="text-zinc-300">
            Use this channel when the interaction matters—
            governance, institutional use, sponsorship, or system-level questions.
          </p>
        </section>

        {/* INSTITUTIONAL BLOCK */}
        {isInstitutional && (
          <section className="space-y-2 text-sm leading-relaxed border border-white/10 p-4 rounded-lg">
            <p className="text-zinc-200 font-medium">
              Institutional access is not self-serve.
            </p>
            <p className="text-zinc-400">
              Requests involving regulated, public-facing, or execution-bound use
              are reviewed prior to any deployment discussion.
              Submission does not imply approval or access.
            </p>
          </section>
        )}

        {/* EMAIL */}
        <p className="text-sm text-zinc-400">
          Direct correspondence:{" "}
          <a
            href="mailto:support@moralclarity.ai"
            className="text-blue-400 hover:underline"
          >
            support@moralclarity.ai
          </a>
        </p>

        <hr className="border-zinc-700/60" />

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="space-y-6">

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-500">
                Name
              </label>
              <input
                name="name"
                required
                placeholder="Full name"
                className="w-full bg-black border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-500">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@organization.com"
                className="w-full bg-black border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-zinc-500">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={6}
                placeholder={
                  isInstitutional
                    ? "Describe your organization, intended use, and governance context."
                    : "What do you need to understand, evaluate, or move forward?"
                }
                className="w-full bg-black border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
              />
            </div>

          </section>

          <hr className="border-zinc-700/60" />

          {/* SUBMIT */}
          <section className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="border border-zinc-500 px-4 py-2 text-sm hover:border-zinc-300 transition disabled:opacity-60"
            >
              {status === "sending"
                ? "Submitting…"
                : isInstitutional
                ? "Submit for review"
                : "Send message"}
            </button>

            {status === "sent" && (
              <span className="text-sm text-green-400">
                Submission received.
              </span>
            )}

            {status === "error" && (
              <span className="text-sm text-red-400">
                Submission failed.
              </span>
            )}
          </section>
        </form>

        {/* FOOTER */}
        <p className="text-xs text-zinc-500 leading-relaxed">
          This channel is appropriate for governance questions, institutional
          correspondence, sponsorship discussions, and regulated-use inquiries.
        </p>

      </section>
    </main>
  );
}
