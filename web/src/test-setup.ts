import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// With test.globals: false, @testing-library/react can't auto-detect a
// global afterEach to self-register cleanup — without this, each test's
// rendered DOM stays mounted into the next test, causing false "multiple
// elements found" failures once more than one test in a file renders the
// same component.
afterEach(() => {
  cleanup()
})
