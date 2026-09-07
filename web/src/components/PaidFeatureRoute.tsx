import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useEntitlement } from '../lib/entitlement'

/**
 * Gates a route behind an active trial or subscription (see
 * lib/entitlement.ts's hasAccess) once the 3-day trial ends. Nested inside
 * ProtectedRoute in App.tsx -- auth is already confirmed by the time this
 * runs -- same nesting pattern as AdminRoute.
 *
 * Compass and First Aid deliberately don't use this; they stay free even
 * after the trial (see Dashboard.tsx's ALWAYS_FREE_ROUTES and App.tsx's
 * route list). Redirects to /app/upgrade -- the pricing page -- rather than
 * rendering, so a locked route is never reachable by direct URL/bookmark
 * either, not just hidden from the Dashboard's card links.
 *
 * Like AdminRoute, this is the UX gate, not a claim that every locked
 * page's content is protected server-side -- most of it is static
 * reference content bundled into the client, same as it always was.
 */
export function PaidFeatureRoute({ children }: { children: ReactNode }) {
  const { loading, hasAccess } = useEntitlement()

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <p className="mono">Loading…</p>
      </div>
    )
  }

  if (!hasAccess) {
    return <Navigate to="/app/upgrade" replace />
  }

  return <>{children}</>
}
