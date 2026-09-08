import { useEffect, useRef, useState } from 'react'
import { Shell } from '../components/Shell'
import { buildSosPattern } from '../lib/morseCode'
import '../components/PageHeader.css'
import './SosBeacon.css'

const TONE_HZ = 800
const TONE_GAIN = 0.2

export function SosBeacon() {
  const [active, setActive] = useState(false)
  const [flashOn, setFlashOn] = useState(false)

  const timeoutRef = useRef<number | null>(null)
  const segmentIndexRef = useRef(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  // navigator.wakeLock isn't in every TS lib target yet; feature-detected
  // at runtime either way, so this is a narrow, deliberate `any`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wakeLockRef = useRef<any>(null)

  function stop() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setFlashOn(false)
    setActive(false)

    oscillatorRef.current?.stop()
    oscillatorRef.current?.disconnect()
    oscillatorRef.current = null
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    gainRef.current = null

    wakeLockRef.current?.release().catch(() => {})
    wakeLockRef.current = null
  }

  // Cleanup if the user navigates away mid-signal.
  useEffect(() => stop, [])

  async function start() {
    const segments = buildSosPattern()
    segmentIndexRef.current = 0

    const AudioCtxClass = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtxClass()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.frequency.value = TONE_HZ
    gain.gain.value = 0
    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start()

    audioCtxRef.current = ctx
    oscillatorRef.current = oscillator
    gainRef.current = gain

    // Non-fatal if unsupported (Safari didn't have this for a long time) --
    // the signal still runs, the screen just might dim/sleep sooner.
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as unknown as { wakeLock: { request: (type: 'screen') => Promise<unknown> } }).wakeLock.request('screen')
      }
    } catch {
      // ignore
    }

    setActive(true)

    const playNext = () => {
      const seg = segments[segmentIndexRef.current % segments.length]
      setFlashOn(seg.on)
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setValueAtTime(seg.on ? TONE_GAIN : 0, audioCtxRef.current.currentTime)
      }
      segmentIndexRef.current += 1
      timeoutRef.current = window.setTimeout(playNext, seg.ms)
    }
    playNext()
  }

  return (
    <Shell>
      <div className="map-header">
        <h1>SOS Beacon</h1>
        <p>Flashes your screen and plays a tone in Morse code SOS — the internationally recognized distress signal.</p>
      </div>

      <p className="map-disclosure">
        A phone screen is much dimmer than a flare or flashlight — this helps at night, at moderate range, if
        someone is already looking your way. It is not a substitute for real signaling equipment.
      </p>

      {!active && (
        <div className="card sos-beacon-card">
          <p>Turn your volume all the way up before starting.</p>
          <button type="button" className="btn btn-primary sos-beacon-start" onClick={start}>
            🆘 Start SOS Signal
          </button>
        </div>
      )}

      {active && (
        <div className={`sos-beacon-overlay ${flashOn ? 'sos-beacon-flash-on' : 'sos-beacon-flash-off'}`}>
          <button type="button" className="btn btn-danger sos-beacon-stop" onClick={stop}>
            Stop
          </button>
        </div>
      )}
    </Shell>
  )
}
