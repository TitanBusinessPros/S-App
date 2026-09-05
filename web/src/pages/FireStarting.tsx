import { Shell } from '../components/Shell'
import { GuideDisclaimer } from '../components/GuideDisclaimer'
import '../components/GuidePage.css'

export function FireStartingContent() {
  return (
    <>
      <div className="guide-header">
        <h1>🔥 Fire Starting</h1>
        <p>
          Three ways to make fire without matches or a lighter — plus what to actually burn, by wood and by
          environment, and a long list of everyday items that work in a pinch.
        </p>
      </div>

      <GuideDisclaimer>
        Check local fire and burn restrictions before starting any fire, and always have a way to fully
        extinguish it. Friction-fire and lens methods take real practice — try them at home before you actually
        need them.
      </GuideDisclaimer>

      <div className="guide-sections">
        <section className="guide-section card">
          <h2>🪵 Friction Fire: Bow Drill &amp; Hand Drill</h2>
          <p>
            Friction fire works by creating a hot ember through sustained rubbing, then transferring that ember
            to a tinder bundle and blowing it into flame. Wood must be bone-dry and dead — avoid green or
            resin-saturated pieces for friction sets, and practice the motion before you need it.
          </p>
        </section>

        <div className="guide-subgrid">
          <div className="guide-card">
            <h3>🏹 Bow Drill (Most Reliable)</h3>
            <p>
              <strong>Components:</strong> fireboard (hearth), spindle (drill), bow, and handhold (bearing
              block).
            </p>
            <p>
              <strong>Wood pairing:</strong> a soft, dry fireboard with a slightly harder, straight-grained
              spindle — classic pairs include cottonwood/cottonwood, cedar spindle on cedar board, or yucca
              stalk on a softer board.
            </p>
            <ol>
              <li>Carve a small notch in the fireboard and a shallow depression for the spindle.</li>
              <li>Wrap the bowstring once around the spindle.</li>
              <li>
                Apply downward pressure with the handhold while sawing the bow back and forth rapidly to spin
                the spindle.
              </li>
              <li>
                Keep sawing until you see dark dust filling the notch and smoking; continue until the dust
                forms a glowing coal.
              </li>
              <li>
                Tap the board to drop the coal into your prepared tinder bundle, wrap gently, and blow steadily
                until it flames.
              </li>
            </ol>
          </div>

          <div className="guide-card">
            <h3>✋ Hand Drill (Simpler Gear, Higher Skill)</h3>
            <p>
              <strong>Best materials:</strong> straight, dry stalks with a pithy center (mullein, milkweed,
              thistle, yucca stalk) or soft woods like cottonwood or willow for the board.
            </p>
            <ol>
              <li>
                Make a small depression in a dry fireboard; use a straight spindle 2–3 ft long.
              </li>
              <li>
                Spin the spindle rapidly between your palms while pressing down, moving your hands down the
                spindle as it bites into the board.
              </li>
              <li>
                Build a pile of fine, dark dust in the notch; keep spinning until it smokes and forms an ember.
              </li>
              <li>Transfer the ember to tinder and blow into flame.</li>
            </ol>
          </div>
        </div>

        <section className="guide-section card">
          <h2>🔎 Fire-by-Lens: Magnifying Glass, Fresnel Lens, Eyeglasses &amp; Ice</h2>
          <p>
            Solar fire starting concentrates sunlight to a tiny focal point that heats tinder to ignition. It's
            daytime-only and needs clear sun and very fine, dry tinder.
          </p>
        </section>

        <div className="guide-subgrid">
          <div className="guide-card">
            <h3>🔍 Magnifying Glass / Fresnel Lens / Eyeglasses</h3>
            <ol>
              <li>
                Make a "bird's nest" tinder bundle with layers: coarse outer structure, a fine middle layer (dry
                grass, shredded bark), and a tiny core of ultra-fine material (punk wood powder, char cloth
                scrap).
              </li>
              <li>
                Hold the lens perpendicular to the sun and adjust height until you get the smallest, brightest
                spot on the tinder core.
              </li>
              <li>
                Hold steady until the spot blackens, smokes, and forms an ember; expand the smolder by moving
                the spot to the edge of the blackened area.
              </li>
              <li>Wrap the bundle around the ember and blow steadily until flame appears, then add kindling.</li>
            </ol>
          </div>

          <div className="guide-card">
            <h3>🧊 Ice Lens (Advanced, Cold Weather)</h3>
            <ol>
              <li>Use clear ice (boil water twice, cool, then freeze slowly to reduce bubbles).</li>
              <li>
                Shape a convex lens by shaving with a knife, then smooth by gently melting with your hands; a
                quick rinse with cool water can clarify the surface.
              </li>
              <li>
                Focus sunlight onto ultra-dry tinder as with a glass lens; keep the lens from dripping onto the
                tinder.
              </li>
            </ol>
          </div>
        </div>

        <section className="guide-section card">
          <h2>🌍 Tinder Bundles by Environment</h2>
          <p>
            The principle is the same everywhere — fine, dry, fluffy material that catches an ember or spark —
            but what you use changes with habitat and weather.
          </p>
        </section>

        <div className="guide-subgrid">
          <div className="guide-card">
            <h3>🌧️ Wet Climate (Rainforest, PNW, Humid Woods)</h3>
            <p>
              <strong>Priorities:</strong> keep tinder dry, use resinous or waterproof materials, and build a
              wind/rain shield.
            </p>
            <p>
              <strong>Best tinders:</strong> fatwood (resin-soaked pine heartwood), birch bark (burns even damp),
              cedar inner bark, dry punk wood from sheltered snags, feather sticks from split dry interiors, dry
              grasses from under overhangs, cattail fluff from dry seed heads.
            </p>
            <p>
              <strong>Technique:</strong> split wood to expose dry interiors; keep tinder off wet ground on a
              small stick platform; consider a waxed or pre-made bundle (jute twine + wax, or cotton balls +
              petroleum jelly in a waterproof container); ignite with a ferro rod or magnesium block and shield
              the nest from wind while blowing.
            </p>
          </div>

          <div className="guide-card">
            <h3>🏜️ Desert (Arid, High Sun, Scarce Wood)</h3>
            <p>
              <strong>Priorities:</strong> exploit abundant dry fibers and seed fluff; protect from wind; use
              solar methods when possible.
            </p>
            <p>
              <strong>Best tinders:</strong> dry grasses, yucca leaf fibers, agave/sotol fibers, dried
              flower/seed heads, fine bark strips, dry dung (in some regions), fine wood dust from dead shrubs.
            </p>
            <p>
              <strong>Technique:</strong> build a dense, compact bird's nest with a core of ultra-fine fibers
              that ember easily; use a lens on midday sun, or a ferro rod with fine fibers and blow hard.
            </p>
          </div>

          <div className="guide-card">
            <h3>🌲 Forest (Temperate/Boreal, Conifer &amp; Hardwood)</h3>
            <p>
              <strong>Priorities:</strong> harvest dry inner bark, punk wood, and resinous materials; use dead,
              standing wood for dry fuel.
            </p>
            <p>
              <strong>Best tinders:</strong> cedar, tulip poplar, aspen, and birch inner bark; dry punk wood from
              rotting logs; pine needles; cattail fluff; milkweed/thistle fluff; dry grasses.
            </p>
            <p>
              <strong>Technique:</strong> layer a bundle — coarse outer twigs/grass, fine inner bark shreds, and
              a core of punk wood powder or char cloth. For friction fire, choose soft, dry boards (cedar,
              cottonwood, tulip poplar) and straight spindles; for spark methods, use resinous fatwood curls or
              birch bark.
            </p>
          </div>
        </div>

        <section className="guide-section card">
          <h2>🌳 Top 20 Fire Woods in America (With Friction-Fire Notes)</h2>
          <p>Widely available across the U.S. and commonly used for firecraft; notes highlight friction-fire suitability where relevant.</p>
          <ol>
            <li><strong>Cottonwood:</strong> arguably the best all-around friction-fire wood in North America; excellent for bow drill boards and spindles, also good hand drill bark boards.</li>
            <li><strong>Cedar (various species):</strong> great for bow drill sets and tinder (inner bark); widely used in the West and Northeast.</li>
            <li><strong>Tulip poplar:</strong> top choice in Eastern woodlands for bow drill; soft, consistent grain.</li>
            <li><strong>Basswood (linden):</strong> classic softwood for boards and spindles; reliable in many regions.</li>
            <li><strong>Willow:</strong> low ignition point; good for bow drill spindles and boards in riparian areas.</li>
            <li><strong>Aspen:</strong> soft, dry, and effective for friction sets; common in northern and mountain forests.</li>
            <li><strong>Yucca (stalk):</strong> excellent spindle material; pairs well with softer boards; common in the Southwest.</li>
            <li><strong>Boxelder:</strong> southern counterpart to cottonwood for friction fire; soft and workable.</li>
            <li><strong>Birch (paper birch and others):</strong> bark is superb tinder and usable for hand drill boards; less ideal than cottonwood for bow drill but still usable.</li>
            <li><strong>Juniper:</strong> used in arid regions for friction sets; aromatic, often dry and workable.</li>
            <li><strong>Staghorn sumac:</strong> soft pithy wood; used for bow drill in Eastern woodlands.</li>
            <li><strong>Poplar (including "popple"):</strong> similar to aspen/tulip poplar; good friction wood in the Midwest/North.</li>
            <li><strong>Pine (various):</strong> not ideal for friction boards but critical for fatwood tinder and kindling; resin ignites easily.</li>
            <li><strong>Oak:</strong> poor for friction fire (too hard), but excellent long-burning fuel and good for bows/handholds.</li>
            <li><strong>Beech:</strong> like oak — better for bows/handholds than fireboards; decent fuel.</li>
            <li><strong>Maple (including bigleaf):</strong> usable for hand drill spindles (pithy stalks/branches); variable for friction sets.</li>
            <li><strong>Hickory:</strong> too hard for friction fireboards; great fuel and bow material.</li>
            <li><strong>Sycamore:</strong> occasionally used for friction in riparian zones; generally less favored than cottonwood.</li>
            <li><strong>Elderberry (blue elder):</strong> documented as a good bow drill spindle wood in the West.</li>
            <li><strong>Hau (Hibiscus tiliaceus, Hawaii):</strong> outstanding friction-fire wood where available; not continental U.S. but notable.</li>
          </ol>
          <p>
            <strong>Practical rule:</strong> for friction fire, choose soft, dry, non-resinous wood for the
            fireboard and a straight, slightly harder (but still relatively soft) spindle; for tinder and
            kindling, prioritize resinous or fibrous materials that catch sparks or embers easily.
          </p>
        </section>

        <section className="guide-section card">
          <h2>🧰 25 Common Items to Start a Fire</h2>
          <p>Everyday or easily found items that work as ignition sources, accelerants, or excellent tinder.</p>
          <ol>
            <li><strong>Bic or windproof lighter</strong> — instant flame; keep multiple and protect from moisture.</li>
            <li><strong>Stormproof/waterproof matches</strong> — light in wind/rain; carry in a waterproof case.</li>
            <li><strong>Ferrocerium (ferro) rod</strong> — throws 5,000°F sparks; works wet/windy with good tinder.</li>
            <li><strong>Magnesium fire block</strong> — scrape shavings, ignite with a spark; burns very hot.</li>
            <li><strong>Cotton balls + petroleum jelly</strong> — cheap, long-burning tinder; store in a bag/straw.</li>
            <li><strong>Dryer lint</strong> — extremely flammable; keep dry in a bag or tin.</li>
            <li><strong>Duct tape</strong> — shreds or rolls burn well; portable emergency tinder.</li>
            <li><strong>9V battery + fine steel wool</strong> — touch terminals to wool; it glows and ignites tinder.</li>
            <li><strong>Battery + gum wrapper/foil</strong> — short-circuit to create heat/spark for fine tinder.</li>
            <li><strong>Magnifying glass / Fresnel lens</strong> — focus sun to an ember on fine tinder (daytime only).</li>
            <li><strong>Eyeglasses or camera lens</strong> — can focus sunlight like a magnifier in a pinch.</li>
            <li><strong>Paper products</strong> (newspaper, paper towels, toilet paper) — quick tinder/kindling when dry.</li>
            <li><strong>Cotton gauze</strong> (first-aid) — fluffy cotton ignites easily with a spark or flame.</li>
            <li><strong>Tampons/pads</strong> (cotton fibers) — separate fibers for fine tinder; burns well.</li>
            <li><strong>Char cloth</strong> — catches a spark and holds an ember; transfer to a tinder bundle.</li>
            <li><strong>Trick birthday candles</strong> — relight after blowing out; useful as a persistent mini-flame source.</li>
            <li><strong>Chips/crisps</strong> (greasy) — high fat content; burn surprisingly well as tinder.</li>
            <li><strong>Denim strips</strong> (waxed or dry) — frayed denim catches sparks; waxed denim burns longer.</li>
            <li><strong>Jute twine</strong> (especially waxed) — frayed ends make excellent tinder; waxed versions resist moisture.</li>
            <li><strong>Sawdust + paraffin "cubes"</strong> — homemade long-burning fire plugs.</li>
            <li><strong>Fatwood/resin sticks</strong> (if available) — natural, resin-rich tinder that ignites easily.</li>
            <li><strong>Birch bark</strong> — contains oils that burn even when damp; superb natural tinder.</li>
            <li><strong>Candle</strong> (tea light/emergency candle) — sustained flame to build kindling; also a fire source itself.</li>
            <li><strong>Hand sanitizer</strong> (alcohol-based) — flammable gel; use sparingly to boost tinder ignition.</li>
            <li><strong>Nail polish remover</strong> (acetone) — highly flammable liquid; only tiny amounts, used with caution, to accelerate tinder.</li>
          </ol>
        </section>
      </div>
    </>
  )
}

export function FireStarting() {
  return (
    <Shell>
      <FireStartingContent />
    </Shell>
  )
}
