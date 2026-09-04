export interface DailyForecast {
  date: string // YYYY-MM-DD
  tempMaxF: number
  tempMinF: number
  precipitationIn: number
  windMaxMph: number
  weatherCode: number
}

export interface CurrentConditions {
  time: string // local ISO string at the forecast location, e.g. "2026-09-02T16:45"
  temperatureF: number
  windMph: number
  weatherCode: number
}

export interface WeatherResult {
  current: CurrentConditions
  daily: DailyForecast[]
}

interface OpenMeteoResponse {
  current: {
    time: string
    temperature_2m: number
    windspeed_10m: number
    weathercode: number
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    windspeed_10m_max: number[]
    weathercode: number[]
  }
}

export function parseWeatherResponse(json: OpenMeteoResponse): DailyForecast[] {
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, windspeed_10m_max, weathercode } =
    json.daily

  return time.map((date, i) => ({
    date,
    tempMaxF: temperature_2m_max[i],
    tempMinF: temperature_2m_min[i],
    precipitationIn: precipitation_sum[i],
    windMaxMph: windspeed_10m_max[i],
    weatherCode: weathercode[i],
  }))
}

export function parseCurrentConditions(json: OpenMeteoResponse): CurrentConditions {
  return {
    time: json.current.time,
    temperatureF: json.current.temperature_2m,
    windMph: json.current.windspeed_10m,
    weatherCode: json.current.weathercode,
  }
}

/**
 * Formats Open-Meteo's "current.time" for display. With timezone=auto that
 * string is a local wall-clock ISO string with no UTC offset (e.g.
 * "2026-09-02T16:45") — it must NOT be handed to `new Date()`, which would
 * reinterpret those digits in the browser's own timezone instead of the
 * forecast location's, silently shifting the displayed hour whenever the
 * two timezones differ.
 */
export function formatCurrentTime(localIsoTime: string): string {
  const timePart = localIsoTime.split('T')[1]
  if (!timePart) return localIsoTime

  const [hourStr, minuteStr] = timePart.split(':')
  const hour = Number(hourStr)
  if (Number.isNaN(hour)) return localIsoTime

  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minuteStr} ${period}`
}

// WMO Weather interpretation codes, per the official table Open-Meteo uses.
const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mostly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Moderate drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌦️' },
  56: { label: 'Light freezing drizzle', icon: '🌧️' },
  57: { label: 'Dense freezing drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌧️' },
  63: { label: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  66: { label: 'Light freezing rain', icon: '🌨️' },
  67: { label: 'Heavy freezing rain', icon: '🌨️' },
  71: { label: 'Slight snow', icon: '🌨️' },
  73: { label: 'Moderate snow', icon: '🌨️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Moderate rain showers', icon: '🌦️' },
  82: { label: 'Violent rain showers', icon: '⛈️' },
  85: { label: 'Slight snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm, slight hail', icon: '⛈️' },
  99: { label: 'Thunderstorm, heavy hail', icon: '⛈️' },
}

export function weatherCodeInfo(code: number): { label: string; icon: string } {
  return WEATHER_CODES[code] ?? { label: 'Unknown', icon: '❔' }
}

export function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today'
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

const OPEN_METEO_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

export async function fetchWeather(lat: number, lng: number): Promise<WeatherResult> {
  const url = new URL(OPEN_METEO_ENDPOINT)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lng))
  url.searchParams.set('current', 'temperature_2m,windspeed_10m,weathercode')
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode',
  )
  url.searchParams.set('temperature_unit', 'fahrenheit')
  url.searchParams.set('windspeed_unit', 'mph')
  url.searchParams.set('precipitation_unit', 'inch')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '7')

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error('Weather request failed')
  const json = (await response.json()) as OpenMeteoResponse
  return { current: parseCurrentConditions(json), daily: parseWeatherResponse(json) }
}
