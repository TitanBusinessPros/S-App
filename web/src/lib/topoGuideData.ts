// Reading Topographic Contour Lines — structured reference data, same
// pattern as firstAidData.ts/shelterData.ts: the page just maps over this.
// Written from scratch, in original wording, based on general/standard
// cartographic concepts that are taught identically across public-domain
// government sources, scouting manuals, and outdoor-education material
// everywhere — the underlying facts aren't anyone's property, and no text
// here is copied or adapted from any specific book, course, or website.

export interface TopoGuideSection {
  title: string
  bullets: string[]
}

/** The handful of facts everything else in this guide builds on. */
export const CONTOUR_BASICS: TopoGuideSection[] = [
  {
    title: 'What a contour line actually is',
    bullets: [
      'A contour line connects every point on the map that sits at exactly the same elevation above sea level.',
      "Follow one line with your finger and you're tracing a path where you would neither climb nor descend.",
      'Every contour line closes into a complete loop somewhere, even if that loop falls outside the edge of the specific map you\'re looking at.',
    ],
  },
  {
    title: 'Contour interval',
    bullets: [
      'The elevation difference between one contour line and the next is fixed across the whole map, and is called the contour interval.',
      "It's printed in the map's margin or legend — never written on the lines themselves — so check it before trying to judge elevation or steepness.",
      'A small interval (for example 10–20 feet) shows more detail on gentle terrain. A large interval (80–100+ feet) is used on mountainous maps so the lines stay readable instead of merging into a solid smear of ink.',
    ],
  },
  {
    title: 'Index contours',
    bullets: [
      'Every fifth contour line is drawn heavier and carries a printed elevation number — these are index contours, and they exist so you don\'t have to count every single line to know roughly where you are.',
      'The four lighter, unlabeled lines between two index contours are intermediate contours. Count them and multiply by the contour interval to find the exact elevation of any one of them.',
    ],
  },
  {
    title: 'Reading your elevation at a point',
    bullets: [
      "Standing on a contour line puts you at that line's exact elevation.",
      'Standing between two lines puts you somewhere between their two elevation values.',
      'Whether a closed loop is high ground or low ground determines which direction "up" is from where you\'re standing — see Depressions below before assuming.',
    ],
  },
  {
    title: "If you can't find the contour interval printed anywhere",
    bullets: [
      'Find two neighboring index contours and count the interval lines between them — there should be four.',
      'Divide the elevation difference between those two index contours by five to get the contour interval.',
    ],
  },
]

/** How specific terrain features actually look once drawn as contour lines. */
export const TERRAIN_SHAPES: TopoGuideSection[] = [
  {
    title: 'Hills and peaks',
    bullets: [
      'Concentric closed loops, each one smaller and higher than the one surrounding it, mark a hill or summit.',
      'The smallest, innermost loop in the group is the highest point.',
    ],
  },
  {
    title: 'Depressions and sinkholes',
    bullets: [
      'A closed loop that looks identical to a hilltop, but has short tick marks (hachures) pointing inward toward its center, marks a depression instead of a hill — low ground that dips down rather than rises up.',
      'Always check for these tick marks before treating a closed loop as a summit; the two can look nearly identical at a glance.',
    ],
  },
  {
    title: 'Valleys, ravines, and drainages',
    bullets: [
      'Contour lines that bend into a V or U shape, with the point of the shape aimed toward higher ground, trace a valley, ravine, or streambed.',
      "Water runs downhill along the inside of that V, so the point of the V always aims upstream — toward higher elevation, not lower.",
    ],
  },
  {
    title: 'Ridges and spurs',
    bullets: [
      'A V or U shape pointing toward lower ground instead traces a ridge or spur running down and away from higher terrain.',
      "It's the mirror image of a valley: the point of the V aims downhill instead of uphill.",
    ],
  },
  {
    title: 'Saddles and passes',
    bullets: [
      'An hourglass or bowtie pattern — two curved sets of lines pinched together between two higher points — marks a saddle: a low point sitting on a ridge between two summits.',
      "Saddles are very often the easiest place to cross from one side of a ridge to the other, which makes them worth spotting ahead of time on any route.",
    ],
  },
  {
    title: 'Cliffs and near-vertical faces',
    bullets: [
      'When contour lines are packed so tightly they touch or nearly merge into one thick line, that marks a cliff or a near-vertical drop.',
      'Some maps mark cliffs with a dedicated tick-and-line symbol instead of ordinary contour lines — treat either version the same way: as ground you cannot safely walk down.',
    ],
  },
  {
    title: 'Flat ground and plateaus',
    bullets: [
      'A wide gap with few or no contour lines running through it means the ground there is close to flat.',
      'That flat area could be a valley floor, a plateau or tableland high up, or open water — check the surrounding lines and any water symbols to tell which.',
    ],
  },
]

/** Turning line spacing into an actual read on how hard a climb will be. */
export const SLOPE_AND_STEEPNESS: TopoGuideSection[] = [
  {
    title: 'Spacing shows steepness',
    bullets: [
      'Contour lines packed close together mean a steep slope. Lines spread far apart mean a gentle one.',
      'This holds true everywhere on the map, not just on named hills or mountains.',
    ],
  },
  {
    title: 'Evenly spaced lines',
    bullets: [
      'Evenly spaced contour lines mean a constant, uniform slope for that entire stretch — gentle or steep, but unchanging.',
    ],
  },
  {
    title: 'Lines that bunch, then spread (or the reverse)',
    bullets: [
      'Lines bunched tightly near the bottom of a slope and spreading out higher up mean the climb starts steep and eases off — common at the base of hills and mountains.',
      'The opposite pattern — lines spread out low and bunching tighter higher up — means the climb gets harder the further you go.',
    ],
  },
  {
    title: 'Estimating total elevation gain or loss',
    bullets: [
      "Count how many contour lines a planned route crosses between two points, then multiply that count by the contour interval.",
      "That gives you the total elevation change for that leg, even if the line spacing (and therefore the steepness) varies along the way.",
    ],
  },
]

/** Actually using all of the above to make real decisions in the field. */
export const PRACTICAL_USES: TopoGuideSection[] = [
  {
    title: 'Contouring around a hill',
    bullets: [
      'Instead of going straight up and over high ground, you can follow a single contour line roughly around its side, keeping your elevation constant the whole way.',
      'This is literally where the term "contouring" comes from, and it can save real energy compared to a straight-line route over the top.',
    ],
  },
  {
    title: 'Picking the gentler of two routes',
    bullets: [
      'Between two points, a path crossing fewer, more widely-spaced contour lines will be an easier climb than one crossing many tightly-packed lines — even if the second path looks shorter as the crow flies.',
    ],
  },
  {
    title: 'Predicting where water will be',
    bullets: [
      'Because water always flows downhill along the inside of a valley\'s V-shaped contour pattern, you can trace a valley uphill on the map to guess where a stream might start, or trace it downhill toward where water is more likely to collect.',
    ],
  },
  {
    title: 'Spotting line-of-sight before you move',
    bullets: [
      'A ridge or hill sitting between your position and a destination usually means you cannot see that destination, or be seen from it — worth knowing for both navigation and for staying out of sight.',
    ],
  },
  {
    title: 'Choosing a lookout point or a campsite',
    bullets: [
      'A closed hilltop loop near open ground can make a good lookout, if it\'s otherwise safe and accessible, since it often gives a view in multiple directions.',
      'Low ground following a valley pattern can offer more shelter from wind, but also collects cold air overnight and is more likely to hold water after rain — weigh both before committing to a site.',
    ],
  },
  {
    title: 'Planning a bail-out route ahead of time',
    bullets: [
      'Identify saddles and passes along your intended route before you set out, so you already know the easiest place to cross a ridge if you need to change plans or lose elevation quickly.',
    ],
  },
]

/** The reads that trip people up most often — worth checking against deliberately. */
export const COMMON_MISTAKES: TopoGuideSection[] = [
  {
    title: 'Assuming every closed loop is a hill',
    bullets: [
      'Always check for inward-pointing hachure tick marks before treating a closed loop as high ground — it may be a depression instead, and the two look alike at a glance.',
    ],
  },
  {
    title: 'Ignoring the contour interval when comparing maps',
    bullets: [
      'Two maps of the same real area can look completely different in how packed their lines are, purely because they use different contour intervals.',
      "Don't compare line density between two maps without checking each one's interval first.",
    ],
  },
  {
    title: 'Judging steepness from a single line',
    bullets: [
      'One contour line only tells you an elevation, not a slope. You need to look at how that line relates to its neighbors — their spacing — to judge how steep the ground actually is.',
    ],
  },
  {
    title: 'Miscounting intermediate contours',
    bullets: [
      'Forgetting that index contours only appear every fifth line is the single most common cause of misjudging elevation on a topo map.',
      'If an elevation reading seems off, recount from the nearest labeled index contour rather than trusting a rough guess.',
    ],
  },
]
