import { describe, expect, it } from 'vitest'
import { computeCacheKey, findSavedAreaFor, isSavedAreaStale, type SavedWaterArea } from './savedWaterAreas'

function area(overrides: Partial<SavedWaterArea>): SavedWaterArea {
  return {
    id: 'x',
    cacheKey: '35.50_-97.50_10',
    lat: 35.5,
    lng: -97.5,
    radiusMiles: 10,
    searchedRadiusMiles: 10,
    features: [],
    count: 0,
    totalFound: 0,
    resultComplete: true,
    source: 'usgs-3dhp',
    attribution: 'Credits: USGS TNM / NGTOC',
    sourceRefreshDate: 'August 5, 2026',
    savedAt: Date.now(),
    fetchedAt: Date.now(),
    schemaVersion: 1,
    label: 'Near 35.500, -97.500 (10 mi)',
    ...overrides,
  }
}

describe('computeCacheKey', () => {
  it('rounds lat/lng to 2 decimal places and includes the exact radius', () => {
    expect(computeCacheKey(35.46761, -97.51642, 10)).toBe('35.47_-97.52_10')
  })

  it('produces the same key for coordinates that round the same way (cache-hit case)', () => {
    expect(computeCacheKey(35.4676, -97.5164, 10)).toBe(computeCacheKey(35.4699, -97.5151, 10))
  })

  it('produces a different key for a different radius', () => {
    expect(computeCacheKey(35.5, -97.5, 10)).not.toBe(computeCacheKey(35.5, -97.5, 25))
  })
})

describe('isSavedAreaStale', () => {
  it('is not stale when just fetched', () => {
    expect(isSavedAreaStale(area({ fetchedAt: Date.now() }))).toBe(false)
  })

  it('is stale after more than 30 days', () => {
    const thirtyOneDaysAgo = Date.now() - 31 * 24 * 60 * 60 * 1000
    expect(isSavedAreaStale(area({ fetchedAt: thirtyOneDaysAgo }))).toBe(true)
  })
})

describe('findSavedAreaFor', () => {
  it('finds a saved area matching the exact lat/lng/radius cache key', () => {
    const saved = area({ id: 'a', lat: 35.5, lng: -97.5, radiusMiles: 10 })
    expect(findSavedAreaFor([saved], 35.5, -97.5, 10)?.id).toBe('a')
  })

  it('returns undefined when nothing matches', () => {
    const saved = area({ id: 'a', lat: 35.5, lng: -97.5, radiusMiles: 10 })
    expect(findSavedAreaFor([saved], 40.0, -100.0, 10)).toBeUndefined()
    expect(findSavedAreaFor([saved], 35.5, -97.5, 25)).toBeUndefined()
  })
})
