import React from 'react'
import { NavLink, Link } from 'react-router-dom'

const base = 'px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100'
const active = 'bg-slate-900 text-white hover:bg-slate-900'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-slate-900">Moral Clarity AI</Link>
          <nav className="flex items-center gap-1">
            {/* Anchors scroll to sections on the homepage */}
            <a href="/#problem" className={base}>Problem</a>
            <a href="/#updates" className={base}>Updates</a>

            {/* New Pricing link */}
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                isActive ? `${base} ${active}` : base
              }
            >
              Pricing
            </NavLink>

            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                isActive ? `${base} ${active}` : base
              }
            >
              Privacy
            </NavLink>

            <NavLink
              to="/terms"
              className={({ isActive }) =>
                isActive ? `${base} ${active}` : base
              }
            >
              Terms
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
