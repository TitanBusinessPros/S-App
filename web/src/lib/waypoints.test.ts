import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  bearingDegrees,
  breadcrumbSpacingThreshold,
  formatDistance,
  haversineMeters,
  loadBreadcrumbTrail,
  loadWaypoints,
  makeId,
  MIN_BREADCRUMB_SPACING_METERS,
  projectToLocalMeters,
  saveBreadcrumbTrail,
  saveWaypoints,
  totalTrailDistance,
  type BreadcrumbPoint,
  type Waypoint,
} from './waypoints'

afterEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

describe('haversineMeters', () => {
  it('returns 0 for identical points', () => {
    expect(haversineMeters(35, -97, 35, -97)).toBe(0)
  })

  it('is close to 111,320 m for one degree of latitude', () => {
    const meters = haversineMeters(0, 0, 1, 0)
    expect(meters).toBeGreaterThan(110_000)
    expect(meters).toBeLessThan(112_000)
  })
})

describe('bearingDegrees', () => {
  it('reads due north as 0', () => {
    expect(bearingDegrees(0, 0, 1, 0)).toBeCloseTo(0, 0)
  })

  it('reads due east as 90', () => {
    expect(bearingDegrees(0, 0, 0, 1)).toBeCloseTo(90, 0)
  })

  it('reads due south as 180', () => {
    expect(bearingDegrees(0, 0, -1, 0)).toBeCloseTo(180, 0)
  })

  it('reads due west as 270', () => {
    expect(bearingDegrees(0, 0, 0, -1)).toBeCloseTo(270, 0)
  })
})

describe('formatDistance', () => {
  it('shows feet under a tenth of a mile', () => {
    expect(formatDistance(30)).toBe('98 ft')
  })

  it('shows miles at and beyond a tenth of a mile', () => {
    expect(formatDistance(1609.344)).toBe('1.00 mi')
  })
})

describe('breadcrumbSpacingThreshold', () => {
  it('falls back to the floor when accuracy is unknown', () => {
    expect(breadcrumbSpacingThreshold(null)).toBe(MIN_BREADCRUMB_SPACING_METERS)
  })

  it('stays at the floor when the GPS fix is more accurate than it', () => {
    expect(breadcrumbSpacingThreshold(5)).toBe(MIN_BREADCRUMB_SPACING_METERS)
  })

  it('rises to match a worse-than-floor accuracy — this is the fix for the ' +
    'bug where standing still with noisy GPS read as having walked', () => {
    expect(breadcrumbSpacingThreshold(50)).toBe(50)
  })
})

describe('totalTrailDistance', () => {
  it('is 0 for fewer than two points', () => {
    expect(totalTrailDistance([])).toBe(0)
    expect(totalTrailDistance([{ lat: 0, lng: 0, timestamp: 1 }])).toBe(0)
  })

  it('sums consecutive-point distances', () => {
    const points: BreadcrumbPoint[] = [
      { lat: 0, lng: 0, timestamp: 1 },
      { lat: 1, lng: 0, timestamp: 2 },
      { lat: 1, lng: 1, timestamp: 3 },
    ]
    const expected =
      haversineMeters(0, 0, 1, 0) + haversineMeters(1, 0, 1, 1)
    expect(totalTrailDistance(points)).toBeCloseTo(expected, 3)
  })
})

describe('projectToLocalMeters', () => {
  it('maps the origin to (0, 0)', () => {
    expect(projectToLocalMeters(35, -97, 35, -97)).toEqual({ x: 0, y: 0 })
  })

  it('maps a point one degree north to a large positive y and ~0 x', () => {
    const { x, y } = projectToLocalMeters(1, 0, 0, 0)
    expect(x).toBeCloseTo(0, 6)
    expect(y).toBeGreaterThan(110_000)
  })
})

describe('makeId', () => {
  it('returns a non-empty string, unique across calls', () => {
    const a = makeId()
    const b = makeId()
    expect(a).toEqual(expect.any(String))
    expect(a.length).toBeGreaterThan(0)
    expect(a).not.toBe(b)
  })
})

describe('waypoint storage', () => {
  it('round-trips through localStorage', () => {
    const waypoints: Waypoint[] = [{ id: '1', label: 'Camp', lat: 35, lng: -97, createdAt: 123 }]
    saveWaypoints(waypoints)
    expect(loadWaypoints()).toEqual(waypoints)
  })

  it('returns an empty array when nothing is saved', () => {
    expect(loadWaypoints()).toEqual([])
  })

  it('falls back to an empty array if localStorage throws', () => {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(loadWaypoints()).toEqual([])
  })
})

describe('breadcrumb trail storage', () => {
  it('round-trips through localStorage', () => {
    const trail: BreadcrumbPoint[] = [{ lat: 35, lng: -97, timestamp: 123 }]
    saveBreadcrumbTrail(trail)
    expect(loadBreadcrumbTrail()).toEqual(trail)
  })

  it('returns an empty array when nothing is saved', () => {
    expect(loadBreadcrumbTrail()).toEqual([])
  })
})
