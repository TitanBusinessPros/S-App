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
    let trialDaysLeft = 0
    if (stillTrialing) {
      // Days remaining as observed right now. Any clock skew or delay
      // between the server (which set trialEndsAt) and this device reading
      // "now" can inflate this -- e.g. a brand-new 3-day trial reads as
      // "4 days left" if the client's clock lags the server's by even a
      // fraction of a second at the exact moment the trial starts.
      const observedDaysLeft = Math.ceil((profile.trialEndsAt - now) / 86_400_000)
      // The actual trial length this account was granted, from two
      // timestamps the server set together in the same write (see
      // createUserProfile) -- always exactly right regardless of this
      // device's clock, so it's a hard ceiling observedDaysLeft can never
      // be allowed to exceed.
      const grantedDays = Math.ceil((profile.trialEndsAt - profile.createdAt) / 86_400_000)
      trialDaysLeft = Math.max(1, Math.min(observedDaysLeft, grantedDays))
    }
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
