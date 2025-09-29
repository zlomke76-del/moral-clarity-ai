import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
      <div className="max-w-2xl text-center p-10">
        <h1 className="text-4xl font-bold tracking-tight">Moral Clarity AI</h1>
        <h2 className="text-lg text-slate-600 mt-2">A compass that never drifts.</h2>
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
      </div>
    </div>
  )
}
