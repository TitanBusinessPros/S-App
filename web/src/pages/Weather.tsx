import { useEffect, useState } from 'react'
import { Shell } from '../components/Shell'
import { useGeolocation } from '../lib/useGeolocation'
import { fetchLocationName } from '../lib/functionsApi'
import { fetchWeather, formatCurrentTime, formatDayLabel, weatherCodeInfo, type WeatherResult } from '../lib/weather'
import './Weather.css'

export function Weather() {
  const { coords, loading: locating, error: locationError, locate } = useGeolocation()
  const [weather, setWeather] = useState<WeatherResult | null>(null)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [locality, setLocality] = useState<string | null>(null)

  useEffect(() => {
    locate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!coords) return
    let cancelled = false
    setFetching(true)
    setFetchError(null)
    setLocality(null)

    fetchWeather(coords.lat, coords.lng)
      .then((result) => {
        if (!cancelled) setWeather(result)
      })
      .catch(() => {
        if (!cancelled) setFetchError('Could not load the forecast. Try again in a moment.')
      })
      .finally(() => {
        if (!cancelled) setFetching(false)
      })

    // Non-fatal: a failed/absent locality just keeps the generic heading —
    // it never blocks or breaks the actual forecast above.
    fetchLocationName(coords.lat, coords.lng)
      .then((result) => {
        if (!cancelled) setLocality(result.locality)
      })
      .catch(() => {
        /* keep the generic heading */
      })

    return () => {
      cancelled = true
    }
  }, [coords])

  return (
    <Shell>
      <div className="weather-header">
        <h1>{locality ? `Weather for ${locality}` : '7-Day Weather'}</h1>
        <p>Forecast for your current location — useful for planning shelter, water, and travel.</p>
      </div>

      {!coords && (
        <div className="card weather-state">
          {locationError ? <p className="login-error">{locationError}</p> : <p>Locating you…</p>}
          <button type="button" className="btn btn-primary" onClick={locate}>
            {locating ? 'Locating…' : 'Try again'}
          </button>
        </div>
      )}

      {coords && fetching && (
        <div className="card weather-state">
          <p>Loading forecast…</p>
        </div>
      )}

      {coords && fetchError && (
        <div className="card weather-state">
          <p className="login-error">{fetchError}</p>
          <button type="button" className="btn btn-primary" onClick={locate}>
            Retry
          </button>
        </div>
      )}

      {coords && !fetching && !fetchError && weather && (
        <>
          <div className="card weather-current">
            <div className="weather-current-top">
              <span className="weather-current-label">Right now</span>
              <span className="weather-current-source">
                Data: Open-Meteo · Updated {formatCurrentTime(weather.current.time)} local time
              </span>
            </div>
            <div className="weather-current-body">
              <span className="weather-current-icon">{weatherCodeInfo(weather.current.weatherCode).icon}</span>
              <span className="weather-current-temp mono">{Math.round(weather.current.temperatureF)}°</span>
              <span className="weather-current-condition">{weatherCodeInfo(weather.current.weatherCode).label}</span>
              <span className="weather-current-wind">💨 {Math.round(weather.current.windMph)} mph</span>
            </div>
          </div>

          <div className="weather-grid">
            {weather.daily.map((day, i) => {
              const info = weatherCodeInfo(day.weatherCode)
              return (
                <div key={day.date} className="card weather-day">
                  <span className="weather-day-label">{formatDayLabel(day.date, i)}</span>
                  <span className="weather-day-icon">{info.icon}</span>
                  <span className="weather-day-condition">{info.label}</span>
                  <span className="weather-day-temps mono">
                    {Math.round(day.tempMaxF)}° <span className="lo">{Math.round(day.tempMinF)}°</span>
                  </span>
                  {day.precipitationIn > 0 && (
                    <span className="weather-day-detail">💧 {day.precipitationIn.toFixed(2)}"</span>
                  )}
                  <span className="weather-day-detail">💨 {Math.round(day.windMaxMph)} mph</span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </Shell>
  )
}
