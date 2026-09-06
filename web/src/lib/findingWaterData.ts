// Structured Finding Water reference data — same pattern as
// firstAidData.ts/shelterData.ts: the page component just maps over this
// rather than embedding 50 methods inline. General wilderness reference
// information, not a substitute for real training. "Obtaining" water here
// never means "automatically safe to drink" — see WATER_TREATMENT_METHODS.

export interface WaterMethod {
  num: number
  name: string
  text: string
}

export interface WaterMethodCategory {
  key: string
  title: string
  emoji: string
  items: WaterMethod[]
}

/** Applies before searching for water at all — when to call for rescue
 * instead, how to reduce how much water you need, and not assuming a
 * clear-looking source is a safe one. */
export const FIRST_PRIORITIES: string[] = [
  "Activate SOS early if you are actually stranded, especially in heat, cold, injury, or remote desert terrain.",
  "Stop sweating unnecessarily: shelter from sun/wind, rest during the hottest hours, loosen or add layers appropriately, and reduce exertion.",
  "Use navigation before improvisation: offline maps, a GPS app, topographic maps, local water reports, and trail signs may reveal springs, creeks, tanks, trailheads, roads, or ranger infrastructure.",
  "Collect first, treat second. Sediment and debris make every treatment method less effective. Let muddy water settle, then pour off clearer water or prefilter it through cloth before filtering/disinfecting.",
  "Never assume “clear” means safe. Animals, upstream people, agricultural runoff, algae, mining contamination, and pathogens may be invisible. Field boiling and filters do not reliably remove dissolved chemicals or toxins.",
]

/**
 * 50 ways to obtain water, in the 3 groups given, ordered roughly from
 * most practical/least damaging to last-ditch — numbered 1-50 across all
 * 3 categories combined (see WATER_METHOD_COUNT / the data-integrity
 * test), matching how the source material is described.
 */
export const WATER_METHOD_CATEGORIES: WaterMethodCategory[] = [
  {
    key: "natural",
    title: "Direct Natural Sources",
    emoji: "💧",
    items: [
      { num: 1, name: "Spring", text: "Look for water emerging from a hillside or rock contact; collect at the point of emergence where possible, then treat." },
      { num: 2, name: "Seep", text: "Search for persistently wet soil, moss, sedges, or green vegetation below slopes; allow water to pool in a small existing depression, then collect and treat." },
      { num: 3, name: "Creek or Stream", text: "Collect from the fastest, clearest current you can safely reach — upstream of camps, crossings, livestock, and stagnant pools." },
      { num: 4, name: "River Edge", text: "Collect from a calmer edge or side channel only if safe; avoid flood conditions, silty water when alternatives exist, and polluted areas." },
      { num: 5, name: "Lake or Pond", text: "Collect from a clear, wind-exposed edge, not a scummy shore; avoid visible algae blooms." },
      { num: 6, name: "High-Elevation Tarn", text: "Use as a source only after treatment; pristine-looking alpine water can still carry pathogens." },
      { num: 7, name: "Snowmelt Creek", text: "Look downstream from lingering snowfields in mountains; treat the water." },
      { num: 8, name: "Glacier-Fed Stream", text: "Let silty “glacial flour” settle, prefilter, then treat; it may be extremely cold and mineral-laden." },
      { num: 9, name: "Seasonal Arroyo Pool", text: "Use only after checking weather; never remain in a wash during rain risk. Treat heavily sedimented water after settling and prefiltration." },
      { num: 10, name: "Rock Basin or Pothole", text: "Scoop pooled rainwater from natural rock depressions, avoiding animal carcasses, droppings, algae, or dead insects." },
      { num: 11, name: "Bedrock Runoff Groove", text: "After rain, collect water flowing on clean rock before it reaches soil and animal-contaminated areas." },
      { num: 12, name: "Waterfall Splash Pool", text: "Collect upstream or from a clean side edge, not directly beneath falling debris." },
      { num: 13, name: "Beaver Pond Outlet", text: "Prefer moving outlet water over stagnant pond water; treat." },
      { num: 14, name: "Wet Meadow Outlet", text: "Look where saturated ground begins to form a narrow flow; collect carefully without trampling the wetland." },
      { num: 15, name: "Coastal Freshwater Seep", text: "Along some shorelines, fresh groundwater may emerge above high tide; only use water that is clearly fresh, then treat." },
      { num: 16, name: "Cave Drip", text: "Collect only from active, clean-looking drips in a safe cave — not standing cave pools; treat and avoid unstable caves." },
      { num: 17, name: "Tree-Hole Water", text: "Last-resort only. Strain debris, then boil or filter/disinfect; it can contain bacteria, insects, and decaying material." },
      { num: 18, name: "Bamboo-Like Hollow Plant Water", text: "This is not broadly reliable in America and should not be assumed safe; use only if you positively know the edible local species and still treat where possible." },
      { num: 19, name: "Water Trapped in a Fallen Log", text: "Last-resort water only; filter debris and treat. It often has high microbial contamination." },
      { num: 20, name: "Fresh Animal-Made Trail Crossing", text: "Follow cautiously only if it leads toward a known drainage or watercourse; do not rely on wildlife signs alone." },
    ],
  },
  {
    key: "atmospheric",
    title: "Rain, Snow & Atmospheric Collection",
    emoji: "🌧️",
    items: [
      { num: 21, name: "Direct Rain Catch", text: "Open a clean bottle or container before rainfall begins; this is one of the best emergency sources." },
      { num: 22, name: "Tarp Rain Catch", text: "Pitch a tarp with a low corner or central depression draining into a bottle or pot." },
      { num: 23, name: "Poncho Rain Catch", text: "Stretch a clean poncho into a basin shape and direct water to one low point." },
      { num: 24, name: "Tent-Fly Runoff Catch", text: "Place a clean container under a designated drip point from a clean rainfly; avoid runoff from dirty fabric if possible." },
      { num: 25, name: "Pack Liner Rain Catch", text: "Line a pack or container with a clean plastic bag and collect rain; transfer to bottles." },
      { num: 26, name: "Trash-Bag Rain Collector", text: "Open a clean bag over a frame or shallow depression, weighting edges while keeping the center low." },
      { num: 27, name: "Improvised Roof Gutter", text: "Use a clean strip of plastic, bark already on the ground, or fabric to channel rain from a tarp into a container." },
      { num: 28, name: "Rainwater from Smooth Rock", text: "After rain begins, wipe initial grime away if possible, then channel cleaner runoff from bare rock to a container." },
      { num: 29, name: "Rainwater from Broad Leaves", text: "Shake or funnel droplets from non-toxic leaves into a container; low yield, but useful." },
      { num: 30, name: "Snow Collection", text: "Melt snow before drinking it. Eating snow can lower body temperature and dehydrate/cool you further." },
      { num: 31, name: "Melted Snow in a Pot", text: "Add small amounts of snow to a little water first so it melts efficiently and does not scorch the pot." },
      { num: 32, name: "Clean Icicle Melt", text: "Melt only clean ice from a safe source; avoid ice near roads, animal activity, or questionable runoff." },
      { num: 33, name: "Dew Wipe", text: "Before sunrise, wipe grass, non-toxic leaves, or a clean tarp with an absorbent cloth and wring it into a container." },
      { num: 34, name: "Dew Tarp", text: "Lay a clean tarp at a slight angle overnight, then wipe or channel condensed water into a bottle at dawn." },
      { num: 35, name: "Condensation Bag on Vegetation", text: "Tie a clear bag over a leafy, non-toxic branch in sun and collect condensation. Yield is usually very small; use it as supplemental water, not a primary plan." },
      { num: 36, name: "Condensation from a Cold Surface", text: "In humid conditions, collect condensed water from a clean bottle, metal pot, or tarp exposed to cooler night air; yields are low." },
      { num: 37, name: "Fog-Net Collection", text: "Stretch fine mesh or fabric perpendicular to prevailing fog/wind and let droplets drain into a container; useful only in reliably foggy coastal or mountain zones." },
      { num: 38, name: "Morning Frost Melt", text: "Collect clean frost from a tarp or smooth surface and melt it; expect low volume." },
      { num: 39, name: "Drip-Line Collection During Rain", text: "Place a container at the drip line of a rock ledge or tarp, not beneath hazardous trees or loose rock." },
      { num: 40, name: "Snowmelt Sheet Collection", text: "Lay a tarp beneath melting snow or along a clean snowbank's runoff edge, while staying clear of avalanche and rockfall hazards." },
    ],
  },
  {
    key: "groundwater",
    title: "Groundwater & Digging Methods",
    emoji: "⛏️",
    items: [
      { num: 41, name: "Existing Spring Box, Stock Tank, or Wildlife Guzzler", text: "Use only when legally accessible; avoid contaminating the source, collect without touching the outlet, and treat water." },
      { num: 42, name: "Hand-Dug Seep Hole in a Dry Streambed", text: "Only as a last resort and only where there is clear evidence of shallow moisture — damp sand, vegetation, or a recent flow line. Dig above the main channel, let water seep in, allow sediment to settle, then collect. Never dig or remain in a wash when storms are possible." },
      { num: 43, name: "Bank Seep Hole Beside a Stream", text: "Dig a shallow hole several feet back from a flowing stream in sandy/gravelly soil; it may yield clearer filtered seep water than the stream itself. Treat it." },
      { num: 44, name: "Inside Bend of a Dry Wash", text: "If digging is justified, test the inside bend or lower gravel bar where groundwater may be closer to the surface — but leave immediately if rain or storm threat develops." },
      { num: 45, name: "Base of a Vegetated Slope", text: "Dig a small test hole downslope from dense green vegetation, especially reeds, willows, cottonwoods, or sedges; stop if it stays dry after a reasonable effort." },
      { num: 46, name: "Base of a Cliff or Rock Contact", text: "Look for moisture where water-bearing layers meet solid rock; collect seepage rather than excavating deeply." },
      { num: 47, name: "Below a Canyon Pour-Off", text: "After confirming there is no rain/flood hazard, inspect protected shaded basins below rock pour-offs for retained water; do not dig under unstable rock." },
      { num: 48, name: "Beach Freshwater Lens Test Hole", text: "Above the high-tide line and behind dunes, shallow groundwater may be less salty in some locations. This is uncertain, easily contaminated, and should be a last resort; taste only a tiny sample first and avoid if brackish." },
      { num: 49, name: "Shallow Well in Sandy Riverbank", text: "In non-flood conditions, dig a narrow hole just above the waterline where sand can filter water; shore it safely, do not enter the hole, allow settling, and treat." },
      { num: 50, name: "Use a Map-Guided Groundwater Target", text: "Rather than random digging, travel toward mapped springs, seeps, windmills, tanks, established campgrounds, trailheads, or perennial drainages. USGS water data includes thousands of real-time monitoring locations, although coverage and accessibility vary." },
    ],
  },
]

export const WATER_METHOD_COUNT = WATER_METHOD_CATEGORIES.reduce((total, category) => total + category.items.length, 0)

/** The one digging technique worth knowing in detail — referenced by
 * several of the groundwater methods above rather than repeated in each. */
export const SEEP_HOLE_INTRO = "This is the one digging method worth knowing — but it is not a guarantee."

export const SEEP_HOLE_STEPS: string[] = [
  "Confirm that no rain, storm, or flash-flood risk exists. Dry washes and canyons can flood from distant rain; get to higher ground if flooding begins.",
  "Look for evidence: damp sand, dense green vegetation, a recently wet channel, an inside bend, a shady bank, or a location below a slope.",
  "Dig a small, shallow hole with a container, stick, or hands — do not create a deep pit and do not climb into it.",
  "Let water seep in for 15–30 minutes.",
  "Wait for sand and sediment to settle.",
  "Scoop from the surface without stirring the bottom.",
  "Prefilter through cloth if dirty.",
  "Boil, or filter and disinfect, before drinking.",
  "If the hole has not produced useful moisture after a reasonable attempt, stop. Digging harder can accelerate dehydration and worsen heat illness.",
]

export interface AvoidMethod {
  name: string
  text: string
}

/** Called out explicitly rather than just omitted — several of these are
 * things people try by default (drinking straight from a clear-looking
 * stream, a solar still) precisely because they seem reasonable until you
 * know why they fail. */
export const WATER_METHODS_TO_AVOID: AvoidMethod[] = [
  { name: "Solar Stills", text: "Usually yield too little water for the energy, time, and sweat required. They are rarely a practical survival answer." },
  { name: "Drinking Urine, Seawater, Radiator Water, or Unknown Industrial Runoff", text: "These can worsen dehydration or cause poisoning." },
  { name: "Cactus Water", text: "Most American cacti do not provide safe drinkable water; some pulps can cause vomiting or diarrhea." },
  { name: "Drinking Directly from a Stream Because It Looks Clean", text: "Clear water can still contain Giardia, Cryptosporidium, bacteria, viruses, or chemical contamination." },
  { name: "Drinking Water with Visible Blue-Green Algae or Surface Scum", text: "Avoid it; boiling does not reliably solve algal toxin risks." },
  { name: "Digging in an Active Channel During Storm Season", text: "Flash floods can rise in minutes." },
  { name: "Relying on Animals as Water Indicators", text: "Animals may travel far, get moisture from food, or lead you to unsafe sources." },
  { name: "Using a Plastic Bag over a Toxic or Unknown Plant", text: "Plant identification errors can create risk, and condensation yields are low anyway." },
  { name: "Trying to Distill Seawater with an Improvised Still While Dehydrated", text: "It is generally too energy-intensive and low-output for a stranded person." },
]

export interface TreatmentMethod {
  method: string
  whatItDoesWell: string
  criticalLimits: string
}

/** "Obtaining" water (the 50 methods above) is never the same as it being
 * safe to drink — this is the other half of the page. */
export const WATER_TREATMENT_METHODS: TreatmentMethod[] = [
  { method: "Boiling", whatItDoesWell: "Most reliable way to kill germs", criticalLimits: "Requires fuel/container; does not remove chemical pollutants, salt, sediment, or algal toxins" },
  { method: "Filter", whatItDoesWell: "Removes sediment and many protozoa/bacteria depending on rating", criticalLimits: "Many filters do not remove viruses; follow the device instructions" },
  { method: "Chemical Disinfection", whatItDoesWell: "Can kill bacteria and viruses", criticalLimits: "Water must be clear first; iodine/chlorine do not reliably kill Cryptosporidium; cold water increases contact time" },
  { method: "UV Purifier", whatItDoesWell: "Works for clear water with charged device", criticalLimits: "Does not work well in cloudy water and requires power" },
  { method: "Settling + Cloth Prefilter", whatItDoesWell: "Improves dirty water before another method", criticalLimits: "Does not make water safe on its own" },
]

export const BOILING_GUIDANCE =
  "For clear water, bring it to a rolling boil for 1 minute, or 3 minutes above 6,500 feet. If boiling is impossible, CDC advises filtering the water first and then disinfecting it. Chlorine or iodine alone are not reliable against Cryptosporidium, so do not treat them as universal solutions."

export const SURVIVAL_DECISION_RULE: string[] = [
  "If you are hot, lost, and waterless: shade first, signal/SOS second, movement only during cooler hours, and travel toward a mapped or likely source rather than digging blindly.",
  "If you are cold and wet: staying warm, dry, and sheltered may be more urgent than spending energy hunting water.",
  "The most reliable prevention is redundancy: carry enough initial water for the route, a filter, chemical backup, a metal pot for boiling, a clean collection bag/tarp, offline maps showing sources, and emergency communication.",
]
