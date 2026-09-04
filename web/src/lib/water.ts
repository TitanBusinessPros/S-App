export const MIN_RADIUS_MILES = 1
export const MAX_RADIUS_MILES = 100
export const DEFAULT_RADIUS_MILES = 10

// Sourced from the official USGS 3D Hydrography Program (3DHP). This source
// does not have a distinct "Pond" or "Reservoir" class — small ponds are
// classified the same as lakes — and does not distinguish river/stream/creek
// on its flowlines, so the type set intentionally reflects what the source
// actually tells us rather than a finer distinction we can't back up.
export type WaterType = 'river' | 'canal' | 'lake' | 'ocean' | 'spring' | 'drainageway'

export interface WaterFeature {
  id: string
  name: string | null
  waterType: WaterType
  lat: number
  lng: number
  /** Straight-line distance from the search point, in miles. */
  distanceMiles: number
  sourceFeatureId: string
  sourceLayer: 60 | 50 | 20
}

/** We only ever show the closest TARGET_COUNT water features — searching
 * every mapped feature in a large, water-dense radius meant fetching and
 * rendering thousands of markers, which is what made the app slow. */
export const TARGET_COUNT = 100

export interface GetWaterFeaturesResult {
  /** Up to TARGET_COUNT features, nearest first. */
  features: WaterFeature[]
  /** The radius you asked for. */
  radiusMiles: number
  /** The radius actually searched to find these results — may be smaller
   * than radiusMiles (found enough nearby already) or capped at radiusMiles. */
  searchedRadiusMiles: number
  count: number
  /** How many features actually exist within searchedRadiusMiles — equal to
   * count when nothing was cut, larger than count when we kept only the
   * nearest TARGET_COUNT. */
  totalFound: number
  /** True only when nothing was cut (totalFound === count). */
  resultComplete: boolean
  source: 'usgs-3dhp'
  attribution: string
  sourceRefreshDate: string | null
  fetchedAt: number
  fromCache: boolean
}

const WATER_TYPE_LABELS: Record<WaterType, string> = {
  river: 'River / Stream',
  canal: 'Canal',
  // Deliberately not "Pond" — USGS 3DHP has no separate pond class; small
  // ponds are classified the same as lakes in this source.
  lake: 'Lake-class waterbody',
  ocean: 'Ocean / Great Lake',
  spring: 'Spring',
  drainageway: 'Drainageway (ditch/drain)',
}

export function waterTypeLabel(type: WaterType): string {
  return WATER_TYPE_LABELS[type]
}

const WATER_TYPE_ICONS: Record<WaterType, string> = {
  river: '🌊',
  canal: '💧',
  lake: '🟦',
  ocean: '🌐',
  spring: '💦',
  drainageway: '〰️',
}

export function waterTypeIcon(type: WaterType): string {
  return WATER_TYPE_ICONS[type]
}

export const USGS_COVERAGE_NOTE =
  'Water features are from USGS national hydrography data. Unmapped, private, temporary, or very small water sources may not appear.'

export const OFFLINE_SCOPE_NOTE =
  'Offline water data is available only for areas you previously downloaded while online.'
