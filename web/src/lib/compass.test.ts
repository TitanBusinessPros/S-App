import { describe, expect, it } from 'vitest'
import { headingToCardinal, normalizeHeading, polarisAltitudeFromLatitude } from './compass'

describe('normalizeHeading', () => {
  it('leaves in-range headings unchanged', () => {
    expect(normalizeHeading(90)).toBe(90)
  })

  it('wraps negative headings into [0, 360)', () => {
    expect(normalizeHeading(-10)).toBe(350)
  })

  it('wraps headings over 360 back into range', () => {
    expect(normalizeHeading(370)).toBe(10)
  })
})

describe('headingToCardinal', () => {
  it.each([
    [0, 'N'],
    [45, 'NE'],
    [90, 'E'],
    [180, 'S'],
    [270, 'W'],
    [359, 'N'],
    [-90, 'W'],
  ])('maps %i degrees to %s', (heading, expected) => {
    expect(headingToCardinal(heading)).toBe(expected)
  })
})

describe('polarisAltitudeFromLatitude', () => {
  it('equals latitude for northern hemisphere locations', () => {
    expect(polarisAltitudeFromLatitude(35.5)).toBe(35.5)
  })

  it('caps at 90 degrees at the north pole', () => {
    expect(polarisAltitudeFromLatitude(90)).toBe(90)
  })

  it('returns null in the southern hemisphere (Polaris is not visible)', () => {
    expect(polarisAltitudeFromLatitude(-20)).toBeNull()
  })
})
