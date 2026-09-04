import { useUserProfile } from './useUserProfile'
import type { UserProfile } from './useUserProfile'

export interface Entitlement {
  /** True once we know the real answer (profile loaded) — see useEntitlement. */
  loading: boolean
  /** Full access to everything: an active trial, a paid subscription, or gold. */
  hasAccess: boolean
  isTrialing: boolean
  /** Whole days left in the trial, floored, never negative. Null outside a trial. */
  trialDaysLeft: number | null
  tier: UserProfile['tier'] | null
}

/**
 * Pure so it's trivial to unit test — no server call needed. Trial expiry
 * is decided here, client-side, by comparing trialEndsAt against "now"
 * rather than by any server-side job flipping the tier field. That's a
 * deliberate simplification (see createUserProfile's doc comment): nothing
 * has to run when a trial ends, so there's nothing to fail to run.
 */
export function computeEntitlement(profile: UserProfile | null, now: number = Date.now()): Entitlement {
  if (!profile) {
    return { loading: true, hasAccess: false, isTrialing: false, trialDaysLeft: null, tier: null }
  }

  if (profile.tier === 'gold' || profile.tier === 'premium') {
    return { loading: false, hasAccess: true, isTrialing: false, trialDaysLeft: null, tier: profile.tier }
  }

  if (profile.tier === 'trial' && profile.trialEndsAt !== null) {
    const stillTrialing = profile.trialEndsAt > now
    const trialDaysLeft = stillTrialing ? Math.max(1, Math.ceil((profile.trialEndsAt - now) / 86_400_000)) : 0
    return { loading: false, hasAccess: stillTrialing, isTrialing: stillTrialing, trialDaysLeft, tier: profile.tier }
  }

  // 'free', or a legacy/expired 'trial' with no trialEndsAt to check.
  return { loading: false, hasAccess: false, isTrialing: false, trialDaysLeft: null, tier: profile.tier }
}

export function useEntitlement(): Entitlement {
  const { profile, loading } = useUserProfile()
  if (loading) return { loading: true, hasAccess: false, isTrialing: false, trialDaysLeft: null, tier: null }
  return computeEntitlement(profile)
}
