import { useEffect, useRef, useState } from 'react'
import { Shell } from '../components/Shell'
import { headingToCardinal, polarisAltitudeFromLatitude } from '../lib/compass'
import './Compass.css'

type PermissionState = 'unknown' | 'needed' | 'granted' | 'denied' | 'unsupported'

// iOS requires an explicit user gesture + permission grant to read
// orientation sensors; other platforms fire events without asking.
function needsExplicitPermission() {
  return (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
      .requestPermission === 'function'
  )
}

export function Compass() {
  const [heading, setHeading] = useState<number | null>(null)
  const [permission, setPermission] = useState<PermissionState>('unknown')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [sensorTimedOut, setSensorTimedOut] = useState(false)
  const headingRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setPermission('unsupported')
      return
    }
    if (!needsExplicitPermission()) {
      setPermission('granted')
    } else {
      setPermission('needed')
    }
  }, [])

  useEffect(() => {
    if (permission !== 'granted') return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading (Safari/iOS) is already a true compass heading;
      // otherwise fall back to alpha (which is heading-from-device-start,
      // not a true compass heading, but the best cross-browser option).
      const webkitHeading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
        .webkitCompassHeading
      const value = webkitHeading ?? (event.alpha != null ? 360 - event.alpha : null)
      if (value != null) {
        headingRef.current = value
        setSensorTimedOut(false)
        setHeading(value)
      }
    }

    const eventName = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation'
    window.addEventListener(eventName, handleOrientation as EventListener)
    return () => window.removeEventListener(eventName, handleOrientation as EventListener)
  }, [permission])

  // Most laptops/desktops don't expose a magnetometer to the browser at
  // all — no error is thrown, the event just never fires. Without this,
  // that reads as "the compass is broken" instead of "no sensor here."
  useEffect(() => {
    if (permission !== 'granted') return
    setSensorTimedOut(false)
    const timer = window.setTimeout(() => {
      if (headingRef.current == null) setSensorTimedOut(true)
    }, 4000)
    return () => window.clearTimeout(timer)
  }, [permission])

  const requestPermission = async () => {
    try {
      const result = await (
        DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
      ).requestPermission()
      setPermission(result === 'granted' ? 'granted' : 'denied')
    } catch {
      setPermission('denied')
    }
  }

  const requestLocation = () => {
    setLocationError(null)
    if (!('geolocation' in navigator)) {
      setLocationError('Location is not available on this device.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLatitude(pos.coords.latitude),
      () => setLocationError('Location permission was denied.'),
    )
  }

  const polarisAltitude = latitude != null ? polarisAltitudeFromLatitude(latitude) : null

  return (
    <Shell>
      <div className="compass-header">
        <h1>Compass</h1>
        <p>A magnetic compass plus how to find true north from the stars if your battery dies.</p>
      </div>

      <div className="compass-layout">
        <div className="card compass-dial-card">
          <div className="compass-dial-wrap">
            <span className="compass-needle-fixed">▲</span>
            <svg
              className="compass-dial"
              viewBox="0 0 200 200"
              style={{ transform: `rotate(${heading != null ? -heading : 0}deg)` }}
            >
              <circle cx="100" cy="100" r="96" fill="var(--bg-elevated)" stroke="var(--border-bright)" strokeWidth="2" />
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = i * 10
                const isCardinal = angle % 90 === 0
                const r1 = 96
                const r2 = isCardinal ? 82 : 88
                const rad = (angle * Math.PI) / 180
                return (
                  <line
                    key={angle}
                    x1={100 + r1 * Math.sin(rad)}
                    y1={100 - r1 * Math.cos(rad)}
                    x2={100 + r2 * Math.sin(rad)}
                    y2={100 - r2 * Math.cos(rad)}
                    stroke={isCardinal ? 'var(--accent)' : 'var(--border-bright)'}
                    strokeWidth={isCardinal ? 2 : 1}
                  />
                )
              })}
              <text x="100" y="26" textAnchor="middle" fill="var(--text)" fontSize="16" fontWeight="700">N</text>
              <text x="180" y="106" textAnchor="middle" fill="var(--text-dim)" fontSize="14">E</text>
              <text x="100" y="182" textAnchor="middle" fill="var(--text-dim)" fontSize="14">S</text>
              <text x="20" y="106" textAnchor="middle" fill="var(--text-dim)" fontSize="14">W</text>
            </svg>
          </div>

          {permission === 'needed' && (
            <button type="button" className="btn btn-primary compass-enable-btn" onClick={requestPermission}>
              Enable Compass
            </button>
          )}

          {permission === 'granted' && (
            <div className="compass-reading">
              <div className="compass-heading-num mono">
                {heading != null ? `${Math.round(heading)}°` : '—'}
              </div>
              <div className="compass-heading-dir mono">
                {heading != null
                  ? headingToCardinal(heading)
                  : sensorTimedOut
                    ? 'No compass sensor found'
                    : 'Waiting for sensor…'}
              </div>
            </div>
          )}

          {permission === 'granted' && heading == null && sensorTimedOut && (
            <p className="compass-note">
              This browser/device isn't sending compass data — most laptops and desktops don't have a
              magnetometer. Open this page on a phone to use the live compass.
            </p>
          )}

          {permission === 'unsupported' && (
            <p className="compass-note">
              This device/browser doesn't expose an orientation sensor — try this on a phone.
            </p>
          )}
          {permission === 'denied' && (
            <p className="compass-note">
              Compass permission was denied. Enable motion &amp; orientation access in your browser settings to use it.
            </p>
          )}

          <p className="compass-note">
            Shows <strong>magnetic</strong> north from your device's sensor. Magnetic north differs slightly
            from true north depending on where you are (declination) — the star method on the right gives you
            true north directly.
          </p>
        </div>

        <div className="card star-card">
          <h2>🌌 Find True North by the Stars</h2>
          <p>Works in the Northern Hemisphere, at night, with a clear view of the sky.</p>

          <ol className="star-steps">
            <li>Find the Big Dipper (seven bright stars in a ladle shape).</li>
            <li>The two stars forming the outer edge of the "cup" are the pointer stars.</li>
            <li>Draw an imaginary line through them, extending roughly 5x their distance apart.</li>
            <li>That line lands on Polaris — the North Star. It doesn't move all night; it marks true north.</li>
          </ol>

          {latitude == null ? (
            <button type="button" className="btn location-btn" onClick={requestLocation}>
              Use my location for Polaris height
            </button>
          ) : polarisAltitude != null ? (
            <div className="star-fact">
              <span className="star-fact-num mono">{polarisAltitude.toFixed(1)}°</span>
              <span className="star-fact-label">
                Polaris's height above your horizon here — it's always equal to your latitude.
              </span>
            </div>
          ) : (
            <p className="compass-note">
              You're in the Southern Hemisphere — Polaris isn't visible. Use the Southern Cross instead: extend
              its long axis about 4.5x its length, then drop straight down to the horizon — that's south.
            </p>
          )}
          {locationError && <p className="login-error">{locationError}</p>}
        </div>
      </div>
    </Shell>
  )
}
