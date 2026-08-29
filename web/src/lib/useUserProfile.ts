import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './AuthContext'

export type Tier = 'free' | 'premium'

export interface UserProfile {
  email: string | null
  displayName: string | null
  photoURL: string | null
  tier: Tier
  createdAt: number
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
