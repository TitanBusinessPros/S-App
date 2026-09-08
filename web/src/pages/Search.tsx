import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell'
import { search, type SearchItem } from '../lib/searchIndex'
import '../components/PageHeader.css'
import './Search.css'

// The Web Speech API's SpeechRecognition isn't in every TS DOM lib target
// yet, and is vendor-prefixed on some browsers (webkitSpeechRecognition) --
// feature-detected at runtime either way, so this is a narrow, deliberate
// `any` rather than a real type gap in app code.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionLike = any

function getSpeechRecognitionClass(): SpeechRecognitionLike | null {
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionLike; webkitSpeechRecognition?: SpeechRecognitionLike }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  // Feature-detected once -- this app runs on browsers with wildly
  // different support for this API (notably: Firefox has essentially
  // none). No voice button at all beats one that silently does nothing.
  const [voiceSupported] = useState(() => getSpeechRecognitionClass() !== null)

  useEffect(() => {
    setResults(search(query))
  }, [query])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  function startListening() {
    const RecognitionClass = getSpeechRecognitionClass()
    if (!RecognitionClass) return

    setVoiceError(null)
    const recognition = new RecognitionClass()
    recognition.lang = navigator.language || 'en-US'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onresult = (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ')
      setQuery(transcript)
    }
    recognition.onerror = (event: { error: string }) => {
      setVoiceError(
        event.error === 'not-allowed'
          ? 'Microphone permission was denied.'
          : event.error === 'no-speech'
            ? "Didn't catch that — try again."
            : 'Voice search failed. You can still type your search.',
      )
      setListening(false)
    }
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return (
    <Shell>
      <div className="map-header">
        <h1>Search</h1>
        <p>Search every guide in the app at once — First Aid, Shelter, Finding Water, Snares, Topography, and Recipes.</p>
      </div>

      <div className="search-bar-row">
        <input
          type="search"
          className="search-input"
          placeholder="Search, or tap the mic to speak…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {voiceSupported && (
          <button
            type="button"
            className={`btn search-mic-btn${listening ? ' search-mic-btn-active' : ''}`}
            onClick={listening ? stopListening : startListening}
            aria-label={listening ? 'Stop voice search' : 'Search by voice'}
            title={listening ? 'Stop voice search' : 'Search by voice'}
          >
            {listening ? '🔴' : '🎤'}
          </button>
        )}
      </div>

      {!voiceSupported && (
        <p className="map-disclosure">🎤 Voice search isn't supported in this browser — typing still works fine.</p>
      )}
      {voiceError && <p className="map-disclosure map-disclosure-offline">{voiceError}</p>}
      {listening && <p className="map-disclosure">🎤 Listening…</p>}

      {query.trim() && (
        <p className="search-result-count">
          {results.length} result{results.length === 1 ? '' : 's'}
        </p>
      )}

      <ul className="search-results-list">
        {results.map((item, i) => (
          <li key={`${item.route}-${i}`}>
            <Link to={item.route} className="card search-result-card">
              <span className="search-result-category">{item.category}</span>
              <h3>{item.title}</h3>
              <p className="search-result-snippet">{item.snippet}</p>
            </Link>
          </li>
        ))}
      </ul>

      {query.trim() && results.length === 0 && <p className="feature-list-empty">No results for "{query}".</p>}
    </Shell>
  )
}
