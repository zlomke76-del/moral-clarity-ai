import React from 'react'
import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        By using this site, you agree that Moral Clarity AI is provided “as is” without warranties of
        any kind, express or implied. We make no guarantees regarding accuracy, completeness, or
        suitability of any content for a particular purpose.
      </p>

      <p className="mb-4">
        You agree not to misuse the site, attempt to disrupt its operation, or access data you are not
        authorized to access. We may update these terms from time to time; your continued use of the site
        constitutes acceptance of the updated terms.
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
