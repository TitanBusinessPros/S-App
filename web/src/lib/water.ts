export const MIN_RADIUS_MILES = 1
export const MAX_RADIUS_MILES = 100
export const DEFAULT_RADIUS_MILES = 10

export type WaterType = 'river' | 'stream' | 'canal' | 'pond' | 'lake' | 'reservoir' | 'water'

export interface WaterFeature {
  id: string
  name: string | null
  waterType: WaterType
  lat: number
  lng: number
}

export interface GetWaterFeaturesResult {
  features: WaterFeature[]
  radiusMiles: number
  truncated: boolean
}

const WATER_TYPE_LABELS: Record<WaterType, string> = {
  river: 'River',
  stream: 'Stream',
  canal: 'Canal',
  pond: 'Pond',
  lake: 'Lake',
  reservoir: 'Reservoir',
  water: 'Water',
}

export function waterTypeLabel(type: WaterType): string {
  return WATER_TYPE_LABELS[type]
}

const WATER_TYPE_ICONS: Record<WaterType, string> = {
  river: '🌊',
  stream: '💧',
  canal: '💧',
  pond: '🟦',
  lake: '🟦',
  reservoir: '🟦',
  water: '💧',
}

export function waterTypeIcon(type: WaterType): string {
  return WATER_TYPE_ICONS[type]
}
