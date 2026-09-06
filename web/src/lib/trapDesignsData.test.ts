import { describe, expect, it } from 'vitest'
import { TRAP_CATEGORIES, TRAP_DESIGN_COUNT } from './trapDesignsData'

describe('TRAP_CATEGORIES', () => {
  it('has exactly 100 designs, numbered sequentially from 1 with no gaps or duplicates', () => {
    const numbers = TRAP_CATEGORIES.flatMap((category) => category.designs.map((design) => design.num))
    expect(numbers.length).toBe(100)
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
    expect(new Set(numbers).size).toBe(numbers.length)
    expect(numbers[0]).toBe(1)
    expect(numbers[numbers.length - 1]).toBe(100)
  })

  it('has a unique, non-empty key and title per category', () => {
    const keys = TRAP_CATEGORIES.map((category) => category.key)
    expect(new Set(keys).size).toBe(keys.length)
    TRAP_CATEGORIES.forEach((category) => {
      expect(category.title.trim().length).toBeGreaterThan(0)
      expect(category.emoji.trim().length).toBeGreaterThan(0)
      expect(category.designs.length).toBeGreaterThan(0)
    })
  })

  it('gives every design a name, type, valid difficulty, materials, and at least one construction step', () => {
    TRAP_CATEGORIES.forEach((category) => {
      category.designs.forEach((design) => {
        expect(design.name.trim().length).toBeGreaterThan(0)
        expect(design.type.trim().length).toBeGreaterThan(0)
        expect(design.difficulty).toBeGreaterThanOrEqual(1)
        expect(design.difficulty).toBeLessThanOrEqual(5)
        expect(design.materials.trim().length).toBeGreaterThan(0)
        expect(design.construction.length).toBeGreaterThan(0)
        design.construction.forEach((step) => expect(step.trim().length).toBeGreaterThan(0))
        design.notes.forEach((note) => {
          expect(note.label.trim().length).toBeGreaterThan(0)
          expect(note.text.trim().length).toBeGreaterThan(0)
        })
      })
    })
  })

  it('has a unique name per design, across all categories', () => {
    // Regression check: the source material had two different designs (#39
    // and #79) both literally titled "Counterweight Cage Door" — #79 was
    // renamed to disambiguate rather than silently left as a duplicate.
    const names = TRAP_CATEGORIES.flatMap((category) => category.designs.map((design) => design.name))
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('TRAP_DESIGN_COUNT', () => {
  it('matches the actual total number of designs across all categories', () => {
    const actual = TRAP_CATEGORIES.reduce((total, category) => total + category.designs.length, 0)
    expect(TRAP_DESIGN_COUNT).toBe(actual)
    expect(TRAP_DESIGN_COUNT).toBe(100)
  })
})
