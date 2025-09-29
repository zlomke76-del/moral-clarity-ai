import React from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <main className="text-slate-900">
      <Header />

      {/* HERO */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto w-full text-center px-6">
          <h1 className="text-5xl font-extrabold tracking-tight">Moral Clarity AI</h1>
          <p className="mt-3 text-xl text-slate-600">A compass that never drifts.</p>
          <p className="mt-6 text-slate-700 leading-relaxed">
            In a world of spin and shifting narratives, we deliver answers anchored to enduring standards—clear,
            neutral, and unshakable.
          </p>

          <div className="mt-8 flex gap-4 justify-center">
            <a href="/#why" className="px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700">Why it matters</a>
            <a href="/#updates" className="px-5 py-3 border border-slate-900 rounded-xl hover:bg-slate-100">Get updates</a>
          </div>

          <ul className="mt-6 text-sm text-slate-500 flex gap-4 justify-center">
            <li>Neutral</li>
            <li>Anchored</li>
            <li>Red-teamed</li>
          </ul>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section id="why" className="border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Why it matters</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">
            We don’t lack information—we lack anchoring. Most systems don’t just present facts; they frame them.
            That framing quietly nudges outcomes:
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            <li className="rounded-lg border border-slate-200 p-4">
              <span className="font-semibold">Decision drift:</span> choices shift with the news cycle.
            </li>
            <li className="rounded-lg border border-slate-200 p-4">
              <span className="font-semibold">Trust erosion:</span> audiences sense bias and disengage.
            </li>
            <li className="rounded-lg border border-slate-200 p-4">
              <span className="font-semibold">Policy whiplash:</span> standards change faster than outcomes.
            </li>
            <li className="rounded-lg border border-slate-200 p-4">
              <span className="font-semibold">Compliance risk:</span> unseen assumptions slip into workflows.
            </li>
          </ul>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section id="what" className="border-t border-slate-200 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold">What we do</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">
            Moral Clarity AI delivers analysis and guidance that remain steady—grounded in enduring moral standards,
            stress-tested for bias, and communicated in plain language.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Clear</h3>
              <p className="text-sm text-slate-600 mt-1">No hidden spin. Claims, context, and caveats are explicit.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Consistent</h3>
              <p className="text-sm text-slate-600 mt-1">Answers align with stable standards across cases and time.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">Auditable</h3>
              <p className="text-sm text-slate-600 mt-1">Reasoning steps are reviewable; assumptions are documented.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-6">
              <div className="text-slate-400 text-sm">Step 1</div>
              <h3 className="font-semibold mt-1">Frame the question</h3>
              <p className="text-sm text-slate-600 mt-2">
                Extract the core claim, separate facts from interpretation, and identify affected stakeholders.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <div className="text-slate-400 text-sm">Step 2</div>
              <h3 className="font-semibold mt-1">Anchor to standards</h3>
              <p className="text-sm text-slate-600 mt-2">
                Apply enduring moral principles and relevant policy constraints to stabilize the analysis.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <div className="text-slate-400 text-sm">Step 3</div>
              <h3 className="font-semibold mt-1">Red-team and refine</h3>
              <p className="text-sm text-slate-600 mt-2">
                Stress-test for bias and blind spots; surface trade-offs and document residual uncertainty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section id="pillars" className="border-t border-slate-200 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Our pillars</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3 text-left">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Neutral</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Facts before narratives. Competing views presented fairly. No partisan defaults.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Anchored</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Guidance tethered to enduring moral standards to avoid drift and whiplash.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">Red-teamed</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Active bias checks and challenge prompts to expose weaknesses before decisions do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="border-t border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Where it helps</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold">Leaders & Policy</h3>
              <ul className="mt-2 text-sm text-slate-600 space-y-2">
                <li>Briefings that separate fact, value, and risk</li>
                <li>Scenario analyses with anchored trade-offs</li>
                <li>Consistent principles across changing events</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold">Educators</h3>
              <ul className="mt-2 text-sm text-slate-600 space-y-2">
                <li>Balanced summaries for contested topics</li>
                <li>Discussion guides with transparent assumptions</li>
                <li>Bias-aware prompts for critical thinking</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold">Enterprises</h3>
              <ul className="mt-2 text-sm text-slate-600 space-y-2">
                <li>Governance guardrails for AI-assisted work</li>
                <li>Policy-aligned recommendations with audit trail</li>
                <li>Training material that won’t drift with headlines</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-slate-200 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Frequently asked</h2>
          <div className="mt-8 grid gap-4">
            <div className="rounded-lg border border-slate-200 p-5 bg-white">
              <h3 className="font-semibold">Is this a political tool?</h3>
              <p className="text-slate-600 mt-2 text-sm">
                No. Our method prioritizes neutrality and explicit trade-offs. We disclose assumptions and present
                competing views so readers can evaluate claims themselves.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-5 bg-white">
              <h3 className="font-semibold">What does “anchored” mean in practice?</h3>
              <p className="text-slate-600 mt-2 text-sm">
                We align analysis to enduring moral standards and applicable policies, then keep that alignment
                consistent across similar cases to avoid drift.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-5 bg-white">
              <h3 className="font-semibold">How do you reduce bias?</h3>
              <p className="text-slate-600 mt-2 text-sm">
                We use structured framing, explicit counter-arguments, and challenge prompts (“red-team”) to
                surface blind spots before recommendations are delivered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPDATES */}
      <section id="updates" className="border-t border-slate-200 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Get updates</h2>
          <p className="mt-4 text-slate-600">
            Occasional releases and progress notes. No spam.
          </p>
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
