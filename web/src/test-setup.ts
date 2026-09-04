import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom doesn't implement matchMedia — installPrompt.ts (imported at module
// scope by anything that renders Shell) calls it to check
// `(display-mode: standalone)`. Without this, importing that module in a
// test crashes with "window.matchMedia is not a function".
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList
}

// With test.globals: false, @testing-library/react can't auto-detect a
// global afterEach to self-register cleanup — without this, each test's
// rendered DOM stays mounted into the next test, causing false "multiple
// elements found" failures once more than one test in a file renders the
// same component.
afterEach(() => {
  cleanup()
})
