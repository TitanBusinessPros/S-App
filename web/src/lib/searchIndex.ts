// Flat, searchable index built once at module load from the app's own
// existing structured guide content -- no new content, no external
// service, just pulling text that's already in the app into one place a
// user can actually search. Plain substring matching (see search()) is
// fast enough for a few hundred entries; no search library needed.

import { FIRST_AID_CATEGORIES, UNIVERSAL_RESPONSE } from './firstAidData'
import { WATER_METHOD_CATEGORIES, FIRST_PRIORITIES, WATER_METHODS_TO_AVOID, WATER_TREATMENT_METHODS } from './findingWaterData'
import { SHELTER_DESIGNS, UNIVERSAL_SHELTER_RULES, SHELTERS_NOT_RECOMMENDED } from './shelterData'
import { TRAP_CATEGORIES } from './trapDesignsData'
import { RECIPES } from './recipesData'
import { CONTOUR_BASICS, TERRAIN_SHAPES, SLOPE_AND_STEEPNESS, PRACTICAL_USES, COMMON_MISTAKES } from './topoGuideData'

export interface SearchItem {
  title: string
  snippet: string
  category: string
  /** Route, optionally with a #anchor into a specific section/card. */
  route: string
}

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = []

  // First Aid
  items.push({ title: 'Universal Response', snippet: UNIVERSAL_RESPONSE.join(' '), category: 'First Aid', route: '/app/first-aid#first-aid-universal' })
  FIRST_AID_CATEGORIES.forEach((cat) => {
    cat.items.forEach((row) => {
      items.push({ title: row.problem, snippet: row.action, category: 'First Aid', route: '/app/first-aid' })
    })
  })

  // Finding Water
  items.push({ title: 'First Priorities', snippet: FIRST_PRIORITIES.join(' '), category: 'Finding Water', route: '/app/water-sourcing#water-first-priorities' })
  WATER_METHOD_CATEGORIES.forEach((cat) => {
    cat.items.forEach((row) => {
      items.push({ title: row.name, snippet: row.text, category: 'Finding Water', route: `/app/water-sourcing#water-${cat.key}` })
    })
  })
  WATER_METHODS_TO_AVOID.forEach((row) => {
    items.push({ title: row.name, snippet: row.text, category: 'Finding Water', route: '/app/water-sourcing#water-avoid' })
  })
  WATER_TREATMENT_METHODS.forEach((row) => {
    items.push({
      title: row.method,
      snippet: `${row.whatItDoesWell} ${row.criticalLimits}`,
      category: 'Finding Water',
      route: '/app/water-sourcing#water-treat',
    })
  })

  // Shelter Building
  UNIVERSAL_SHELTER_RULES.forEach((rule) => {
    items.push({ title: rule.title, snippet: rule.bullets.join(' '), category: 'Shelter Building', route: '/app/shelter#shelter-universal-rules' })
  })
  SHELTER_DESIGNS.forEach((design) => {
    items.push({
      title: design.name,
      snippet: `${design.bestFor} ${design.keyDetail}`,
      category: 'Shelter Building',
      route: '/app/shelter#shelter-designs',
    })
  })
  items.push({ title: 'Shelters Not Recommended', snippet: SHELTERS_NOT_RECOMMENDED.join(' '), category: 'Shelter Building', route: '/app/shelter#shelter-not-recommended' })

  // Snares & Traps
  TRAP_CATEGORIES.forEach((cat) => {
    cat.designs.forEach((design) => {
      items.push({
        title: design.name,
        snippet: `${design.type} — ${design.materials}`,
        category: 'Snares & Traps',
        route: `/app/snares#trap-${cat.key}`,
      })
    })
  })

  // Topography guide
  const topoSections = [
    { heading: 'Contour Basics', id: 'topo-basics', sections: CONTOUR_BASICS },
    { heading: 'Terrain Shapes', id: 'topo-shapes', sections: TERRAIN_SHAPES },
    { heading: 'Slope & Steepness', id: 'topo-slope', sections: SLOPE_AND_STEEPNESS },
    { heading: 'Practical Uses', id: 'topo-uses', sections: PRACTICAL_USES },
    { heading: 'Common Mistakes', id: 'topo-mistakes', sections: COMMON_MISTAKES },
  ]
  topoSections.forEach(({ id, sections }) => {
    sections.forEach((section) => {
      items.push({ title: section.title, snippet: section.bullets.join(' '), category: 'Topography Map', route: `/app/topography#${id}` })
    })
  })

  // Wild Game Recipes
  RECIPES.forEach((recipe) => {
    items.push({
      title: recipe.title,
      snippet: recipe.intro ?? recipe.instructions.join(' '),
      category: 'Wild Game Recipes',
      route: `/app/recipes#recipe-${recipe.id}`,
    })
  })

  return items
}

let cachedIndex: SearchItem[] | null = null

/** Lazily built and cached -- this only ever runs once per page session. */
export function getSearchIndex(): SearchItem[] {
  if (!cachedIndex) cachedIndex = buildIndex()
  return cachedIndex
}

const MAX_RESULTS = 30

/** Plain case-insensitive substring match across title + snippet. Good
 * enough at this content size; no fuzzy-matching library needed. */
export function search(query: string): SearchItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return getSearchIndex()
    .filter((item) => item.title.toLowerCase().includes(q) || item.snippet.toLowerCase().includes(q))
    .slice(0, MAX_RESULTS)
}
