import React from 'react'
import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        We respect your privacy. Email addresses submitted via our update form are used solely to send
        you information about Moral Clarity AI. We do not sell or share your personal data with third
        parties without your consent, except as required by law.
      </p>

      <p className="mb-4">
        You may unsubscribe from updates at any time using the link in our emails, or by contacting us at{" "}
        <a href="mailto:hello@moralclarityai.com" className="underline text-slate-900">
          hello@moralclarityai.com
        </a>.
      </p>

      <p className="mb-10">Last updated: {new Date().toLocaleDateString()}</p>

      <Link
        to="/"
        className="inline-block rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
      >
        ← Back to Home
      </Link>
    </main>
  )
}
