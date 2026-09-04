import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'
import type { GetWaterFeaturesResult } from './water'
import type { GetSpeciesNearbyResult } from './species'
import type { GetLocationNameResult } from './location'

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

export async function fetchLocationName(lat: number, lng: number): Promise<GetLocationNameResult> {
  const call = httpsCallable<{ lat: number; lng: number }, GetLocationNameResult>(functions, 'getLocationName')
  const result = await call({ lat, lng })
  return result.data
}

export interface GrantGoldMembershipResult {
  granted: boolean
  pending: boolean
}

export async function grantGoldMembership(email: string): Promise<GrantGoldMembershipResult> {
  const call = httpsCallable<{ email: string }, GrantGoldMembershipResult>(functions, 'grantGoldMembership')
  const result = await call({ email })
  return result.data
}

export interface BackfillTrialTiersResult {
  updated: number
}

export async function backfillTrialTiers(): Promise<BackfillTrialTiersResult> {
  const call = httpsCallable<Record<string, never>, BackfillTrialTiersResult>(functions, 'backfillTrialTiers')
  const result = await call({})
  return result.data
}
