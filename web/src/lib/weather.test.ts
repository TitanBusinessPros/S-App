import { describe, expect, it } from 'vitest'
import { formatDayLabel, parseWeatherResponse, weatherCodeInfo } from './weather'

describe('parseWeatherResponse', () => {
  it('zips the parallel daily arrays into per-day objects', () => {
    const result = parseWeatherResponse({
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
