import { describe, expect, it } from 'vitest'
import { getSearchIndex, search } from './searchIndex'

describe('getSearchIndex', () => {
  it('builds a non-empty index covering every guide category', () => {
    const index = getSearchIndex()
    expect(index.length).toBeGreaterThan(100)
    const categories = new Set(index.map((i) => i.category))
    expect(categories).toEqual(
      new Set(['First Aid', 'Finding Water', 'Shelter Building', 'Snares & Traps', 'Topography Map', 'Wild Game Recipes']),
    )
  })

  it('gives every entry a non-empty title, snippet, and route', () => {
    getSearchIndex().forEach((item) => {
      expect(item.title.trim().length).toBeGreaterThan(0)
      expect(item.snippet.trim().length).toBeGreaterThan(0)
      expect(item.route.startsWith('/app/')).toBe(true)
    })
  })
})

describe('search', () => {
  it('returns an empty array for a blank query', () => {
    expect(search('')).toEqual([])
    expect(search('   ')).toEqual([])
  })

  it('finds a known first-aid entry by its title text', () => {
    const results = search('universal response')
    expect(results.some((r) => r.category === 'First Aid')).toBe(true)
  })

  it('is case-insensitive', () => {
    const lower = search('shelter')
    const upper = search('SHELTER')
    expect(upper.length).toBe(lower.length)
  })

  it('matches on snippet text, not just the title', () => {
    // "Water Purification" content isn't indexed yet, but "boiling" appears
    // in the Finding Water treatment-methods snippets either way.
    const results = search('boil')
    expect(results.length).toBeGreaterThan(0)
  })

  it('never returns more than 30 results', () => {
    // A very common short substring almost certainly matches far more than 30 entries.
    const results = search('a')
    expect(results.length).toBeLessThanOrEqual(30)
  })
})
