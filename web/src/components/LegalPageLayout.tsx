import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from './Footer'
import './LegalPageLayout.css'

/**
 * Shared shell for standalone public legal pages (Terms, Privacy). Not
 * <Shell> — that assumes a signed-in user (sign-out button, tier badge).
 * These need to be readable by anyone, signed in or not.
 */
export function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <div className="legal-page">
      <header className="legal-topbar">
        <Link to="/" className="legal-brand">
          <span className="legal-brand-mark">🧭</span>
          Survival Day
        </Link>
      </header>

      <main className="legal-main">
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        {children}
      </main>

      <Footer />
    </div>
  )
}
