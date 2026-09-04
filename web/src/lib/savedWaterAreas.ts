import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { GetWaterFeaturesResult, WaterFeature } from './water'

export interface SavedWaterArea {
  id: string
  cacheKey: string
  lat: number
  lng: number
  radiusMiles: number
  searchedRadiusMiles: number
  features: WaterFeature[]
  count: number
  totalFound: number
  resultComplete: boolean
  source: 'usgs-3dhp'
  attribution: string
  sourceRefreshDate: string | null
  savedAt: number
  fetchedAt: number
  schemaVersion: number
  label: string
}

/** Same rounding scheme as the backend cache key (functions/src/water.ts) —
 * a 2-decimal-place grid cell plus the exact requested radius in miles. */
export function computeCacheKey(lat: number, lng: number, radiusMiles: number): string {
  return `${lat.toFixed(2)}_${lng.toFixed(2)}_${radiusMiles}`
}

const STALE_AFTER_MS = 30 * 24 * 60 * 60 * 1000 // matches the server cache TTL

export function isSavedAreaStale(area: Pick<SavedWaterArea, 'fetchedAt'>): boolean {
  return Date.now() - area.fetchedAt > STALE_AFTER_MS
}

/** Saves (or overwrites, e.g. on refresh) a self-contained copy of a water
 * search result for offline use. Re-saving the same lat/lng/radius updates
 * the existing doc rather than creating a duplicate. */
export async function saveWaterAreaOffline(
  uid: string,
  params: { lat: number; lng: number; radiusMiles: number; result: GetWaterFeaturesResult },
): Promise<void> {
  const cacheKey = computeCacheKey(params.lat, params.lng, params.radiusMiles)
  const ref = doc(db, 'users', uid, 'savedWaterAreas', cacheKey)
  await setDoc(ref, {
    cacheKey,
    lat: params.lat,
    lng: params.lng,
    radiusMiles: params.radiusMiles,
    searchedRadiusMiles: params.result.searchedRadiusMiles,
    features: params.result.features,
    count: params.result.count,
    totalFound: params.result.totalFound,
    resultComplete: params.result.resultComplete,
    source: params.result.source,
    attribution: params.result.attribution,
    sourceRefreshDate: params.result.sourceRefreshDate,
    savedAt: Date.now(),
    fetchedAt: params.result.fetchedAt,
    schemaVersion: 2,
    label: `Near ${params.lat.toFixed(3)}, ${params.lng.toFixed(3)} (${params.radiusMiles} mi)`,
  })
}

export async function removeSavedWaterArea(uid: string, areaId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'savedWaterAreas', areaId))
}

export function findSavedAreaFor(
  areas: SavedWaterArea[],
  lat: number,
  lng: number,
  radiusMiles: number,
): SavedWaterArea | undefined {
  const key = computeCacheKey(lat, lng, radiusMiles)
  return areas.find((a) => a.cacheKey === key)
}

/** Live list of the signed-in user's saved offline areas. Backed by
 * Firestore's persistent local cache, so this keeps working (from local
 * data) when the device is offline. */
export function useSavedWaterAreas(uid: string | null) {
  const [areas, setAreas] = useState<SavedWaterArea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      setAreas([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(collection(db, 'users', uid, 'savedWaterAreas'), orderBy('savedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      setAreas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SavedWaterArea, 'id'>) })))
      setLoading(false)
    })
    return unsubscribe
  }, [uid])

  return { areas, loading }
}
