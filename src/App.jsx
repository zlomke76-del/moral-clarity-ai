import React from 'react'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <main className="text-slate-900">
      {/* HERO */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto w-full text-center px-6">
          <h1 className="text-5xl font-extrabold tracking-tight">Moral Clarity AI</h1>
          <p className="mt-3 text-xl text-slate-600">A compass that never drifts.</p>
          <p className="mt-6 text-slate-700 leading-relaxed">
            In a world of spin and shifting narratives, Moral Clarity AI delivers answers anchored to
            eternal standards — clear, neutral, and unshakable.
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
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="border-t border-slate-200 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold">The problem</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">
            We don’t lack information — we lack anchoring. Most systems don’t just present facts; they frame
            them. Trust erodes, drift increases, and decisions get nudged by hidden assumptions.
          </p>
        </div>
      </section>

      {/* UPDATES placeholder */}
      <section id="updates" className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Stay updated</h2>
          <form
            action="https://formspree.io/f/mblzgvdb"
            method="POST"
            className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="px-4 py-3 border border-slate-300 rounded-lg w-full sm:w-80"
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

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <p>
          © {new Date().getFullYear()} Moral Clarity AI ·{' '}
          <Link to="/privacy" className="hover:underline">Privacy</Link> ·{' '}
          <Link to="/terms" className="hover:underline">Terms</Link>
        </p>
      </footer>
    </main>
  )
}
