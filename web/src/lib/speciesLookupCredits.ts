import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

// Mirrors functions/src/speciesLookupCredits.ts — keep both in sync.
export const DAILY_SPECIES_LOOKUP_LIMIT = 3
export const SPECIES_LOOKUP_WINDOW_MS = 24 * 60 * 60 * 1000

interface SpeciesLookupCreditDoc {
  count: number
  windowStartAt: number
}

export interface SpeciesLookupCreditState {
  creditsRemaining: number
  /** ms epoch when the next credit frees up, or null if a full set is
   * available right now (no lookups used yet, or the last window expired). */
  resetAt: number | null
  loading: boolean
}

const FULL_CREDITS: Omit<SpeciesLookupCreditState, 'loading'> = {
  creditsRemaining: DAILY_SPECIES_LOOKUP_LIMIT,
  resetAt: null,
}

/**
 * Live view of the signed-in user's species-lookup credits (see
 * functions/src/speciesLookupCredits.ts, the actual server-side
 * enforcement). Mirrors useWaterScanCredits (see waterScanCredits.ts) —
 * same rolling-window reset logic reproduced client-side so an already-
 * expired window reads as full credits immediately, without waiting for the
 * next lookup to make the server rewrite the doc.
 */
export function useSpeciesLookupCredits(uid: string | null): SpeciesLookupCreditState {
  const [state, setState] = useState<SpeciesLookupCreditState>({ ...FULL_CREDITS, loading: true })

  useEffect(() => {
    if (!uid) {
      setState({ ...FULL_CREDITS, loading: false })
      return
    }

    setState((s) => ({ ...s, loading: true }))
    const unsubscribe = onSnapshot(doc(db, 'speciesLookupCredits', uid), (snap) => {
      const data = snap.data() as SpeciesLookupCreditDoc | undefined
      if (!data) {
        setState({ ...FULL_CREDITS, loading: false })
        return
      }

      const windowExpired = Date.now() - data.windowStartAt >= SPECIES_LOOKUP_WINDOW_MS
      if (windowExpired) {
        setState({ ...FULL_CREDITS, loading: false })
      } else {
        setState({
          creditsRemaining: Math.max(0, DAILY_SPECIES_LOOKUP_LIMIT - data.count),
          resetAt: data.windowStartAt + SPECIES_LOOKUP_WINDOW_MS,
          loading: false,
        })
      }
    })
    return unsubscribe
  }, [uid])

  return state
}
