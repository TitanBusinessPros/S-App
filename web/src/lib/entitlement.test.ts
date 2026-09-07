import { describe, expect, it } from 'vitest'
import { computeEntitlement } from './entitlement'
import type { UserProfile } from './useUserProfile'

const NOW = 1_700_000_000_000
const DAY = 86_400_000

function profile(overrides: Partial<UserProfile>): UserProfile {
  return {
    email: 'person@example.com',
    displayName: 'Person',
    photoURL: null,
    tier: 'trial',
    trialEndsAt: null,
    createdAt: NOW,
    ...overrides,
  }
}

describe('computeEntitlement', () => {
  it('is loading with no access while the profile has not loaded yet', () => {
    expect(computeEntitlement(null, NOW)).toEqual({
      loading: true,
      hasAccess: false,
      isTrialing: false,
      trialDaysLeft: null,
      tier: null,
    })
  })

  it('grants full access to a gold account', () => {
    const result = computeEntitlement(profile({ tier: 'gold', trialEndsAt: null }), NOW)
    expect(result).toMatchObject({ hasAccess: true, isTrialing: false, tier: 'gold' })
  })

  it('grants full access to a premium account', () => {
    const result = computeEntitlement(profile({ tier: 'premium', trialEndsAt: null }), NOW)
    expect(result).toMatchObject({ hasAccess: true, isTrialing: false, tier: 'premium' })
  })

  it('grants access during an active trial and reports days left', () => {
    const result = computeEntitlement(profile({ tier: 'trial', trialEndsAt: NOW + 5 * DAY + 12 * 60 * 60 * 1000 }), NOW)
    expect(result).toMatchObject({ hasAccess: true, isTrialing: true, trialDaysLeft: 6, tier: 'trial' })
  })

  it('never reports more days left than the trial actually granted, however stale "now" is', () => {
    // Regression test for the real-world bug: createdAt and trialEndsAt are
    // always exactly TRIAL_DURATION_MS apart (both set server-side in the
    // same write -- see createUserProfile), so a 3-day trial's granted
    // window is always exactly 3 days here. But the device computing "now"
    // can lag the server by anywhere from a fraction of a second (clock
    // skew) to tens of seconds (Cloud Function cold start + network
    // round-trip) right when the trial starts -- previously this pushed
    // the *observed* days left over the 3-day boundary and displayed "4"
    // until a later reload caught up. A device lagging by even a full
    // minute must still show 3, not 4.
    const account = profile({ tier: 'trial', createdAt: NOW, trialEndsAt: NOW + 3 * DAY })
    const result = computeEntitlement(account, NOW - 60_000)
    expect(result.trialDaysLeft).toBe(3)
  })

  it('rounds a trial with only hours left up to 1 day, never 0', () => {
    const result = computeEntitlement(profile({ tier: 'trial', trialEndsAt: NOW + 1000 }), NOW)
    expect(result.trialDaysLeft).toBe(1)
  })

  it('locks out a trial once trialEndsAt has passed', () => {
    const result = computeEntitlement(profile({ tier: 'trial', trialEndsAt: NOW - 1 }), NOW)
    expect(result).toMatchObject({ hasAccess: false, isTrialing: false, trialDaysLeft: 0, tier: 'trial' })
  })

  it('locks out the free tier', () => {
    const result = computeEntitlement(profile({ tier: 'free', trialEndsAt: null }), NOW)
    expect(result).toMatchObject({ hasAccess: false, isTrialing: false, trialDaysLeft: null, tier: 'free' })
  })
})
