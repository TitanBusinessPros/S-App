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
  it('shows the 3-step how-to before any waypoint or recording exists', async () => {
    mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)
    const heading = await screen.findByText('How to use this')
    // Scoped to the how-to card itself — the page's actual Start/Stop
    // Recording buttons are already on screen at this point too, and a
    // bare text query for "Start Recording" would ambiguously match both.
    const stepsCard = heading.closest('.waypoints-howto')
    expect(stepsCard).not.toBeNull()
    expect(stepsCard!.textContent).toMatch(/Save a waypoint/)
    expect(stepsCard!.textContent).toMatch(/Start Recording/)
    expect(stepsCard!.textContent).toMatch(/Stop Recording/)
  })

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

  it('shows how far off the recorded trail you are, distinct from distance back to start', async () => {
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97, 5)
    await screen.findByText(/1 point ·/)
    // ~111m north — recorded as a second point, giving the trail a segment.
    geo.fireWatch(35.001, -97, 5)
    await screen.findByText(/2 points ·/)

    // Stop recording so later position updates check your distance from
    // the already-recorded path, instead of extending that path — this is
    // the realistic "am I still on the trail I recorded" use case.
    fireEvent.click(await screen.findByText('⏹️ Stop Recording'))
    await screen.findByText('▶️ Start Recording')

    // Standing right on that recorded segment, "off trail" should read 0.
    geo.fireWatch(35.0005, -97, 5)
    expect(screen.getByText(/📏 Off trail: 0 ft/)).toBeInTheDocument()

    // Step ~55m sideways (east) off the line — clearly off-trail, even
    // though you're still roughly between the two recorded points, which
    // "back to start" alone wouldn't necessarily make obvious.
    geo.fireWatch(35.0005, -96.9994, 5)
    const offTrailText = screen.getByText(/📏 Off trail:/).textContent ?? ''
    // Parse the number rather than string-matching for "not 0 ft" — a
    // substring check would false-positive on a value like "180 ft", which
    // itself contains the literal text "0 ft".
    const feet = Number(offTrailText.match(/Off trail: ([\d.]+) ft/)?.[1])
    expect(feet).toBeGreaterThan(50)
  })

  it('refines the trail start if a much more accurate fix arrives before you move away', async () => {
    // Regression test: a phone's first GPS fix is often its worst. Locking
    // it in permanently as "Start" makes the whole recorded line look
    // wrong. A later, more accurate fix that's still within the first
    // fix's own error margin should refine Start in place instead of
    // becoming a second point.
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))

    // First fix: poor accuracy (50m).
    geo.fireWatch(35, -97, 50)
    await screen.findByText(/1 point ·/)

    // ~20m away (well within the first fix's 50m error margin) but with
    // much better accuracy (5m) — refines Start rather than adding a point.
    geo.fireWatch(35.00018, -97, 5)
    expect(screen.getByText(/1 point ·/)).toBeInTheDocument()

    // Standing at that same refined location, "back to start" should now
    // read 0 — proving Start moved to match, not the original bad fix.
    expect(screen.getByText(/⬅ Back to start: 0 ft/)).toBeInTheDocument()
  })

  it('visibly moves the "You" marker on the trail map while actively recording', async () => {
    // Regression test for a real user report: the marker's underlying
    // position was updating correctly (proven by the "back to start" and
    // "off trail" text readouts changing), but the trail map's viewBox
    // rescaled to tightly fit your exact position on every single GPS
    // tick — and while walking forward into new territory, you're always
    // right at the edge of that ever-expanding frame, so the marker looked
    // frozen relative to it even though its true coordinate moved. The fix
    // keeps the frame stable (grown with headroom) instead of refitting
    // tightly every tick, so movement within already-covered ground reads
    // as real on-screen movement.
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    const { container } = render(<WaypointsContent />)
    const youMarker = () => container.querySelectorAll('circle')[1]

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97, 5)
    await screen.findByText(/1 point ·/)
    // ~111m north — recorded as a second point, establishing the frame.
    geo.fireWatch(35.001, -97, 5)
    await screen.findByText(/2 points ·/)

    const firstCx = Number(youMarker().getAttribute('cx'))
    const firstCy = Number(youMarker().getAttribute('cy'))

    // ~11m further north — still while actively recording, and (deliberately
    // under the 15m breadcrumb spacing threshold, so this isn't recorded as
    // a new trail point either) well within the frame's existing headroom,
    // so it shouldn't need to rescale.
    geo.fireWatch(35.0011, -97, 5)
    const secondCx = Number(youMarker().getAttribute('cx'))
    const secondCy = Number(youMarker().getAttribute('cy'))

    const pixelsMoved = Math.hypot(secondCx - firstCx, secondCy - firstCy)
    expect(pixelsMoved).toBeGreaterThan(5)
  })

  it('expands the trail map frame, without erroring, when you move well beyond it', async () => {
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    const { container } = render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97, 5)
    await screen.findByText(/1 point ·/)
    geo.fireWatch(35.001, -97, 5)
    await screen.findByText(/2 points ·/)

    // A big jump far outside the frame established so far — the marker
    // should still land inside the visible plot, not off the edge of it.
    geo.fireWatch(35.01, -97, 5)
    const youMarker = container.querySelectorAll('circle')[1]
    const cx = Number(youMarker.getAttribute('cx'))
    const cy = Number(youMarker.getAttribute('cy'))
    expect(cx).toBeGreaterThanOrEqual(0)
    expect(cx).toBeLessThanOrEqual(220)
    expect(cy).toBeGreaterThanOrEqual(0)
    expect(cy).toBeLessThanOrEqual(220)
  })

  it('does not refine the start point for real movement, only for a more accurate re-read of the same spot', async () => {
    const geo = mockGeolocation({ lat: 35, lng: -97 })
    render(<WaypointsContent />)

    fireEvent.click(await screen.findByText('▶️ Start Recording'))
    geo.fireWatch(35, -97, 50)
    await screen.findByText(/1 point ·/)

    // ~111m away — well beyond the first fix's 50m accuracy, so this is
    // real movement, not a refinement of the same spot. It should become a
    // genuine second point instead of silently replacing Start.
    geo.fireWatch(35.001, -97, 5)
    expect(await screen.findByText(/2 points ·/)).toBeInTheDocument()
  })
})
