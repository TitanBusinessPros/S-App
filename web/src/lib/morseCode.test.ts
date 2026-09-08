import { describe, expect, it } from 'vitest'
import { buildSosPattern } from './morseCode'

describe('buildSosPattern', () => {
  it('produces the correct on/off sequence for S-O-S', () => {
    const segments = buildSosPattern(100)
    expect(segments.map((s) => s.on)).toEqual([
      true, false, true, false, true, false, // S: dot gap dot gap dot, letter-gap
      true, false, true, false, true, false, // O: dash gap dash gap dash, letter-gap
      true, false, true, false, true, false, // S: dot gap dot gap dot, repeat-gap
    ])
  })

  it('starts with a dot and ends with the longer inter-repeat pause', () => {
    const segments = buildSosPattern(100)
    expect(segments[0]).toEqual({ on: true, ms: 100 })
    expect(segments.at(-1)).toEqual({ on: false, ms: 700 })
  })

  it('gives dashes three times the duration of dots', () => {
    const segments = buildSosPattern(100)
    const dot = segments[0].ms
    const dash = segments[6].ms // first "on" segment of the O
    expect(dash).toBe(dot * 3)
  })

  it('scales every duration proportionally with the unit length', () => {
    const short = buildSosPattern(50)
    const long = buildSosPattern(200)
    for (let i = 0; i < short.length; i++) {
      expect(long[i].ms).toBe(short[i].ms * 4)
    }
  })
})
