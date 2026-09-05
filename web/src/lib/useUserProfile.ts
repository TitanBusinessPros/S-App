import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './AuthContext'

// 'trial' — the 3-day window every new sign-in starts on (see the
//   createUserProfile Cloud Function). Still full access; trialEndsAt is
//   what actually decides when that runs out (see entitlement.ts).
// 'free' — trial ended (or a subscription lapsed) with no active payment.
// 'premium' — an active $12/year Stripe subscription (see billing.ts).
// 'gold' — an admin-granted permanent free upgrade. Always wins; billing
//   events never downgrade a gold account (see functions/src/billing.ts).
export type Tier = 'trial' | 'free' | 'premium' | 'gold'

export interface UserProfile {
  email: string | null
  displayName: string | null
  photoURL: string | null
  tier: Tier
  /** ms timestamp the trial ends, or null once it's not relevant (gold,
   * premium, or an account created before trials existed at all). */
  trialEndsAt: number | null
  createdAt: number
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  subscriptionStatus?: string
}

/**
 * Reads the current user's Firestore profile (created server-side by the
 * createUserProfile Cloud Function on first sign-in). Read-only from the
 * client by design — see firestore.rules.
 */
export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setProfile(snap.exists() ? (snap.data() as UserProfile) : null)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  return { profile, loading }
}
