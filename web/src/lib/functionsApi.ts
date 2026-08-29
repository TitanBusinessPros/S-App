import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'
import type { GetWaterFeaturesResult } from './water'

export async function fetchWaterFeatures(
  lat: number,
  lng: number,
  radiusMiles: number,
): Promise<GetWaterFeaturesResult> {
  const call = httpsCallable<{ lat: number; lng: number; radiusMiles: number }, GetWaterFeaturesResult>(
    functions,
    'getWaterFeatures',
  )
  const result = await call({ lat, lng, radiusMiles })
  return result.data
}
