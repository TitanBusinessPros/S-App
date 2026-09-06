import { describe, expect, it } from 'vitest'
import {
  BOILING_GUIDANCE,
  FIRST_PRIORITIES,
  SEEP_HOLE_STEPS,
  SURVIVAL_DECISION_RULE,
  WATER_METHOD_CATEGORIES,
  WATER_METHOD_COUNT,
  WATER_METHODS_TO_AVOID,
  WATER_TREATMENT_METHODS,
} from './findingWaterData'

describe('FIRST_PRIORITIES', () => {
  it('is a non-empty list of non-empty strings', () => {
    expect(FIRST_PRIORITIES.length).toBeGreaterThan(0)
    FIRST_PRIORITIES.forEach((step) => expect(step.trim().length).toBeGreaterThan(0))
  })
})

describe('WATER_METHOD_CATEGORIES', () => {
  it('has exactly 50 methods total, numbered sequentially from 1 with no gaps or duplicates', () => {
    const numbers = WATER_METHOD_CATEGORIES.flatMap((category) => category.items.map((item) => item.num))
    expect(numbers.length).toBe(50)
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
    expect(new Set(numbers).size).toBe(numbers.length)
    expect(numbers[0]).toBe(1)
    expect(numbers[numbers.length - 1]).toBe(50)
  })

  it('has a unique, non-empty key and title per category', () => {
    const keys = WATER_METHOD_CATEGORIES.map((category) => category.key)
    expect(new Set(keys).size).toBe(keys.length)
    WATER_METHOD_CATEGORIES.forEach((category) => {
      expect(category.title.trim().length).toBeGreaterThan(0)
      expect(category.emoji.trim().length).toBeGreaterThan(0)
      expect(category.items.length).toBeGreaterThan(0)
    })
  })

  it('gives every method a non-empty name and description', () => {
    WATER_METHOD_CATEGORIES.forEach((category) => {
      category.items.forEach((item) => {
        expect(item.name.trim().length).toBeGreaterThan(0)
        expect(item.text.trim().length).toBeGreaterThan(0)
      })
    })
  })

  it('has a unique name per method, across all categories', () => {
    const names = WATER_METHOD_CATEGORIES.flatMap((category) => category.items.map((item) => item.name))
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('WATER_METHOD_COUNT', () => {
  it('matches the actual total number of methods across all categories', () => {
    const actual = WATER_METHOD_CATEGORIES.reduce((total, category) => total + category.items.length, 0)
    expect(WATER_METHOD_COUNT).toBe(actual)
    expect(WATER_METHOD_COUNT).toBe(50)
  })
})

describe('SEEP_HOLE_STEPS', () => {
  it('is a non-empty ordered list of non-empty steps', () => {
    expect(SEEP_HOLE_STEPS.length).toBeGreaterThan(0)
    SEEP_HOLE_STEPS.forEach((step) => expect(step.trim().length).toBeGreaterThan(0))
  })
})

describe('WATER_METHODS_TO_AVOID', () => {
  it('is a non-empty list, each with a name and explanation', () => {
    expect(WATER_METHODS_TO_AVOID.length).toBeGreaterThan(0)
    WATER_METHODS_TO_AVOID.forEach((item) => {
      expect(item.name.trim().length).toBeGreaterThan(0)
      expect(item.text.trim().length).toBeGreaterThan(0)
    })
  })
})

describe('WATER_TREATMENT_METHODS', () => {
  it('is a non-empty list, each with a method, benefit, and limit', () => {
    expect(WATER_TREATMENT_METHODS.length).toBeGreaterThan(0)
    WATER_TREATMENT_METHODS.forEach((row) => {
      expect(row.method.trim().length).toBeGreaterThan(0)
      expect(row.whatItDoesWell.trim().length).toBeGreaterThan(0)
      expect(row.criticalLimits.trim().length).toBeGreaterThan(0)
    })
  })
})

describe('BOILING_GUIDANCE and SURVIVAL_DECISION_RULE', () => {
  it('are non-empty', () => {
    expect(BOILING_GUIDANCE.trim().length).toBeGreaterThan(0)
    expect(SURVIVAL_DECISION_RULE.length).toBeGreaterThan(0)
    SURVIVAL_DECISION_RULE.forEach((rule) => expect(rule.trim().length).toBeGreaterThan(0))
  })
})
