// Structured Shelter Building reference data — same pattern as
// firstAidData.ts and recipesData.ts: the page component just maps over
// this rather than embedding 15 multi-step builds inline. General
// wilderness reference information, not a substitute for real training.

export interface ShelterRule {
  title: string
  bullets: string[]
}

/** Applies before building any specific shelter below — site selection,
 * orientation, ground insulation, drainage, and using carried gear over
 * improvised materials when you have the choice. */
export const UNIVERSAL_SHELTER_RULES: ShelterRule[] = [
  {
    title: "Pick a safe site",
    bullets: [
      "Avoid dry washes, gullies, streambeds, low spots, unstable slopes, cliff edges, avalanche paths, and coastal tide zones.",
      "Do not camp beneath dead limbs, leaning trees, loose rock, or a lone tall tree.",
      "In thunderstorms, get off ridgelines, summits, exposed shorelines, and open fields. A tent or tarp does not protect you from lightning.",
      "Build near — not on top of — your water and firewood sources to cut down on trips.",
    ],
  },
  {
    title: "Face the shelter correctly",
    bullets: [
      "Put the lowest/most closed side toward the prevailing wind.",
      "In rain, have the entrance face away from wind-driven rain.",
      "In heat, aim shade for the afternoon sun but leave open sides for airflow.",
    ],
  },
  {
    title: "Insulate the ground",
    bullets: [
      "Ground insulation often matters more than wall thickness in cold weather.",
      "Use a sleeping pad, backpack, spare clothes, pine needles or dry leaf litter beneath a groundsheet only if necessary and legal, or a bed of dry natural material in a true emergency.",
    ],
  },
  {
    title: "Keep water outside",
    bullets: [
      "Use a slightly raised, well-drained site.",
      "Do not dig trenches around tents; that damages campsites and is often prohibited.",
      "Pitch the tarp tight enough that water sheds instead of pooling.",
    ],
  },
  {
    title: "Use what you carry",
    bullets: [
      "A tarp, trekking poles, cord, stakes, emergency bivy, and sleeping pad outperform a “natural” shelter in most situations.",
      "Avoid cutting live wood or stripping vegetation; camp on durable surfaces and use existing developed sites whenever possible.",
    ],
  },
]

export interface ShelterDesign {
  num: number
  name: string
  emoji: string
  bestFor: string
  needs: string
  buildSteps: string[]
  keyDetail: string
}

export const SHELTER_DESIGNS: ShelterDesign[] = [
  {
    num: 1,
    name: "Low Storm A-Frame Tarp",
    emoji: "⛺",
    bestFor: "Cold rain, wind, forest, general three-season emergency shelter.",
    needs: "8×10-foot or 10×10-foot tarp, 20–30 feet of ridgeline cord, 4–8 stakes, two trees or trekking poles.",
    buildSteps: [
      "Run a ridgeline between two trees at knee-to-waist height, or support it with trekking poles.",
      "Lay the tarp centered over the ridgeline so both sides reach near the ground.",
      "Stake the windward side all the way to the ground.",
      "Stake the leeward side lower than normal if weather is severe; leave a small entrance gap only at one end.",
      "Pull each guyline outward and slightly downward, then tighten until the tarp is taut.",
      "Put your sleeping pad and bivy inside, perpendicular to the ridgeline, with your head at the more protected end.",
    ],
    keyDetail: "Lower equals warmer and more wind-resistant; higher equals more ventilation but less protection.",
  },
  {
    num: 2,
    name: "Standard A-Frame Tarp",
    emoji: "⛺",
    bestFor: "Mild-to-moderate rain, three-season travel, quick overnight.",
    needs: "Same as the low storm A-frame above.",
    buildSteps: [
      "Tie a ridgeline about chest high.",
      "Drape the tarp evenly over it.",
      "Stake both long sides 2–4 feet from the ridgeline.",
      "Pull front and rear corners out with short guylines.",
      "Keep one end open for entry and airflow.",
    ],
    keyDetail: "If rain begins blowing sideways, lower the windward edge immediately.",
  },
  {
    num: 3,
    name: "Plow-Point Tarp",
    emoji: "🔺",
    bestFor: "Strong directional wind and rain; one-person shelter.",
    needs: "Square tarp, one high anchor, one trekking pole or branch, 3–5 stakes.",
    buildSteps: [
      "Tie one corner of a square tarp high to a tree or ridgeline — about head height.",
      "Pull the opposite diagonal corner outward and stake it close to the ground.",
      "Raise one of the remaining side corners with a trekking pole around waist height.",
      "Stake the final corner low and toward the wind.",
      "Adjust the high corner so rain runs down the tarp rather than into the shelter.",
    ],
    keyDetail: "Position the broad, low section into the wind; sleep behind it in the protected wedge.",
  },
  {
    num: 4,
    name: "Half-Pyramid Tarp",
    emoji: "🔻",
    bestFor: "Solo camping in rain and wind where one trekking pole is available.",
    needs: "Rectangular or square tarp, one trekking pole, 5–7 stakes.",
    buildSteps: [
      "Stake the rear edge of the tarp flat on the ground.",
      "Fold or angle the two rear corners inward so the rear becomes nearly closed.",
      "Place a trekking pole about 3–4 feet from the front edge.",
      "Raise the tarp's front center attachment point on the pole.",
      "Stake both front corners wide apart.",
      "Adjust the pole height lower for wind, higher for ventilation.",
    ],
    keyDetail: "Keep the rear directly into the wind and place your head toward the back.",
  },
  {
    num: 5,
    name: "Full Pyramid (“Mid”) Tarp",
    emoji: "🏔️",
    bestFor: "Severe rain, alpine wind, shoulder season, group protection.",
    needs: "Square tarp with center tie-out, one adjustable trekking pole or center pole, 4–8 stakes.",
    buildSteps: [
      "Stake all four corners in a square.",
      "Set the center pole under the tarp's middle tie-out.",
      "Raise it gradually until the walls become steep and taut.",
      "Rotate one side or a low entrance away from the wind.",
      "Add mid-panel guyouts if wind is strong.",
      "Lower the pole and tighten anchors for storm conditions.",
    ],
    keyDetail: "A pyramid shape sheds wind and rain well. If using a floorless tarp, use a groundsheet and keep gear near the center away from wet edges.",
  },
  {
    num: 6,
    name: "Lean-To Tarp",
    emoji: "🏕️",
    bestFor: "Mild conditions, a daytime rain break, or a windbreak with a fire kept far outside.",
    needs: "Tarp, ridgeline or two trees/poles, 2–4 stakes.",
    buildSteps: [
      "Tie one long edge of the tarp to a ridgeline about shoulder height.",
      "Pull the opposite long edge out and stake it near the ground.",
      "Angle the roof toward the prevailing wind.",
      "Create a steep enough slope that water sheds quickly.",
      "Use a groundsheet under your sleeping area.",
    ],
    keyDetail: "This is too open for severe cold rain or changing winds. Convert it to an A-frame before sleeping if weather deteriorates.",
  },
  {
    num: 7,
    name: "Poncho-Tarp Shelter",
    emoji: "🧥",
    bestFor: "Ultralight hikers, surprise rain, emergency solo night.",
    needs: "Poncho tarp, cord, 4–6 stakes, trekking pole or a tree.",
    buildSteps: [
      "Run cord from a tree to a trekking pole, or use a single pole as a center support.",
      "Attach the poncho hood/center loop near the support point.",
      "Stake the corners close to the ground.",
      "Set the back edge low into wind and leave a narrow front opening.",
      "Put your pack under the tarp or use it as a foot-end windblock.",
    ],
    keyDetail: "Keep a separate insulation layer or emergency bivy; a poncho tarp blocks rain but does not provide much warmth.",
  },
  {
    num: 8,
    name: "Tarp-and-Bivy Emergency Cocoon",
    emoji: "🛟",
    bestFor: "Unplanned cold, wet overnight when you cannot make a full campsite.",
    needs: "Tarp or rain poncho, emergency bivy, cord/tape/rocks.",
    buildSteps: [
      "Find the safest nearby site protected from wind — not a drainage channel or under hazardous trees.",
      "Put insulation under you first: sleeping pad, backpack, rope bag, dry clothing, or thick dry vegetation in a genuine emergency.",
      "Climb into your bivy.",
      "Drape the tarp over your body and gear.",
      "Anchor one side against wind using rocks, logs, or pack weight.",
      "Leave a face-sized ventilation opening; never seal yourself inside a non-breathable plastic wrap.",
    ],
    keyDetail: "The goal is not comfort — it is stopping wind, rain, and heat loss until daylight or rescue.",
  },
  {
    num: 9,
    name: "Hammock with Rain Tarp",
    emoji: "🪢",
    bestFor: "Forested, wet ground, warm-to-cool conditions.",
    needs: "Hammock, tree straps, suspension, tarp, ridgeline, stakes; underquilt or insulated pad in cool weather.",
    buildSteps: [
      "Choose two living, healthy trees roughly 12–18 feet apart; do not use dead, damaged, or unstable trees.",
      "Use wide tree straps — never thin cord directly around bark.",
      "Hang hammock seat-height around chair height; aim for a roughly 30-degree suspension angle.",
      "Run a tarp ridgeline above the hammock.",
      "Pitch tarp low and long-axis aligned with the hammock.",
      "Stake tarp sides out; use tarp “doors” or lower edges into wind.",
      "Put insulation under you: an underquilt or sleeping pad. Your sleeping bag alone compresses beneath you and loses insulation.",
    ],
    keyDetail: "A hammock can become dangerously cold below you even in otherwise mild weather.",
  },
  {
    num: 10,
    name: "Hot-Weather Shade Fly",
    emoji: "☀️",
    bestFor: "Desert, prairie, beach, hot dry camps; heat avoidance.",
    needs: "Large light-colored tarp, 2 poles or trekking poles, cord, sandbags/rocks/stakes.",
    buildSteps: [
      "Choose a site safely above tide/flood zones and away from dry washes.",
      "Stretch the tarp high enough for airflow, with a gap beneath every side.",
      "Orient the broad side to block afternoon sun.",
      "Use two poles, trees, vehicle anchors, or natural anchors without damaging vegetation.",
      "In sand, bury filled stuff sacks, rocks, or purpose-made sand anchors as “deadman” anchors.",
      "Lower the windward side slightly if gusty; keep the opposite side open.",
    ],
    keyDetail: "In heat, do not make a low enclosed shelter. Shade plus airflow is the priority.",
  },
  {
    num: 11,
    name: "Desert Windbreak + Shade Canopy",
    emoji: "🏜️",
    bestFor: "Windy desert or beach conditions where sun and blowing sand are issues.",
    needs: "Tarp, poles, cord, sand anchors, optional second smaller tarp.",
    buildSteps: [
      "First make a low windward wall using a tarp pitched close to the ground.",
      "Set the main shade tarp higher behind the windbreak.",
      "Keep the leeward side open to vent heat.",
      "Anchor each point with buried sandbags or heavy rocks placed on reinforcement points.",
      "Check anchors after each gusty period; sand shifts quickly.",
    ],
    keyDetail: "Never set up inside a wash, narrow canyon, or low depression, even if it looks dry. Flash floods can arrive from rain far away.",
  },
  {
    num: 12,
    name: "Four-Season Tent + Snow Wall",
    emoji: "🏔️",
    bestFor: "Winter camping above treeline or in exposed snow terrain.",
    needs: "Four-season tent, snow stakes/deadman anchors, shovel, guylines, sleeping pads.",
    buildSteps: [
      "Confirm the terrain is not in an avalanche path, cornice fall zone, or runoff channel.",
      "Stamp out a level tent platform; let packed snow firm up briefly.",
      "Pitch the tent with its narrowest/strongest end facing the wind.",
      "Use snow stakes or bury stuff sacks filled with snow as deadman anchors; let them freeze/set before loading them hard.",
      "Build a low snow wall several feet upwind, not touching the tent.",
      "Fully guy out the tent and clear accumulating snow from walls and vents.",
      "Keep interior vents open to reduce condensation and carbon-monoxide risk.",
    ],
    keyDetail: "A snow wall reduces wind but is not an avalanche barrier. Do not camp in avalanche terrain just because you can build a wall.",
  },
  {
    num: 13,
    name: "Snow Trench with Tarp Roof",
    emoji: "🥶",
    bestFor: "Emergency winter bivouac where snow is deep, stable, and you have a tarp.",
    needs: "Shovel, tarp, snow saw or trekking poles if available, sleeping pad, insulation.",
    buildSteps: [
      "Choose a flat area well away from avalanche slopes, cornices, tree wells, creeks, and steep runout zones.",
      "Dig a trench just wider and longer than your body, about 2–3 feet deep.",
      "Leave a raised sleeping bench if possible; cold air settles lower in the trench.",
      "Span the top with skis, poles, sturdy branches if already down, or other supports.",
      "Drape tarp over supports and bury/tie the edges securely in snow.",
      "Leave a small vent opening at the head end.",
      "Put your sleeping pad under you before entering.",
    ],
    keyDetail: "This is quicker and often safer than trying to build a snow cave in a storm.",
  },
  {
    num: 14,
    name: "Quinzee Snow Shelter",
    emoji: "❄️",
    bestFor: "Planned cold-weather shelter in deep, packable snow — not a fast emergency solution.",
    needs: "Shovel, probe/sticks, insulation, substantial time and energy.",
    buildSteps: [
      "Pile snow into a mound roughly 7–8 feet high and wide enough for occupants.",
      "Mix snow from different layers while piling; this helps it sinter.",
      "Insert sticks 12–18 inches deep all around the mound as wall-thickness markers.",
      "Let the mound harden for at least 1–2 hours; longer is better.",
      "Dig a small entrance on the downhill side.",
      "Hollow from the bottom upward, keeping walls no thinner than the marker sticks.",
      "Make the sleeping platform higher than the entrance floor.",
      "Poke a small ventilation hole through the roof and keep it open.",
    ],
    keyDetail: "Never sleep in a snow shelter without ventilation. Check the roof regularly and do not use it if it is soft, thin, warming rapidly, or prone to collapse.",
  },
  {
    num: 15,
    name: "Debris Hut",
    emoji: "🌲",
    bestFor: "True survival emergency in temperate forest when you lack a tarp, tent, or bivy.",
    needs: "A sturdy ridge support, deadfall only, abundant dry leaves/needles/grass, time and energy.",
    buildSteps: [
      "Choose a dry site away from dead trees, steep slopes, flood zones, and animal trails.",
      "Prop a long sturdy branch against a stable support — typically a solid stump, rock, or forked tree — not a precarious dead tree.",
      "Add smaller ribs down both sides to form a narrow triangular frame just large enough for your body.",
      "Cover ribs with leaf litter, bark already on the ground, grass, pine needles, or other loose dead material.",
      "Keep adding insulation until the wall/roof layer is roughly 1–2 feet thick.",
      "Build an equally thick bed underneath you; ground insulation is essential.",
      "Close the entrance with a pack, bark sheet, or a loose plug of dry vegetation, leaving ventilation.",
    ],
    keyDetail: "Make it small. A shelter with empty internal space is harder to warm. Do not cut live branches or dismantle habitat except where immediate survival is genuinely at stake.",
  },
]

/** Approaches worth naming explicitly as a bad idea, not just omitting —
 * several are the kind of thing people try by default (a fire right next
 * to a tent, a debris lean-to as a everyday camping shelter) precisely
 * because they seem reasonable until you think through the failure mode. */
export const SHELTERS_NOT_RECOMMENDED: string[] = [
  "A debris lean-to as a default camping shelter. It is slow, often colder than expected, damages the site, and can leave you exhausted.",
  "A fire inside or immediately beside a tent, tarp, bivy, snow shelter, or enclosed natural shelter. It can cause fire, burns, smoke inhalation, or carbon monoxide poisoning.",
  "A “survival shelter” in a dry wash, cave with unknown stability, sea cave, avalanche runout, or beneath dead trees.",
  "A snow cave without ventilation, roof-thickness control, stable snow conditions, and someone able to monitor it.",
  "Any shelter that requires you to burn large amounts of energy when you are already cold, injured, dehydrated, or near exhaustion. In that scenario, get insulated from the ground, block wind, get dry, eat/drink if safe, and activate SOS.",
]
