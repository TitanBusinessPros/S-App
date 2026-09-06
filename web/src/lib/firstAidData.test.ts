import { describe, expect, it } from 'vitest'
import { FIRST_AID_CATEGORIES, FIRST_AID_ITEM_COUNT, UNIVERSAL_RESPONSE } from './firstAidData'

describe('UNIVERSAL_RESPONSE', () => {
  it('is a non-empty list of non-empty strings', () => {
    expect(UNIVERSAL_RESPONSE.length).toBeGreaterThan(0)
    UNIVERSAL_RESPONSE.forEach((step) => expect(step.trim().length).toBeGreaterThan(0))
  })
})

describe('FIRST_AID_CATEGORIES', () => {
  it('has at least one category, each with a title, emoji, and items', () => {
    expect(FIRST_AID_CATEGORIES.length).toBeGreaterThan(0)
    FIRST_AID_CATEGORIES.forEach((category) => {
      expect(category.title.trim().length).toBeGreaterThan(0)
      expect(category.emoji.trim().length).toBeGreaterThan(0)
      expect(category.items.length).toBeGreaterThan(0)
    })
  })

  it('has a unique, non-empty key per category', () => {
    const keys = FIRST_AID_CATEGORIES.map((category) => category.key)
    expect(new Set(keys).size).toBe(keys.length)
    keys.forEach((key) => expect(key.trim().length).toBeGreaterThan(0))
  })

  it('numbers every item sequentially from 1, with no gaps or duplicates, across all categories', () => {
    const numbers = FIRST_AID_CATEGORIES.flatMap((category) => category.items.map((item) => item.num))
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
    expect(new Set(numbers).size).toBe(numbers.length)
    expect(numbers[0]).toBe(1)
    expect(numbers[numbers.length - 1]).toBe(numbers.length)
  })

  it('gives every item a non-empty problem and action', () => {
    FIRST_AID_CATEGORIES.forEach((category) => {
      category.items.forEach((item) => {
        expect(item.problem.trim().length).toBeGreaterThan(0)
        expect(item.action.trim().length).toBeGreaterThan(0)
      })
    })
  })
})

describe('FIRST_AID_ITEM_COUNT', () => {
  it('matches the actual total number of items across all categories', () => {
    const actual = FIRST_AID_CATEGORIES.reduce((total, category) => total + category.items.length, 0)
    expect(FIRST_AID_ITEM_COUNT).toBe(actual)
  })
})
