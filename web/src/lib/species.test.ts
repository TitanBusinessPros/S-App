import { describe, expect, it } from 'vitest'
import { categoryIcon, categoryLabel, CATEGORY_ORDER, groupByCategory, type SpeciesEntry } from './species'

function entry(overrides: Partial<SpeciesEntry>): SpeciesEntry {
  return {
    id: 'x',
    scientificName: 'Testus exampleus',
    commonName: 'Test Species',
    category: 'edible-plant',
    activeMonths: [1],
    summary: 'A test species.',
    ...overrides,
  }
}

describe('categoryLabel / categoryIcon', () => {
  it.each(CATEGORY_ORDER)('returns a non-empty label and icon for %s', (category) => {
    expect(categoryLabel(category).length).toBeGreaterThan(0)
    expect(categoryIcon(category).length).toBeGreaterThan(0)
  })
})

describe('groupByCategory', () => {
  it('groups species under their category, in danger-first order', () => {
    const species = [
      entry({ id: 'a', category: 'edible-plant' }),
      entry({ id: 'b', category: 'dangerous-animal' }),
      entry({ id: 'c', category: 'edible-plant' }),
    ]

    const groups = groupByCategory(species)

    expect(groups.map((g) => g.category)).toEqual(['dangerous-animal', 'edible-plant'])
    expect(groups[0].items.map((i) => i.id)).toEqual(['b'])
    expect(groups[1].items.map((i) => i.id)).toEqual(['a', 'c'])
  })

  it('omits categories with no matching species', () => {
    const groups = groupByCategory([entry({ category: 'tree-wood' })])
    expect(groups).toHaveLength(1)
    expect(groups[0].category).toBe('tree-wood')
  })

  it('returns an empty list for no species', () => {
    expect(groupByCategory([])).toEqual([])
  })
})
