import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

// Mirrors functions/src/waterScanCredits.ts — keep both in sync.
export const DAILY_WATER_SCAN_LIMIT = 3
export const WATER_SCAN_WINDOW_MS = 24 * 60 * 60 * 1000

interface WaterScanCreditDoc {
  count: number
  windowStartAt: number
}

export interface WaterScanCreditState {
  creditsRemaining: number
  /** ms epoch when the next credit frees up, or null if a full set is
   * available right now (no scans used yet, or the last window expired). */
  resetAt: number | null
  loading: boolean
}

const FULL_CREDITS: Omit<WaterScanCreditState, 'loading'> = { creditsRemaining: DAILY_WATER_SCAN_LIMIT, resetAt: null }

/**
 * Live view of the signed-in user's water-scan credits (see
 * functions/src/waterScanCredits.ts, the actual server-side enforcement).
 * Reproduces that same rolling-window reset logic client-side so a window
 * that's already expired reads as full credits here immediately, without
 * waiting for the next scan to make the server rewrite the doc.
 */
export function useWaterScanCredits(uid: string | null): WaterScanCreditState {
  const [state, setState] = useState<WaterScanCreditState>({ ...FULL_CREDITS, loading: true })

  useEffect(() => {
    if (!uid) {
      setState({ ...FULL_CREDITS, loading: false })
      return
    }

    setState((s) => ({ ...s, loading: true }))
    const unsubscribe = onSnapshot(doc(db, 'waterScanCredits', uid), (snap) => {
      const data = snap.data() as WaterScanCreditDoc | undefined
      if (!data) {
        setState({ ...FULL_CREDITS, loading: false })
        return
      }

      const windowExpired = Date.now() - data.windowStartAt >= WATER_SCAN_WINDOW_MS
      if (windowExpired) {
        setState({ ...FULL_CREDITS, loading: false })
      } else {
        setState({
          creditsRemaining: Math.max(0, DAILY_WATER_SCAN_LIMIT - data.count),
          resetAt: data.windowStartAt + WATER_SCAN_WINDOW_MS,
          loading: false,
        })
      }
    })
    return unsubscribe
  }, [uid])

  return state
}
