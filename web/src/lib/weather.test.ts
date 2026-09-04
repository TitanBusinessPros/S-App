import { describe, expect, it } from 'vitest'
import { formatCurrentTime, formatDayLabel, parseCurrentConditions, parseWeatherResponse, weatherCodeInfo } from './weather'

describe('parseWeatherResponse', () => {
  it('zips the parallel daily arrays into per-day objects', () => {
    const result = parseWeatherResponse({
      current: { time: '2026-08-29T12:00', temperature_2m: 90, windspeed_10m: 10, weathercode: 0 },
      daily: {
        time: ['2026-08-29', '2026-08-30'],
        temperature_2m_max: [95, 91],
        temperature_2m_min: [72, 70],
        precipitation_sum: [0, 0.4],
        windspeed_10m_max: [12, 18],
        weathercode: [0, 61],
      },
    })

    expect(result).toEqual([
      { date: '2026-08-29', tempMaxF: 95, tempMinF: 72, precipitationIn: 0, windMaxMph: 12, weatherCode: 0 },
      { date: '2026-08-30', tempMaxF: 91, tempMinF: 70, precipitationIn: 0.4, windMaxMph: 18, weatherCode: 61 },
    ])
  })
})

describe('parseCurrentConditions', () => {
  it('extracts the current-conditions block', () => {
    const result = parseCurrentConditions({
      current: { time: '2026-09-02T16:45', temperature_2m: 88, windspeed_10m: 9, weathercode: 1 },
      daily: {
        time: [],
        temperature_2m_max: [],
        temperature_2m_min: [],
        precipitation_sum: [],
        windspeed_10m_max: [],
        weathercode: [],
      },
    })

    expect(result).toEqual({ time: '2026-09-02T16:45', temperatureF: 88, windMph: 9, weatherCode: 1 })
  })
})

describe('formatCurrentTime', () => {
  it('formats a local ISO time string without reinterpreting it via Date()', () => {
    expect(formatCurrentTime('2026-09-02T16:45')).toBe('4:45 PM')
  })

  it('handles midnight and noon boundaries', () => {
    expect(formatCurrentTime('2026-09-02T00:05')).toBe('12:05 AM')
    expect(formatCurrentTime('2026-09-02T12:00')).toBe('12:00 PM')
  })

  it('falls back to the raw string if it has no time component', () => {
    expect(formatCurrentTime('not-a-time')).toBe('not-a-time')
  })
})

describe('weatherCodeInfo', () => {
  it('resolves known WMO codes to a label + icon', () => {
    expect(weatherCodeInfo(0)).toEqual({ label: 'Clear sky', icon: '☀️' })
    expect(weatherCodeInfo(95)).toEqual({ label: 'Thunderstorm', icon: '⛈️' })
  })

  it('falls back gracefully for an unrecognized code', () => {
    expect(weatherCodeInfo(-1)).toEqual({ label: 'Unknown', icon: '❔' })
  })
})

describe('formatDayLabel', () => {
  it('labels the first day as Today regardless of date', () => {
    expect(formatDayLabel('2026-08-29', 0)).toBe('Today')
  })

  it('labels later days with their weekday', () => {
    // 2026-08-30 is a Sunday
    expect(formatDayLabel('2026-08-30', 1)).toBe('Sun')
  })
})
