export type SpeciesCategory =
  | 'edible-plant'
  | 'tree-wood'
  | 'edible-wildlife'
  | 'edible-insect'
  | 'dangerous-plant'
  | 'dangerous-animal'

export interface WoodUse {
  firewood: boolean
  smoking: boolean
  burnWarning?: string
}

export interface SpeciesEntry {
  id: string
  scientificName: string
  commonName: string
  category: SpeciesCategory
  activeMonths: number[]
  summary: string
  edibleParts?: string[]
  cookingNotes?: string
  dangerNotes?: string
  safetyNotes?: string
  woodUse?: WoodUse
}

/**
 * A species entry as returned by getSpeciesNearby: `confirmed: true` means
 * GBIF has a real nearby occurrence record; `confirmed: false` means this
 * entry's category had zero confirmed sightings nearby, so it's shown as a
 * curated, regionally-documented fallback instead of being hidden — never
 * implying an unverified local sighting.
 */
export interface ConfirmedSpeciesEntry extends SpeciesEntry {
  confirmed: boolean
}

export interface GetSpeciesNearbyResult {
  species: ConfirmedSpeciesEntry[]
  radiusMiles: number
  month: number
}

const CATEGORY_META: Record<SpeciesCategory, { label: string; icon: string }> = {
  'edible-plant': { label: 'Edible Plants', icon: '🌿' },
  'tree-wood': { label: 'Trees & Wood', icon: '🪵' },
  'edible-wildlife': { label: 'Edible Wildlife', icon: '🐿️' },
  'edible-insect': { label: 'Edible Insects', icon: '🦗' },
  'dangerous-plant': { label: 'Dangerous Plants', icon: '☠️' },
  'dangerous-animal': { label: 'Dangerous Animals', icon: '🐍' },
}

export function categoryLabel(category: SpeciesCategory): string {
  return CATEGORY_META[category].label
}

export function categoryIcon(category: SpeciesCategory): string {
  return CATEGORY_META[category].icon
}

// Danger categories surface first — the most safety-relevant info first.
export const CATEGORY_ORDER: SpeciesCategory[] = [
  'dangerous-animal',
  'dangerous-plant',
  'edible-plant',
  'edible-wildlife',
  'edible-insect',
  'tree-wood',
]

export interface SpeciesGroup<T extends SpeciesEntry = SpeciesEntry> {
  category: SpeciesCategory
  items: T[]
}

export function groupByCategory<T extends SpeciesEntry>(species: T[]): SpeciesGroup<T>[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: species.filter((s) => s.category === category),
  })).filter((group) => group.items.length > 0)
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
