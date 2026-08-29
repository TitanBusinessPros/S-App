export type SpeciesCategory =
  | "edible-plant"
  | "tree-wood"
  | "edible-wildlife"
  | "edible-insect"
  | "dangerous-plant"
  | "dangerous-animal";

export interface WoodUse {
  firewood: boolean;
  smoking: boolean;
  /** Set when this wood should NOT be burned at all (e.g. toxic smoke). */
  burnWarning?: string;
}

export interface SpeciesEntry {
  id: string;
  scientificName: string;
  commonName: string;
  category: SpeciesCategory;
  /** 1-12 (January-December) — months this is realistically present/relevant. */
  activeMonths: number[];
  summary: string;
  edibleParts?: string[];
  cookingNotes?: string;
  dangerNotes?: string;
  safetyNotes?: string;
  woodUse?: WoodUse;
}

/**
 * Starter curated dataset — Oklahoma-common species with well-documented,
 * verifiable facts. This is deliberately NOT exhaustive; it's a growing
 * list, seeded carefully rather than padded. Two categories are
 * intentionally excluded entirely for now: wild mushrooms (look-alike
 * misidentification is one of the most dangerous categories in foraging)
 * and "medicinal" plant uses (see the First Aid guide's own disclaimer).
 */
export const SPECIES_DATA: SpeciesEntry[] = [
  {
    id: "common-persimmon",
    scientificName: "Diospyros virginiana",
    commonName: "Common Persimmon",
    category: "edible-plant",
    activeMonths: [9, 10, 11],
    summary: "Fruit ripens after the first frost. Unripe fruit is intensely astringent — only eat it once it's fully soft.",
    edibleParts: ["Ripe fruit"],
    cookingNotes: "Eat raw once soft and wrinkled, or cook into pulp for bread/pudding.",
  },
  {
    id: "blackberry",
    scientificName: "Rubus spp.",
    commonName: "Blackberry",
    category: "edible-plant",
    activeMonths: [5, 6, 7],
    summary: "Common bramble along field edges and tree lines. Fruit is black and fully detaches from the stem when ripe.",
    edibleParts: ["Ripe fruit"],
    cookingNotes: "Edible raw. Watch for thorns when harvesting.",
  },
  {
    id: "pecan",
    scientificName: "Carya illinoinensis",
    commonName: "Pecan",
    category: "edible-plant",
    activeMonths: [9, 10, 11],
    summary: "Oklahoma's state tree/nut. Nuts drop in fall once husks split.",
    edibleParts: ["Nut meat"],
    cookingNotes: "Edible raw or roasted once shelled.",
  },
  {
    id: "black-walnut",
    scientificName: "Juglans nigra",
    commonName: "Black Walnut",
    category: "edible-plant",
    activeMonths: [9, 10],
    summary: "Nut meat is edible, but the husk stains skin/hands and contains juglone, which is toxic to many plants nearby — don't compost the husks near a garden.",
    edibleParts: ["Nut meat"],
    cookingNotes: "Husk (wear gloves), dry several weeks, then crack — the shell is very hard.",
  },
  {
    id: "cattail",
    scientificName: "Typha latifolia",
    commonName: "Cattail",
    category: "edible-plant",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Grows in wetlands, pond edges, and ditches. One of the most reliable wild edibles — multiple edible parts across the whole year.",
    edibleParts: ["Young shoots (spring)", "Rhizome/root (starchy, year-round)", "Pollen (early summer)"],
    cookingNotes: "Peel shoots and eat raw or cooked; roast or boil rhizomes like a starchy root vegetable.",
  },
  {
    id: "dandelion",
    scientificName: "Taraxacum officinale",
    commonName: "Dandelion",
    category: "edible-plant",
    activeMonths: [3, 4, 5, 9, 10, 11],
    summary: "The whole plant is edible. Leaves get bitter once the plant flowers in hot weather.",
    edibleParts: ["Leaves", "Root", "Flower"],
    cookingNotes: "Young leaves raw or cooked like greens; root can be roasted.",
  },
  {
    id: "wood-sorrel",
    scientificName: "Oxalis spp.",
    commonName: "Wood Sorrel",
    category: "edible-plant",
    activeMonths: [4, 5, 6, 7, 8, 9],
    summary: "Clover-like leaves with a sour, lemony taste from oxalic acid. Fine in small amounts; avoid large quantities, especially with kidney issues.",
    edibleParts: ["Leaves", "Flowers"],
    cookingNotes: "Eat raw in small amounts as a trail nibble or salad addition.",
  },
  {
    id: "poison-ivy",
    scientificName: "Toxicodendron radicans",
    commonName: "Poison Ivy",
    category: "dangerous-plant",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "\"Leaves of three, let it be.\" Causes an itchy contact-dermatitis rash from the urushiol oil in the sap — present in leaves, stems, and roots year-round, even on bare winter vines.",
    dangerNotes: "Wash exposed skin with soap and cool water as soon as possible. The oil can transfer from clothing, tools, and pet fur.",
    safetyNotes: "Never burn it — see the wood/fire warning below.",
  },
  {
    id: "post-oak",
    scientificName: "Quercus stellata",
    commonName: "Post Oak",
    category: "tree-wood",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "One of the most common Oklahoma hardwoods, especially across the Cross Timbers region.",
    woodUse: { firewood: true, smoking: false },
  },
  {
    id: "hickory",
    scientificName: "Carya spp.",
    commonName: "Hickory",
    category: "tree-wood",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Classic dense hardwood — the standard choice for smoking meat, and burns hot and long as firewood too.",
    woodUse: { firewood: true, smoking: true },
  },
  {
    id: "black-locust",
    scientificName: "Robinia pseudoacacia",
    commonName: "Black Locust",
    category: "tree-wood",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Very dense wood that burns hot and long — one of the best firewoods available, but not a traditional smoking wood.",
    woodUse: { firewood: true, smoking: false },
  },
  {
    id: "osage-orange",
    scientificName: "Maclura pomifera",
    commonName: "Osage Orange (Bois d'Arc)",
    category: "tree-wood",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Extremely dense, very hot-burning wood, well known across Oklahoma. Pops and throws sparks heavily — use a screen and keep it away from open tents.",
    woodUse: { firewood: true, smoking: false },
  },
  {
    id: "eastern-red-cedar",
    scientificName: "Juniperus virginiana",
    commonName: "Eastern Red Cedar",
    category: "tree-wood",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Burns fast and hot with heavy popping/sparking, and builds creosote quickly. Usable outdoors with caution; not a good smoking wood — its resin gives meat an off, bitter taste.",
    woodUse: { firewood: true, smoking: false, burnWarning: "Heavy sparking — keep it away from tents/dry brush, and don't use it in an enclosed stove without cleaning the flue often." },
  },
  {
    id: "poison-ivy-wood",
    scientificName: "Toxicodendron radicans (vine/wood)",
    commonName: "Poison Ivy Vine/Wood",
    category: "tree-wood",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Old poison ivy vines can look like ordinary woody vine and end up on a fire pile by accident.",
    woodUse: { firewood: false, smoking: false, burnWarning: "NEVER burn poison ivy. Its urushiol oil aerosolizes in smoke and can cause severe, even life-threatening, reactions in eyes and lungs if inhaled." },
  },
  {
    id: "eastern-cottontail",
    scientificName: "Sylvilagus floridanus",
    commonName: "Eastern Cottontail Rabbit",
    category: "edible-wildlife",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Common small game across Oklahoma, active year-round, most active around dawn and dusk.",
    edibleParts: ["Meat"],
    cookingNotes: "Cook thoroughly (internal temp 165°F+) — rabbits can carry tularemia; avoid harvesting animals that seem sick or move sluggishly.",
  },
  {
    id: "gray-squirrel",
    scientificName: "Sciurus carolinensis",
    commonName: "Gray Squirrel",
    category: "edible-wildlife",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Common in wooded areas year-round, most active in early morning.",
    edibleParts: ["Meat"],
    cookingNotes: "Cook thoroughly. Skin promptly after harvesting.",
  },
  {
    id: "white-tailed-deer",
    scientificName: "Odocoileus virginianus",
    commonName: "White-tailed Deer",
    category: "edible-wildlife",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Oklahoma's primary big game species, present statewide year-round. Outside a genuine survival emergency, hunting requires a license and an open season.",
    edibleParts: ["Meat"],
    cookingNotes: "Field dress promptly to cool the meat and reduce spoilage risk.",
  },
  {
    id: "field-cricket",
    scientificName: "Gryllus spp.",
    commonName: "Field Cricket",
    category: "edible-insect",
    activeMonths: [5, 6, 7, 8, 9, 10],
    summary: "Common and easy to catch. A genuine, well-documented survival food source.",
    edibleParts: ["Whole insect"],
    cookingNotes: "Always cook before eating (roast or boil) — never eat raw. Avoid any collected near pesticide use.",
  },
  {
    id: "copperhead",
    scientificName: "Agkistrodon contortrix",
    commonName: "Copperhead",
    category: "dangerous-animal",
    activeMonths: [4, 5, 6, 7, 8, 9, 10],
    summary: "Venomous pit viper, common in wooded and rocky areas across Oklahoma. Dormant through winter.",
    dangerNotes: "Bites are rarely fatal to a healthy adult but always require medical attention. Most bites happen when someone tries to handle or kill the snake.",
    safetyNotes: "If you see one: back away, give it space, and leave it alone. Watch where you place hands and feet around rock piles and log piles.",
  },
  {
    id: "cottonmouth",
    scientificName: "Agkistrodon piscivorus",
    commonName: "Cottonmouth (Water Moccasin)",
    category: "dangerous-animal",
    activeMonths: [4, 5, 6, 7, 8, 9, 10],
    summary: "Venomous, found in and around Oklahoma's rivers, ponds, and wetlands. Dormant through winter.",
    dangerNotes: "Will stand its ground more than most snakes — give it a wide berth rather than trying to move past it.",
    safetyNotes: "Stay alert near water's edge and fallen logs over water. Don't reach into brush along a bank without looking first.",
  },
  {
    id: "western-diamondback",
    scientificName: "Crotalus atrox",
    commonName: "Western Diamondback Rattlesnake",
    category: "dangerous-animal",
    activeMonths: [4, 5, 6, 7, 8, 9, 10],
    summary: "Venomous, found across western/central Oklahoma. Dormant through winter.",
    dangerNotes: "The rattle is a warning — if you hear it, stop moving, locate the snake, and back away slowly.",
    safetyNotes: "Never step or reach where you can't see. Most bites are on the hands or lower legs from surprising the snake at close range.",
  },
  {
    id: "black-widow",
    scientificName: "Latrodectus mactans",
    commonName: "Black Widow Spider",
    category: "dangerous-animal",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Venomous, common statewide in undisturbed dark spaces — woodpiles, sheds, dense brush.",
    dangerNotes: "Bites cause significant pain and muscle cramping; seek medical care, especially for children, the elderly, or anyone with health conditions.",
    safetyNotes: "Shake out gloves and boots, and look before reaching into woodpiles or dark crevices.",
  },
  {
    id: "coyote",
    scientificName: "Canis latrans",
    commonName: "Coyote",
    category: "dangerous-animal",
    activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    summary: "Common statewide. Generally avoids humans but can become bold around food sources or during pup-rearing season.",
    dangerNotes: "Attacks on adult humans are rare, but coyotes can carry rabies.",
    safetyNotes: "If one approaches: make noise, make yourself look big, maintain eye contact, and back away slowly — never run or turn your back.",
  },
];
