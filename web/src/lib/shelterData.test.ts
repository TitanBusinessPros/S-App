import { describe, expect, it } from 'vitest'
import { SHELTER_DESIGNS, SHELTERS_NOT_RECOMMENDED, UNIVERSAL_SHELTER_RULES } from './shelterData'

describe('UNIVERSAL_SHELTER_RULES', () => {
  it('has at least one rule, each with a title and at least one bullet', () => {
    expect(UNIVERSAL_SHELTER_RULES.length).toBeGreaterThan(0)
    UNIVERSAL_SHELTER_RULES.forEach((rule) => {
      expect(rule.title.trim().length).toBeGreaterThan(0)
      expect(rule.bullets.length).toBeGreaterThan(0)
      rule.bullets.forEach((bullet) => expect(bullet.trim().length).toBeGreaterThan(0))
    })
  })
})

describe('SHELTER_DESIGNS', () => {
  it('has exactly 15 designs, numbered sequentially from 1 with no gaps or duplicates', () => {
    expect(SHELTER_DESIGNS.length).toBe(15)
    const numbers = SHELTER_DESIGNS.map((design) => design.num)
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
    expect(new Set(numbers).size).toBe(numbers.length)
    expect(numbers[0]).toBe(1)
    expect(numbers[numbers.length - 1]).toBe(15)
  })

  it('gives every design a name, emoji, best-for, needs, at least one build step, and a key detail', () => {
    SHELTER_DESIGNS.forEach((design) => {
      expect(design.name.trim().length).toBeGreaterThan(0)
      expect(design.emoji.trim().length).toBeGreaterThan(0)
      expect(design.bestFor.trim().length).toBeGreaterThan(0)
      expect(design.needs.trim().length).toBeGreaterThan(0)
      expect(design.buildSteps.length).toBeGreaterThan(0)
      design.buildSteps.forEach((step) => expect(step.trim().length).toBeGreaterThan(0))
      expect(design.keyDetail.trim().length).toBeGreaterThan(0)
    })
  })

  it('has a unique name per design', () => {
    const names = SHELTER_DESIGNS.map((design) => design.name)
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('SHELTERS_NOT_RECOMMENDED', () => {
  it('is a non-empty list of non-empty warnings', () => {
    expect(SHELTERS_NOT_RECOMMENDED.length).toBeGreaterThan(0)
    SHELTERS_NOT_RECOMMENDED.forEach((warning) => expect(warning.trim().length).toBeGreaterThan(0))
  })
})
