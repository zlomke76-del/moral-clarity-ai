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
    <section className="flex justify-center py-24 px-4">
      <div className="w-full max-w-2xl space-y-8 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-10 backdrop-blur">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isInstitutional
              ? "Institutional & Governance Inquiry"
              : "Contact Moral Clarity AI"}
          </h1>

          <p className="text-sm text-zinc-400 max-w-prose">
            This channel reaches the Moral Clarity stewardship team directly.
            Messages submitted here are reviewed by humans.
          </p>
        </header>

        {/* Institutional framing */}
        {isInstitutional && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-300">
            <p className="mb-2 font-medium">
              Institutional access is not self-serve.
            </p>
            <p>
              Requests involving regulated, public-facing, or
              execution-bound use are reviewed prior to any deployment
              discussion. Submission of this form does not grant access
              or approval.
            </p>
          </div>
        )}

        {/* Contact alternative */}
        <p className="text-sm text-zinc-400">
          Prefer email? Reach us at{" "}
          <a
            className="text-blue-400 hover:underline"
            href="mailto:support@moralclarity.ai"
          >
            support@moralclarity.ai
          </a>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Name
            </label>
            <input
              name="name"
              required
              placeholder="Your full name"
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@organization.com"
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={6}
              placeholder={
                isInstitutional
                  ? "Describe your organization, intended use, and governance context."
                  : "How can we help?"
              }
              className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium transition disabled:opacity-60 hover:bg-blue-500"
          >
            {status === "sending"
              ? "Submitting…"
              : isInstitutional
              ? "Submit inquiry for review"
              : "Send message"}
          </button>

          {status === "sent" && (
            <p className="text-sm text-green-400">
              Inquiry received. A member of the stewardship team will
              respond.
            </p>
          )}

          {status === "error" && (
            <p className="text-sm text-red-400">
              Something went wrong. Please try again or email us directly.
            </p>
          )}
        </form>

        {/* Footer note */}
        <p className="text-xs text-zinc-500">
          Appropriate for governance questions, institutional correspondence,
          sponsorship inquiries, and regulated-use discussions.
        </p>
      </div>
    </section>
  );
}
