import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import '../components/GuidePage.css'

export function SnaresContent() {
  return (
    <>
      <div className="guide-header">
        <h1>Snares &amp; Traps</h1>
        <p>Standard small-game snare designs. These only make sense in a genuine survival situation — check local trapping law before practicing.</p>
      </div>

      <GuideDisclaimer>
        Trapping regulations vary by state and season, and most places require a license outside a genuine
        emergency. Practice knots and mechanisms without live sets unless you actually need food to survive.
      </GuideDisclaimer>

      <div className="guide-sections">
        <section className="guide-section card">
          <h2>🪤 Snare Basics</h2>
          <ul>
            <li>Use wire if you have it — cordage works but animals can chew through it before the snare closes.</li>
            <li>Set snares on active game trails, especially narrow pinch points between obstacles.</li>
            <li>Multiple snares (a "trap line") beat one perfect snare — check them at least twice a day.</li>
          </ul>
        </section>

        <div className="guide-subgrid">
          <div className="guide-card">
            <h3>Squirrel Pole</h3>
            <p>
              Lean a long pole from the ground up against a tree squirrels are already using. Tie several small
              wire loop snares (about 2 inches wide) along the pole, snug against the wood. Squirrels run the pole
              as a highway and put their head through a loop.
            </p>
          </div>

          <div className="guide-card">
            <h3>Rabbit / Small-Game Run Snare</h3>
            <p>
              Find a run (a worn path through grass/brush about rabbit-height). Set a wire loop roughly 4 inches
              in diameter, bottom of the loop about 3–4 inches off the ground, anchored to a stake or nearby
              sapling. Narrow the trail slightly on either side with sticks so the animal has to pass through
              the loop.
            </p>
          </div>

          <div className="guide-card">
            <h3>Twitch-Up Spring Snare</h3>
            <p>
              Same loop placement as a run snare, but tie the anchor line to a bent-over sapling under tension
              instead of a fixed stake, held by a simple trigger (a notched stick catch). Once triggered, the
              sapling snaps upward — this lifts the catch off the ground, which both kills more quickly and
              keeps the catch away from other predators.
            </p>
          </div>

          <div className="guide-card">
            <h3>Figure-4 Deadfall</h3>
            <p>
              Three carved sticks (upright, diagonal, bait stick) interlock under a heavy flat rock or log,
              balanced so a light touch on the bait releases the whole structure downward. Best for small
              rodents; requires practice to carve the notches so it balances correctly.
            </p>
          </div>
        </div>

        <section className="guide-section card">
          <h2>🎯 Placement Matters More Than the Snare</h2>
          <p>
            An expertly built snare in the wrong spot catches nothing. Look for fresh droppings, tracks, and
            worn-down vegetation before you set anything — that's what tells you an animal is actually using
            that path regularly.
          </p>
        </section>
      </div>
    </>
  )
}

export function Snares() {
  return (
    <Shell>
      <SnaresContent />
    </Shell>
  )
}
