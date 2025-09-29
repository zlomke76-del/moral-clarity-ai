import React, { useState, useMemo } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

const CATEGORIES = ["Leaders & Policy", "Educators", "Enterprises"];

export default function App() {
  const [cat, setCat] = useState("Leaders & Policy");

  // --- WHY IT MATTERS (expandable) ---
  const whyItems = useMemo(
    () => [
      {
        title: "Decision drift",
        summary: "Choices shift with the news cycle.",
        details: (
          <>
            <p>
              <strong>Example:</strong> During major events, expressed support for
              policies can swing week-to-week. Decisions made in the storm tend to be
              reactive—not strategic.
            </p>
            <p className="mt-2">
              <strong>Why it matters:</strong> Drift compounds across teams and
              months, eroding long-term plans.
            </p>
          </>
        ),
      },
      {
        title: "Trust erosion",
        summary: "Audiences sense bias and disengage.",
        details: (
          <>
            <p>
              <strong>Signal:</strong> When people detect framing, they discount the
              message—regardless of truth.
            </p>
            <p className="mt-2">
              <strong>Outcome:</strong> Neutral anchoring sustains attention and
              increases perceived credibility.
            </p>
          </>
        ),
      },
      {
        title: "Policy whiplash",
        summary: "Standards change faster than outcomes.",
        details: (
          <>
            <p>
              <strong>Cost:</strong> Rapid shifts confuse stakeholders and undermine
              compliance.
            </p>
            <p className="mt-2">
              <strong>Fix:</strong> Anchor changes to evidence windows, not
              headlines.
            </p>
          </>
        ),
      },
      {
        title: "Compliance risk",
        summary: "Unseen assumptions slip into workflows.",
        details: (
          <>
            <p>
              <strong>Risk:</strong> Hidden framing can embed bias into official
              processes.
            </p>
            <p className="mt-2">
              <strong>Remedy:</strong> Make assumptions explicit and review them like
              any other control.
            </p>
          </>
        ),
      },
    ],
    []
  );

  const [openWhy, setOpenWhy] = useState(null);
  const toggleWhy = (i) => setOpenWhy((prev) => (prev === i ? null : i));

  // --- CATEGORIES ---
  const useCases = useMemo(
    () => ({
      "Leaders & Policy": [
        "Briefings that separate fact, value, and risk",
        "Scenario analyses with anchored trade-offs",
        "Consistent principles across changing events",
      ],
      Educators: [
        "Balanced summaries for contested topics",
        "Discussion guides with transparent assumptions",
        "Bias-aware prompts for critical thinking",
      ],
      Enterprises: [
        "Governance guardrails for AI-assisted work",
        "Policy-aligned recommendations with audit trail",
        "Training that won’t drift with headlines",
      ],
    }),
    []
  );

  const faqs = useMemo(
    () => ({
      "Leaders & Policy": [
        {
          q: "Will this lock us into one worldview?",
          a: "No. We anchor to enduring moral standards and show competing views with explicit trade-offs so leaders can justify choices transparently.",
        },
        {
          q: "How do we handle fast-moving events?",
          a: "We stabilize on core principles first, then update facts and scenarios while preserving consistent reasoning across cases.",
        },
      ],
      Educators: [
        {
          q: "Is this partisan?",
          a: "No. We present claims neutrally, surface assumptions, and encourage critical comparison of perspectives.",
        },
        {
          q: "Can students see the reasoning?",
          a: "Yes. We expose steps, cite assumptions, and include red-team prompts to challenge conclusions.",
        },
      ],
      Enterprises: [
        {
          q: "How does this fit governance?",
          a: "We provide principle-tethered guidance with an audit trail, making policy alignment and review straightforward.",
        },
        {
          q: "What about bias and risk?",
          a: "We run challenge prompts (red-team) against outputs and document residual uncertainty before recommendations land in workflows.",
        },
      ],
    }),
    []
  );

  return (
    <main className="text-slate-900">
      <Header />

      {/* HERO */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto w-full text-center px-6">
          <h1 className="text-5xl font-extrabold tracking-tight">Moral Clarity AI</h1>
          <p className="mt-3 text-xl text-slate-600">A compass that never drifts.</p>
          <p className="mt-6 text-slate-700 leading-relaxed">
            In a world of spin and shifting narratives, we deliver answers anchored to enduring
            standards—clear, neutral, and unshakable.
          </p>

          <div className="mt-8 flex gap-4 justify-center">
            <a
              href="/#why"
              className="px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700"
            >
              Why it matters
            </a>
            <a
              href="/#choose"
              className="px-5 py-3 border border-slate-900 rounded-xl hover:bg-slate-100"
            >
              Choose your path
            </a>
          </div>

          <ul className="mt-6 text-sm text-slate-500 flex gap-4 justify-center">
            <li>Neutral</li>
            <li>Anchored</li>
            <li>Red-teamed</li>
          </ul>
        </div>
      </section>

      {/* WHY IT MATTERS (interactive) */}
      <section id="why" className="border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Why it matters</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">
            We don’t lack information—we lack anchoring. Most systems don’t just present facts; they
            frame them. That framing quietly nudges outcomes:
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {whyItems.map((item, i) => {
              const open = openWhy === i;
              return (
                <button
                  key={item.title}
                  onClick={() => toggleWhy(i)}
                  aria-expanded={open}
                  className={
                    "text-left rounded-lg border border-slate-200 p-4 bg-white transition shadow-sm " +
                    "focus:outline-none focus:ring-2 focus:ring-slate-500"
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{item.title}:</div>
                      <div className="text-slate-700">{item.summary}</div>
                    </div>
                    <span className="select-none text-slate-600 text-xl leading-none">
                      {open ? "–" : "+"}
                    </span>
                  </div>

                  {open && (
                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      {item.details}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR PATH (Categories) */}
      <section id="choose" className="border-t border-slate-200 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">Choose your path</h2>
          <p className="mt-3 text-center text-slate-600">
            Pick a category to see tailored use cases and answers.
          </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={
                  "px-4 py-2 rounded-full border text-sm transition " +
                  (cat === c
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO (constant) */}
      <section id="what" className="border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold">What we do</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">
            Moral Clarity AI delivers analysis and guidance that remain steady—grounded in
            enduring moral standards, stress-tested for bias, and communicated in plain language.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Clear</h3>
              <p className="text-sm text-slate-600 mt-1">
                No hidden spin. Claims, context, and caveats are explicit.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Consistent</h3>
              <p className="text-sm text-slate-600 mt-1">
                Aligned to stable standards across cases and time.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Auditable</h3>
              <p className="text-sm text-slate-600 mt-1">
                Reasoning steps are reviewable; assumptions documented.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS (constant) */}
      <section id="pillars" className="border-t border-slate-200 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Our pillars</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3 text-left">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Neutral</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Facts before narratives. Fair presentation of competing views.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Anchored</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Tethered to enduring moral standards to prevent drift.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Red-teamed</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Bias checks and challenge prompts to expose blind spots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES (filtered by category) */}
      <section id="use-cases" className="border-t border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Where it helps — {cat}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {useCases[cat].map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm">
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (filtered by category) */}
      <section id="faq" className="border-t border-slate-200 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Frequently asked — {cat}</h2>
          <div className="mt-8 grid gap-4">
            {faqs[cat].map(({ q, a }, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-5 bg-white shadow-sm">
                <h3 className="font-semibold">{q}</h3>
                <p className="text-slate-600 mt-2 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPDATES */}
      <section id="updates" className="border-t border-slate-200 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Get updates</h2>
          <p className="mt-4 text-slate-600">Occasional releases and progress notes. No spam.</p>
          <form
            action="https://formspree.io/f/mblzgvdb"
            method="POST"
            className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@domain.com"
              className="px-4 py-3 border border-slate-300 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
