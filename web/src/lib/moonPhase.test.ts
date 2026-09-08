import { describe, expect, it } from 'vitest'
import { getMoonPhase, moonPhaseIcon } from './moonPhase'

const SYNODIC_MONTH_MS = 29.530588853 * 86_400_000
// The exact reference new moon this module is built around.
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0)

describe('getMoonPhase', () => {
  it('reports New Moon with ~0% illumination right at the reference epoch', () => {
    const result = getMoonPhase(REFERENCE_NEW_MOON_MS)
    expect(result.phase).toBeCloseTo(0, 5)
    expect(result.name).toBe('New Moon')
    expect(result.illuminationPercent).toBeLessThan(5)
  })

  it('reports Full Moon with ~100% illumination half a cycle later', () => {
    const result = getMoonPhase(REFERENCE_NEW_MOON_MS + SYNODIC_MONTH_MS / 2)
    expect(result.phase).toBeCloseTo(0.5, 5)
    expect(result.name).toBe('Full Moon')
    expect(result.illuminationPercent).toBeGreaterThan(95)
  })

  it('wraps correctly for a moment before the reference epoch', () => {
    // One hour before the reference new moon should read as just-about-to
    // be New Moon (near phase 1.0 / 0.0), not throw or go negative.
    const result = getMoonPhase(REFERENCE_NEW_MOON_MS - 60 * 60 * 1000)
    expect(result.phase).toBeGreaterThan(0.99)
    expect(result.name).toBe('New Moon')
  })

  it('always reports the next new moon in the future, within one cycle', () => {
    const now = Date.UTC(2026, 5, 15)
    const result = getMoonPhase(now)
    expect(result.nextNewMoon).toBeGreaterThan(now)
    expect(result.nextNewMoon - now).toBeLessThanOrEqual(SYNODIC_MONTH_MS)
  })

  it('always reports the next full moon in the future, within one cycle', () => {
    const now = Date.UTC(2026, 5, 15)
    const result = getMoonPhase(now)
    expect(result.nextFullMoon).toBeGreaterThan(now)
    expect(result.nextFullMoon - now).toBeLessThanOrEqual(SYNODIC_MONTH_MS)
  })

  it('advances the next-full-moon date once the current cycle\'s full moon has passed', () => {
    const justAfterFull = REFERENCE_NEW_MOON_MS + SYNODIC_MONTH_MS / 2 + 60 * 60 * 1000
    const result = getMoonPhase(justAfterFull)
    // The next full moon should be roughly a full cycle away, not the one
    // that just happened an hour ago.
    expect(result.nextFullMoon - justAfterFull).toBeGreaterThan(SYNODIC_MONTH_MS * 0.9)
  })
})

describe('moonPhaseIcon', () => {
  it('returns a distinct icon for every phase name', () => {
    const names = [
      'New Moon',
      'Waxing Crescent',
      'First Quarter',
      'Waxing Gibbous',
      'Full Moon',
      'Waning Gibbous',
      'Last Quarter',
      'Waning Crescent',
    ] as const
    const icons = names.map(moonPhaseIcon)
    expect(new Set(icons).size).toBe(names.length)
  })
})
