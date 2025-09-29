import React from 'react'
import { NavLink, Link } from 'react-router-dom'

const linkBase =
  'px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 text-slate-700'
const active =
  'bg-slate-900 text-white hover:bg-slate-900'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="font-bold text-slate-900">
            Moral Clarity AI
          </Link>

          <nav className="flex items-center gap-1">
            {/* In-page anchors on the home page */}
            <a href="/#problem" className={linkBase}>Problem</a>
            <a href="/#updates" className={linkBase}>Updates</a>

            {/* Router pages */}
            <NavLink
              to="/privacy"
              className={({ isActive }) => isActive ? `${linkBase} ${active}` : linkBase}
            >
              Privacy
            </NavLink>
            <NavLink
              to="/terms"
              className={({ isActive }) => isActive ? `${linkBase} ${active}` : linkBase}
            >
              Terms
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
