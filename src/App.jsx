import React from 'react'

export default function App() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center p-10">
        <h1 className="text-5xl font-extrabold tracking-tight">Moral Clarity AI</h1>
        <p className="text-xl text-slate-600 mt-3">A compass that never drifts.</p>
        <p className="mt-6 text-slate-700 leading-relaxed">
          In a world of spin and shifting narratives, Moral Clarity AI delivers answers anchored to eternal
          standards—clear, neutral, and unshakable.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a href="#problem" className="px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700">
            Learn more
          </a>
          <a href="#updates" className="px-5 py-3 border border-slate-900 rounded-xl hover:bg-slate-100">
            Get updates
          </a>
        </div>
        <ul className="mt-6 text-sm text-slate-500 flex gap-4 justify-center">
          <li>Neutral</li>
          <li>Anchored</li>
          <li>Red-teamed</li>
        </ul>
      </section>

      {/* Problem */}
      <section id="problem" className="border-t border-slate-200 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold">The problem</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">
            We don’t lack information—we lack anchoring. Most systems don’t just present facts; they
            frame them. Trust erodes, drift increases, and decisions get nudged by hidden assumptions.
          </p>
        </div>
      </section>

      {/* Placeholder anchor so the “Get updates” link has a target later */}
      <section id="updates" className="py-8"></section>
    </main>
  )
}
