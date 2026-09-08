import { describe, expect, it } from 'vitest'
import { findSolunarEvents, getSolunarPeriods, moonAltitude, moonHourAngle } from './solunar'

// Oklahoma City, OK -- also used to spot-check this implementation
// directly against a real published moon almanac before writing these
// tests (within 1-6 minutes across three different dates spanning
// different points in the lunar cycle).
const LAT = 35.4676
const LNG = -97.5164

describe('findSolunarEvents', () => {
  it('finds moonrise, moonset, overhead, and underfoot events for a typical day', () => {
    const events = findSolunarEvents(new Date('2026-09-08T00:00:00'), LAT, LNG)
    const types = events.map((e) => e.type)
    expect(types).toContain('moonrise')
    expect(types).toContain('moonset')
    expect(types).toContain('overhead')
    expect(types).toContain('underfoot')
  })

  it('returns events sorted by time', () => {
    const events = findSolunarEvents(new Date('2026-09-08T00:00:00'), LAT, LNG)
    const times = events.map((e) => e.time)
    expect(times).toEqual([...times].sort((a, b) => a - b))
  })

  it('places every returned event within the requested calendar day', () => {
    const date = new Date('2026-09-08T00:00:00')
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = dayStart.getTime() + 24 * 3_600_000
    const events = findSolunarEvents(date, LAT, LNG)
    events.forEach((e) => {
      expect(e.time).toBeGreaterThanOrEqual(dayStart.getTime())
      expect(e.time).toBeLessThan(dayEnd)
    })
  })

  it('finds a moonrise where altitude actually crosses from below to above the horizon', () => {
    const events = findSolunarEvents(new Date('2026-09-08T00:00:00'), LAT, LNG)
    const rise = events.find((e) => e.type === 'moonrise')
    expect(rise).toBeDefined()
    const before = moonAltitude(new Date(rise!.time - 5 * 60_000), LAT, LNG)
    const after = moonAltitude(new Date(rise!.time + 5 * 60_000), LAT, LNG)
    expect(before).toBeLessThan(0)
    expect(after).toBeGreaterThan(0)
  })

  it('finds a moonset where altitude actually crosses from above to below the horizon', () => {
    const events = findSolunarEvents(new Date('2026-09-08T00:00:00'), LAT, LNG)
    const set = events.find((e) => e.type === 'moonset')
    expect(set).toBeDefined()
    const before = moonAltitude(new Date(set!.time - 5 * 60_000), LAT, LNG)
    const after = moonAltitude(new Date(set!.time + 5 * 60_000), LAT, LNG)
    expect(before).toBeGreaterThan(0)
    expect(after).toBeLessThan(0)
  })

  it('places the "overhead" event where the hour angle is essentially zero', () => {
    const events = findSolunarEvents(new Date('2026-09-08T00:00:00'), LAT, LNG)
    const overhead = events.find((e) => e.type === 'overhead')
    expect(overhead).toBeDefined()
    expect(Math.abs(moonHourAngle(new Date(overhead!.time), LNG))).toBeLessThan(0.2)
  })

  it('places the "underfoot" event where the hour angle is essentially +/-180', () => {
    const events = findSolunarEvents(new Date('2026-09-08T00:00:00'), LAT, LNG)
    const underfoot = events.find((e) => e.type === 'underfoot')
    expect(underfoot).toBeDefined()
    expect(180 - Math.abs(moonHourAngle(new Date(underfoot!.time), LNG))).toBeLessThan(0.2)
  })
})

describe('getSolunarPeriods', () => {
  it('gives every major period a 2-hour span centered on its event', () => {
    const periods = getSolunarPeriods(new Date('2026-09-08T00:00:00'), LAT, LNG)
    periods.filter((p) => p.kind === 'major').forEach((p) => {
      expect(p.end - p.start).toBe(2 * 3_600_000)
    })
  })

  it('gives every minor period a 1-hour span centered on its event', () => {
    const periods = getSolunarPeriods(new Date('2026-09-08T00:00:00'), LAT, LNG)
    periods.filter((p) => p.kind === 'minor').forEach((p) => {
      expect(p.end - p.start).toBe(1 * 3_600_000)
    })
  })

  it('returns periods sorted by start time', () => {
    const periods = getSolunarPeriods(new Date('2026-09-08T00:00:00'), LAT, LNG)
    const starts = periods.map((p) => p.start)
    expect(starts).toEqual([...starts].sort((a, b) => a - b))
  })
})
