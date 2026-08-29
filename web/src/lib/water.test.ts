import { describe, expect, it } from 'vitest'
import { waterTypeIcon, waterTypeLabel, type WaterType } from './water'

const ALL_TYPES: WaterType[] = ['river', 'stream', 'canal', 'pond', 'lake', 'reservoir', 'water']

describe('waterTypeLabel', () => {
  it.each(ALL_TYPES)('returns a non-empty label for %s', (type) => {
    expect(waterTypeLabel(type).length).toBeGreaterThan(0)
  })
})

describe('waterTypeIcon', () => {
  it.each(ALL_TYPES)('returns a non-empty icon for %s', (type) => {
    expect(waterTypeIcon(type).length).toBeGreaterThan(0)
  })
})
