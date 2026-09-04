import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { ADMIN_EMAIL } from '../lib/constants'

/**
 * Client-side gate so the admin page/link doesn't even render for anyone
 * else — but this is UX only, not the real security boundary. Every
 * privileged action it triggers (grantGoldMembership, backfillTrialTiers)
 * re-checks the caller's email server-side (see functions/src/billing.ts),
 * so a tampered client can't actually do anything even if it got here.
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}
