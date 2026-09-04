import { describe, expect, it } from 'vitest'
import { waterTypeIcon, waterTypeLabel, type WaterType } from './water'

const ALL_TYPES: WaterType[] = ['river', 'canal', 'lake', 'ocean', 'spring', 'drainageway']

describe('waterTypeLabel', () => {
  it.each(ALL_TYPES)('returns a non-empty label for %s', (type) => {
    expect(waterTypeLabel(type).length).toBeGreaterThan(0)
  })

  it('never calls a lake-class waterbody a "pond" — USGS has no distinct pond class', () => {
    expect(waterTypeLabel('lake').toLowerCase()).not.toContain('pond')
    expect(waterTypeLabel('lake')).toBe('Lake-class waterbody')
  })
})

describe('waterTypeIcon', () => {
  it.each(ALL_TYPES)('returns a non-empty icon for %s', (type) => {
    expect(waterTypeIcon(type).length).toBeGreaterThan(0)
  })
})
