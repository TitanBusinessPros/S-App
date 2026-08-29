import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'
import type { GetWaterFeaturesResult } from './water'
import type { GetSpeciesNearbyResult } from './species'

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

export async function fetchSpeciesNearby(
  lat: number,
  lng: number,
  radiusMiles: number,
  month: number,
): Promise<GetSpeciesNearbyResult> {
  const call = httpsCallable<
    { lat: number; lng: number; radiusMiles: number; month: number },
    GetSpeciesNearbyResult
  >(functions, 'getSpeciesNearby')
  const result = await call({ lat, lng, radiusMiles, month })
  return result.data
}
