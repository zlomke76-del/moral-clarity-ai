import React, { useState } from 'react'

export default function App() {
  // form state for inline thank-you message
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errMsg, setErrMsg] = useState('')

  async function handleSubscribe(e) {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')

    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/mblzgvdb', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        const d = await res.json().catch(() => ({}))
        setErrMsg(d?.errors?.[0]?.message || 'Something went wrong.')
        setStatus('error')
      }
    } catch (err) {
      setErrMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <main className="text-slate-900">
      {/* HERO — fills the whole viewport */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-3xl mx-auto w-full text-center px-6">
          <h1 className="text-5xl font-extrabold tracking-tight">Moral Clarity AI</h1>
          <p className="mt-3 text-xl text-slate-600">A compass that never drifts.</p>
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
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="border-t border-slate-200 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold">The problem</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">
            We don’t lack information—we lack anchoring. Most systems don’t just present facts; they frame them.
            Trust erodes, drift increases, and decisions get nudged by hidden assumptions.
          </p>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="border-t border-slate-200 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">The solution</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Moral Clarity AI applies three guardrails that keep every answer steady, balanced, and trustworthy.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold">Neutral</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Facts first, no partisan defaults, no hidden spin. Answers are clear, not slanted.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold">Anchored</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Every response is tethered to enduring moral standards—unchanging, consistent, reliable.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold">Red-teamed</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Answers are stress-tested against biases and blind spots to make sure clarity holds under pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPDATES — newsletter signup with inline success message */}
      <section id="updates" className="border-t border-slate-200 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Get updates</h2>
          <p className="mt-4 text-slate-600">
            Subscribe to be the first to know when we release major updates, features, or insights.
          </p>

          {status === 'success' ? (
            <div
              className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-800"
              role="status"
              aria-live="polite"
            >
              ✅ Thanks! You’re on the list. Check your inbox for a confirmation.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input type="text" name="_gotcha" className="hidden" tabIndex="-1" autoComplete="off" />
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="px-4 py-3 border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:opacity-60"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-sm text-red-600" role="alert" aria-live="assertive">
              {errMsg}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
