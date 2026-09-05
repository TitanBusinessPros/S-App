import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { WaypointsContent } from './Waypoints'

interface FakePosition {
  coords: { latitude: number; longitude: number; accuracy: number }
}

/** Installs a fake navigator.geolocation and returns handles to drive it —
 * fireWatch() simulates the device reporting a new position to every
 * currently-active watchPosition() callback, exactly like a real GPS update
 * would. clearWatch() actually unsubscribes (matching real browser
 * behavior) so tests can tell a stopped watch from a running one, rather
 * than every callback ever registered staying live forever. */
function mockGeolocation(start: { lat: number; lng: number }) {
  const watchCallbacks = new Map<number, (pos: FakePosition) => void>()
  let nextWatchId = 1

  const getCurrentPosition = vi.fn((success: (pos: FakePosition) => void) => {
    success({ coords: { latitude: start.lat, longitude: start.lng, accuracy: 5 } })
  })
  const watchPosition = vi.fn((success: (pos: FakePosition) => void) => {
    const id = nextWatchId++
    watchCallbacks.set(id, success)
    return id
  })
  const clearWatch = vi.fn((id: number) => {
    watchCallbacks.delete(id)
  })

  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition, watchPosition, clearWatch },
    configurable: true,
  })

  return {
    getCurrentPosition,
    watchPosition,
    clearWatch,
    fireWatch: (lat: number, lng: number, accuracy = 5) => {
      act(() => {
        watchCallbacks.forEach((cb) => cb({ coords: { latitude: lat, longitude: lng, accuracy } }))
      })
    },
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('WaypointsContent', () => {
  it('resolves the current position and shows the drop-waypoint form', async () => {
    mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)
    expect(await screen.findByText('Drop a Waypoint')).toBeInTheDocument()
    expect(screen.getByText(/35\.00000, -97\.00000/)).toBeInTheDocument()
  })

  it('drops a labeled waypoint and lists it with distance and bearing', async () => {
    mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    const input = await screen.findByPlaceholderText(/Camp, Trailhead/)
    fireEvent.change(input, { target: { value: 'Camp' } })
    fireEvent.click(screen.getByText('Save Waypoint Here'))

    expect(await screen.findByText('Camp')).toBeInTheDocument()
    // Distance from yourself to a waypoint dropped at your own position is 0.
    expect(screen.getByText('0 ft')).toBeInTheDocument()
  })

  it('defaults an unlabeled waypoint to "Waypoint N"', async () => {
    mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    await screen.findByPlaceholderText(/Camp, Trailhead/)
    fireEvent.click(screen.getByText('Save Waypoint Here'))

    expect(await screen.findByText('Waypoint 1')).toBeInTheDocument()
  })

  it('deletes a waypoint from the list', async () => {
    mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    await screen.findByPlaceholderText(/Camp, Trailhead/)
    fireEvent.click(screen.getByText('Save Waypoint Here'))
    await screen.findByText('Waypoint 1')

    fireEvent.click(screen.getByLabelText('Delete Waypoint 1'))
    expect(screen.queryByText('Waypoint 1')).not.toBeInTheDocument()
    expect(screen.getByText('No waypoints saved yet.')).toBeInTheDocument()
  })

  it('persists waypoints across a remount via localStorage', async () => {
    mockGeolocation({ lat: 35, lng: -97 })
    const { unmount } = render(<WaypointsContent />)

    await screen.findByPlaceholderText(/Camp, Trailhead/)
    fireEvent.change(screen.getByPlaceholderText(/Camp, Trailhead/), { target: { value: 'Trailhead' } })
    fireEvent.click(screen.getByText('Save Waypoint Here'))
    await screen.findByText('Trailhead')
    unmount()

    mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)
    expect(await screen.findByText('Trailhead')).toBeInTheDocument()
  })

  it('is not recording a trail by default, with no stats shown', async () => {
    mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)
    expect(await screen.findByText('▶️ Start Recording')).toBeInTheDocument()
    expect(screen.queryByText(/walked/)).not.toBeInTheDocument()
  })

  it('records breadcrumb points on GPS updates once recording starts', async () => {
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    expect(geo.watchPosition).toHaveBeenCalledTimes(1)

    geo.fireWatch(35, -97)
    expect(await screen.findByText(/1 point ·/)).toBeInTheDocument()

    // ~111m north — comfortably past the 8m throttle, so it's recorded.
    geo.fireWatch(35.001, -97)
    expect(await screen.findByText(/2 points ·/)).toBeInTheDocument()
  })

  it('throttles breadcrumb points that are too close together', async () => {
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97)
    await screen.findByText(/1 point ·/)

    // ~1.1cm away — well under the 8m minimum spacing, should be dropped.
    geo.fireWatch(35.0000001, -97)
    expect(screen.getByText(/1 point ·/)).toBeInTheDocument()
  })

  it('does not record fake movement from GPS jitter while standing still with poor accuracy', async () => {
    // Regression test for a real user report: standing still showed a
    // recorded distance because a fixed, accuracy-blind threshold treated
    // ordinary GPS noise as movement.
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97, 5)
    await screen.findByText(/1 point ·/)

    // ~33m of jitter, but the fix itself claims only ±50m accuracy — not
    // trustworthy evidence of real movement, so it must be rejected.
    geo.fireWatch(35.0003, -97, 50)
    expect(screen.getByText(/1 point ·/)).toBeInTheDocument()
    expect(screen.queryByText(/2 points ·/)).not.toBeInTheDocument()
  })

  it('still records real movement that exceeds a poor-accuracy fix\'s own threshold', async () => {
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97, 5)
    await screen.findByText(/1 point ·/)

    // ~111m of movement comfortably clears even a noisy ±50m fix.
    geo.fireWatch(35.001, -97, 50)
    expect(await screen.findByText(/2 points ·/)).toBeInTheDocument()
  })

  it('stops watching GPS when recording is stopped', async () => {
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    fireEvent.click(await screen.findByText('⏹️ Stop Recording'))

    expect(geo.clearWatch).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('▶️ Start Recording')).toBeInTheDocument()
  })

  it('clears the trail and its stats', async () => {
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97)
    await screen.findByText(/1 point ·/)

    fireEvent.click(screen.getByText('Clear Trail'))
    expect(screen.queryByText(/walked/)).not.toBeInTheDocument()
    expect(await screen.findByText('▶️ Start Recording')).toBeInTheDocument()
  })

  it('updates the live "back to start" reading as you move, not just at recorded breadcrumb points', async () => {
    // Regression test for a real user report: the "You" marker and "back to
    // start" distance were wired to a one-time location fetch instead of a
    // live position, so they never moved as you actually walked.
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97, 5)
    await screen.findByText(/1 point ·/)

    // ~111m north — clears the throttle, recorded as a second point.
    geo.fireWatch(35.001, -97, 5)
    await screen.findByText(/2 points ·/)
    const afterSecondPoint = screen.getByText(/⬅ Back to start:/).textContent

    // A further ~5.5m move — under the 15m minimum spacing, so it's NOT
    // recorded as a new breadcrumb point, but the live marker should still
    // reflect it.
    geo.fireWatch(35.00105, -97, 5)
    expect(screen.getByText(/2 points ·/)).toBeInTheDocument()
    const afterSmallMove = screen.getByText(/⬅ Back to start:/).textContent
    expect(afterSmallMove).not.toBe(afterSecondPoint)
  })

  it('keeps tracking your live position after you stop recording, so you can retrace the trail', async () => {
    // This is the exact scenario reported: stop recording, then walk back a
    // different way — the two markers must not stay frozen in place.
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97, 5)
    await screen.findByText(/1 point ·/)
    geo.fireWatch(35.001, -97, 5)
    await screen.findByText(/2 points ·/)

    fireEvent.click(await screen.findByText('⏹️ Stop Recording'))
    await screen.findByText('▶️ Start Recording')
    const beforeWalkingBack = screen.getByText(/⬅ Back to start:/).textContent

    // Walk back toward the start after recording has already stopped.
    geo.fireWatch(35.0005, -97, 5)
    const afterWalkingBack = screen.getByText(/⬅ Back to start:/).textContent
    expect(afterWalkingBack).not.toBe(beforeWalkingBack)
  })
})
