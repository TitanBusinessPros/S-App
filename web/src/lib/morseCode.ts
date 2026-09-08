// Pure timing math for the SOS distress signal in Morse code -- no audio
// files, no external data. A dot is 1 unit, a dash is 3 units, gaps within
// a letter are 1 unit, gaps between letters are 3 units, and the pause
// before the whole message repeats is 7 units (standard Morse timing).

export const DEFAULT_UNIT_MS = 200

// S-O-S: three dots, three dashes, three dots.
const SOS_LETTERS: number[][] = [
  [1, 1, 1],
  [3, 3, 3],
  [1, 1, 1],
]

export interface MorseSegment {
  /** true = flash/tone on for this segment, false = silent/dark. */
  on: boolean
  ms: number
}

/**
 * One full "SOS" cycle as a sequence of on/off segments, ending with the
 * inter-repeat pause. Meant to be played back-to-back in a loop.
 */
export function buildSosPattern(unitMs: number = DEFAULT_UNIT_MS): MorseSegment[] {
  const segments: MorseSegment[] = []
  SOS_LETTERS.forEach((letter, letterIndex) => {
    letter.forEach((symbolUnits, symbolIndex) => {
      segments.push({ on: true, ms: symbolUnits * unitMs })
      if (symbolIndex < letter.length - 1) {
        segments.push({ on: false, ms: unitMs }) // gap within the letter
      }
    })
    const isLastLetter = letterIndex === SOS_LETTERS.length - 1
    segments.push({ on: false, ms: (isLastLetter ? 7 : 3) * unitMs })
  })
  return segments
}
