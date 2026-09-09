import { afterEach, describe, expect, it, vi } from 'vitest'

const logEventMock = vi.fn()
vi.mock('firebase/analytics', () => ({
  logEvent: (...args: unknown[]) => logEventMock(...args),
}))

// firebase.ts's own analyticsReady is a live async support check against
// the real SDK — these tests aren't about that check, so replace it with a
// controllable promise per test instead of letting each test race jsdom's
// real (unsupported) environment.
let analyticsReady: Promise<unknown>
vi.mock('./firebase', () => ({
  get analyticsReady() {
    return analyticsReady
  },
}))

afterEach(() => {
  logEventMock.mockClear()
})

describe('trackEvent / trackPageView', () => {
  it('logs an event once Analytics is available', async () => {
    const fakeAnalytics = { app: 'fake' }
    analyticsReady = Promise.resolve(fakeAnalytics)
    const { trackEvent } = await import('./analytics')

    trackEvent('sos_beacon_started', { foo: 'bar' })
    await Promise.resolve()
    await Promise.resolve()

    expect(logEventMock).toHaveBeenCalledWith(fakeAnalytics, 'sos_beacon_started', { foo: 'bar' })
  })

  it('logs page_view with the given path', async () => {
    const fakeAnalytics = { app: 'fake' }
    analyticsReady = Promise.resolve(fakeAnalytics)
    const { trackPageView } = await import('./analytics')

    trackPageView('/app/compass')
    await Promise.resolve()
    await Promise.resolve()

    expect(logEventMock).toHaveBeenCalledWith(fakeAnalytics, 'page_view', { page_path: '/app/compass' })
  })

  it('silently no-ops when Analytics is unsupported (null)', async () => {
    analyticsReady = Promise.resolve(null)
    const { trackEvent } = await import('./analytics')

    expect(() => trackEvent('anything')).not.toThrow()
    await Promise.resolve()
    await Promise.resolve()

    expect(logEventMock).not.toHaveBeenCalled()
  })
})
