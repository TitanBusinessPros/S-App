import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useEntitlement } from '../lib/entitlement'
import { useInstallPrompt } from '../lib/useInstallPrompt'
import { ADMIN_EMAIL } from '../lib/constants'
import './Shell.css'

const TIER_LABEL: Record<string, string> = {
  gold: 'Gold',
  premium: 'Premium',
  trial: 'Trial',
  free: 'Free',
}

export function Shell({ children }: { children: ReactNode }) {
  const { user, logOut } = useAuth()
  const { tier, isTrialing, trialDaysLeft } = useEntitlement()
  const { canInstall, promptInstall } = useInstallPrompt()
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL

  const isPaidTier = tier === 'gold' || tier === 'premium'

  return (
    <div className="shell">
      <div className="topo-overlay" />
      <header className="shell-topbar">
        <Link to="/app" className="shell-brand">
          <span className="shell-brand-mark">🧭</span>
          Survival Day
        </Link>

        <div className="shell-user">
          <Link to="/app/upgrade" className={`badge shell-tier-badge ${isPaidTier ? 'badge-premium' : ''}`}>
            {tier ? TIER_LABEL[tier] : 'Free'}
            {isTrialing && trialDaysLeft !== null ? ` · ${trialDaysLeft}d` : ''}
          </Link>
          {isAdmin && (
            <Link to="/app/admin" className="btn shell-admin-link">
              🛠️ Admin
            </Link>
          )}
          {canInstall && (
            <button type="button" className="btn btn-primary shell-install" onClick={promptInstall}>
              📲 Install app
            </button>
          )}
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
