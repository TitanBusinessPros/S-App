import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useUserProfile } from '../lib/useUserProfile'
import './Shell.css'

export function Shell({ children }: { children: ReactNode }) {
  const { user, logOut } = useAuth()
  const { profile } = useUserProfile()

  return (
    <div className="shell">
      <div className="topo-overlay" />
      <header className="shell-topbar">
        <Link to="/app" className="shell-brand">
          <span className="shell-brand-mark">🧭</span>
          Survival Day
        </Link>

        <div className="shell-user">
          <span className={`badge ${profile?.tier === 'premium' ? 'badge-premium' : ''}`}>
            {profile?.tier === 'premium' ? 'Premium' : 'Free'}
          </span>
          {user?.photoURL && (
            <img className="shell-avatar" src={user.photoURL} alt={user.displayName ?? 'Account'} />
          )}
          <button type="button" className="btn shell-signout" onClick={logOut}>
            Sign out
          </button>
        </div>
      </header>

      <main className="shell-main">{children}</main>
    </div>
  )
}
