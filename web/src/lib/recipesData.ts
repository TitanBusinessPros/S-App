/**
 * Wild-game recipes, organized one of two ways:
 *
 * 1. Individual species with no blanket grouping (mammals, plus the
 *    cross-cutting "Offal" and "Eggs" food-type categories) file into the
 *    plain A-Z index by `indexLetter` — normally the animal's own name,
 *    except Offal/Eggs use their own category name's letter regardless of
 *    which animal the organs/eggs came from.
 * 2. Everything else belongs to one big, related group — Birds, Fish,
 *    Frogs, Lizards, Turtles, Snakes, Crawfish, Mussels, Insects — and is
 *    pulled out of the A-Z index entirely into its own dedicated page
 *    section via `category`, so a group's recipes and all of its
 *    species-status/safety guide content live together in one place
 *    instead of being scattered across the alphabet. See
 *    RECIPE_CATEGORIES for the display metadata for each category.
 *
 * A recipe sets exactly one of `indexLetter` or `category`, never both.
 */
export interface Recipe {
  id: string
  /** Display name for this animal/group, e.g. "Deer", "Offal". */
  animal: string
  /** The alphabet index this recipe files under in the plain A-Z index. Omit when `category` is set. */
  indexLetter?: string
  /** The dedicated category section this recipe belongs to. Omit when `indexLetter` is set. */
  category?: RecipeCategory
  emoji: string
  title: string
  /** Optional lead-in text shown once above the recipe (context/flavor notes). */
  intro?: string
  /** Optional safety/handling caution, rendered prominently. */
  caution?: string
  /** Omitted for recipes given as a flat instruction list with no separate ingredients section. */
  ingredients?: string[]
  instructions: string[]
  tip?: string
}

/** The dedicated, self-contained page sections — each bundles its own
 * recipes together with all of its species-status/safety guide content,
 * rather than that content being interleaved into the plain A-Z index. */
export type RecipeCategory = 'Birds' | 'Fish' | 'Frogs' | 'Lizards' | 'Turtles' | 'Snakes' | 'Crawfish' | 'Mussels' | 'Insects'

export interface RecipeCategoryInfo {
  key: RecipeCategory
  title: string
  emoji: string
}

/** Display metadata for each dedicated category section, in the order
 * they're rendered on the Recipes page. */
export const RECIPE_CATEGORIES: RecipeCategoryInfo[] = [
  { key: 'Birds', title: 'Birds', emoji: '🐦' },
  { key: 'Fish', title: 'Fish', emoji: '🐟' },
  { key: 'Frogs', title: 'Frogs', emoji: '🐸' },
  { key: 'Lizards', title: 'Lizards', emoji: '🦎' },
  { key: 'Turtles', title: 'Turtles', emoji: '🐢' },
  { key: 'Snakes', title: 'Snakes', emoji: '🐍' },
  { key: 'Crawfish', title: 'Crawfish & Crayfish', emoji: '🦞' },
  { key: 'Mussels', title: 'Mussels, Clams & Snails', emoji: '🦪' },
  { key: 'Insects', title: 'Insects', emoji: '🦗' },
]

export const RECIPES: Recipe[] = [
  {
    id: 'deer-country-venison-roast',
    animal: 'Deer',
    indexLetter: 'D',
    emoji: '🦌',
    title: 'Country Venison Roast',
    ingredients: [
      '2–3 lb venison roast',
      '4 slices bacon',
      '1 onion, sliced',
      '3 garlic cloves',
      '2 cups beef or venison broth',
      '1 tbsp Worcestershire sauce',
      '1 tsp salt',
      '1 tsp black pepper',
      '1 tsp dried thyme',
      'Carrots and potatoes',
    ],
    instructions: [
      'Trim away silver skin and excess fat.',
      'Season the roast with salt, pepper, and thyme.',
      'Wrap or cover the roast with bacon.',
      'Brown it on all sides in a heavy pot.',
      'Add onion, garlic, broth, and Worcestershire sauce.',
      'Cover and cook at 325°F for about 2½–3 hours, adding potatoes and carrots during the last hour.',
      'Cook until tender and verify the meat reaches a safe internal temperature.',
      'Let rest 10–15 minutes before slicing.',
    ],
    tip: 'Venison is very lean, so bacon, butter, or a sauce helps prevent it from becoming dry.',
  },
  {
    id: 'elk-steaks-mushroom-gravy',
    animal: 'Elk',
    indexLetter: 'E',
    emoji: '🫎',
    title: 'Elk Steaks with Mushroom Gravy',
    ingredients: [
      '2 elk steaks',
      '2 tbsp butter',
      '1 cup mushrooms',
      '½ onion',
      '1 cup beef/venison broth',
      '½ cup heavy cream',
      'Salt and pepper',
      '½ tsp garlic powder',
    ],
    instructions: [
      'Pat steaks dry and season with salt, pepper, and garlic.',
      'Heat a skillet very hot.',
      'Add butter and sear steaks on both sides.',
      'Remove steaks and let them rest.',
      'Cook onions and mushrooms in the same skillet.',
      'Add broth and scrape up the browned bits.',
      'Stir in cream and simmer until thickened.',
      'Return steaks briefly to the pan and serve with the gravy.',
    ],
    tip: 'Elk is lean and can become tough if overcooked.',
  },
  {
    id: 'pronghorn-slow-cooked-roast',
    animal: 'Pronghorn',
    indexLetter: 'P',
    emoji: '🦌',
    title: 'Slow-Cooked Pronghorn Roast',
    intro: 'Pronghorn can have a stronger flavor than venison, so slow cooking works well.',
    ingredients: [
      '2–3 lb pronghorn roast',
      '1 onion',
      '3 garlic cloves',
      '2 cups broth',
      '1 cup red wine or additional broth',
      '2 carrots',
      '2 celery stalks',
      '1 tbsp Worcestershire sauce',
      'Salt, pepper, and thyme',
    ],
    instructions: [
      'Trim the meat carefully.',
      'Season and brown the roast.',
      'Put it into a Dutch oven with vegetables.',
      'Add broth, wine, Worcestershire sauce, and thyme.',
      'Cover and cook at 300–325°F for approximately 3 hours, or until fork-tender.',
      'Check the internal temperature and allow the roast to rest before serving.',
    ],
  },
  {
    id: 'rabbit-southern-fried',
    animal: 'Rabbit',
    indexLetter: 'R',
    emoji: '🐇',
    title: 'Southern Fried Rabbit',
    ingredients: [
      '1 cleaned rabbit, cut into pieces',
      '2 cups buttermilk',
      '1½ cups flour',
      '1 tsp salt',
      '1 tsp black pepper',
      '1 tsp paprika',
      '½ tsp garlic powder',
      'Cooking oil',
    ],
    instructions: [
      'Soak rabbit pieces in buttermilk for 4–12 hours refrigerated.',
      'Mix flour, salt, pepper, paprika, and garlic powder.',
      'Remove rabbit from buttermilk and coat thoroughly.',
      'Heat oil in a heavy skillet.',
      'Fry rabbit until browned.',
      'Reduce heat and continue cooking until the thickest pieces are completely cooked.',
      'Drain on a rack or paper towels.',
    ],
    tip: "Rabbit is extremely lean. Don't rush the cooking or it can become dry.",
  },
  {
    id: 'squirrel-dumplings',
    animal: 'Squirrel',
    indexLetter: 'S',
    emoji: '🐿️',
    title: 'Squirrel & Dumplings',
    ingredients: [
      '2–4 cleaned squirrels',
      '6 cups chicken broth',
      '1 onion',
      '2 celery stalks',
      '2 carrots',
      'Salt and pepper',
      '1 tsp thyme',
      'Biscuit/dumpling dough',
    ],
    instructions: [
      'Put squirrel, broth, onion, celery, carrots, salt, pepper, and thyme in a pot.',
      'Bring to a boil, then reduce to a gentle simmer.',
      'Cook until the meat is very tender and separates from the bones.',
      'Remove squirrel and carefully pick the meat from the bones.',
      'Return meat to the broth.',
      'Drop dumpling dough into the simmering broth.',
      'Cover and cook until dumplings are fluffy and cooked through.',
    ],
  },
  {
    id: 'beaver-braised-root-vegetables',
    animal: 'Beaver',
    indexLetter: 'B',
    emoji: '🦫',
    title: 'Braised Beaver with Root Vegetables',
    ingredients: [
      '2–3 lb cleaned beaver meat',
      '4 slices bacon',
      '1 onion',
      '3 garlic cloves',
      '2 cups beef/venison broth',
      '1 cup red wine or broth',
      'Carrots',
      'Potatoes',
      'Salt, pepper, and thyme',
    ],
    instructions: [
      'Remove the skin, fat, and scent glands carefully during butchering.',
      'Cut meat into large pieces.',
      'Brown bacon and then brown the beaver pieces in the bacon fat.',
      'Add onion and garlic.',
      'Add broth and wine.',
      'Cover and braise at 300–325°F for several hours, until tender.',
      'Add potatoes and carrots toward the end.',
      'Cook thoroughly and serve with the braising liquid.',
    ],
    tip: 'Beaver benefits tremendously from slow, moist cooking.',
  },
  {
    id: 'raccoon-slow-braised',
    animal: 'Raccoon',
    indexLetter: 'R',
    emoji: '🦝',
    title: 'Slow-Braised Raccoon',
    caution:
      'Raccoon deserves extra caution because of parasite and disease concerns. Only use an animal that was legally harvested, healthy-looking, properly field-dressed, and handled hygienically.',
    ingredients: [
      '2–3 lb cleaned raccoon meat',
      '4 slices bacon',
      '1 onion',
      '3 garlic cloves',
      '2 cups broth',
      '1 cup apple cider',
      '1 tbsp Worcestershire sauce',
      'Salt, pepper, and thyme',
      'Potatoes and carrots',
    ],
    instructions: [
      'Remove skin and carefully trim away excess fat.',
      'Cut meat into manageable pieces.',
      'Brown bacon and then brown the meat thoroughly.',
      'Add onion and garlic.',
      'Add broth, cider, Worcestershire sauce, and seasonings.',
      'Cover and braise slowly until very tender.',
      'Add vegetables during the final portion of cooking.',
      'Cook the meat thoroughly rather than serving it rare.',
    ],
  },
  {
    id: 'opossum-braised-sweet-potatoes',
    animal: 'Opossum',
    indexLetter: 'O',
    emoji: '🐗',
    title: 'Braised Opossum with Sweet Potatoes',
    caution: 'Opossum is another animal where extra conservatism about consumption and handling is warranted.',
    ingredients: [
      '2–3 lb properly dressed opossum',
      '3 sweet potatoes',
      '1 onion',
      '2 cups broth',
      '½ cup apple cider',
      '2 garlic cloves',
      'Salt and pepper',
      'Thyme',
    ],
    instructions: [
      'Carefully skin and dress the animal, removing excess fat.',
      'Cut into pieces.',
      'Brown the meat.',
      'Place it in a covered Dutch oven with onion, garlic, broth, cider, and seasonings.',
      'Add sweet potatoes.',
      'Braise slowly until the meat is very tender.',
      'Ensure the meat is thoroughly cooked throughout before serving.',
    ],
  },
  {
    id: 'muskrat-stew',
    animal: 'Muskrat',
    indexLetter: 'M',
    emoji: '🐀',
    title: 'Muskrat Stew',
    ingredients: [
      '2–3 cleaned muskrats',
      '4 cups broth',
      '1 onion',
      '2 carrots',
      '2 potatoes',
      '2 celery stalks',
      '1 tbsp flour',
      '2 tbsp butter',
      'Salt and pepper',
      'Thyme',
    ],
    instructions: [
      'Skin and clean the muskrat carefully.',
      'Trim away excess fat and any glands.',
      'Brown the meat in butter.',
      'Add onion, carrots, celery, and broth.',
      'Simmer gently until the meat becomes tender.',
      'Add potatoes.',
      'Mix flour with a little cold water and stir into the stew to thicken.',
      'Continue cooking until everything is tender and the meat is thoroughly cooked.',
    ],
  },
  {
    id: 'nutria-cajun-stew',
    animal: 'Nutria',
    indexLetter: 'N',
    emoji: '🐀',
    title: 'Cajun Nutria Stew',
    ingredients: [
      '2–3 lb cleaned nutria',
      '1 onion',
      '1 bell pepper',
      '2 celery stalks',
      '3 garlic cloves',
      '1 can diced tomatoes',
      '3 cups broth',
      '1 tbsp Cajun seasoning',
      '1 tbsp flour',
      '2 tbsp oil',
    ],
    instructions: [
      'Skin and thoroughly clean the nutria.',
      'Cut into stew-sized pieces.',
      'Season and brown the meat in oil.',
      'Remove the meat and sauté onion, pepper, celery, and garlic.',
      'Sprinkle in flour and stir.',
      'Add tomatoes and broth.',
      'Return the meat to the pot.',
      'Cover and simmer slowly until tender.',
      'Make sure the meat is thoroughly cooked before serving.',
    ],
  },
  {
    id: 'armadillo-slow-cooked-chili',
    animal: 'Armadillo',
    indexLetter: 'A',
    emoji: '🦔',
    title: 'Slow-Cooked Armadillo Chili',
    caution:
      "Armadillo requires extra caution because of its well-known association with Mycobacterium leprae in some populations. Casually harvesting one for food is not recommended, and gloves should be used when handling the carcass. Only proceed if it was legally harvested and permitted for consumption in your area.",
    ingredients: [
      '2 lb properly dressed armadillo meat',
      '1 onion',
      '3 garlic cloves',
      '2 cans tomatoes',
      '2 cans beans',
      '2 tbsp chili powder',
      '1 tsp cumin',
      '3 cups broth',
      'Salt and pepper',
    ],
    instructions: [
      'Handle and dress the carcass with appropriate protective precautions.',
      'Trim the meat carefully.',
      'Cut into small pieces.',
      'Brown thoroughly in a heavy pot.',
      'Add onion and garlic.',
      'Add tomatoes, broth, chili powder, and cumin.',
      'Cover and simmer slowly until completely tender.',
      'Add beans near the end.',
      "Cook thoroughly — don't consume undercooked armadillo.",
    ],
  },
  {
    id: 'offal-liver-pan-fried',
    animal: 'Offal',
    indexLetter: 'O',
    emoji: '🥩',
    title: 'Pan-Fried Liver & Onions',
    intro:
      'Deer/Elk Liver. Wild-game organs can be delicious, but not every organ from every species should automatically be eaten. Avoid organs that look abnormal, have unusual spots, cysts, discoloration, parasites, or an abnormal odor.',
    ingredients: ['Fresh liver', '1 large onion', 'Flour', 'Salt and pepper', 'Butter', 'Bacon'],
    instructions: [
      'Remove connective tissue and membranes.',
      'Slice liver relatively thinly.',
      'Soak briefly in milk if you prefer a milder flavor.',
      'Fry bacon and reserve the fat.',
      'Cook onions until soft.',
      'Lightly flour and season the liver.',
      'Fry quickly in the bacon fat.',
      'Cook to a safe internal temperature and avoid serving it raw or undercooked.',
      'Serve immediately with onions.',
    ],
  },
  {
    id: 'offal-heart-grilled',
    animal: 'Offal',
    indexLetter: 'O',
    emoji: '🥩',
    title: 'Grilled Venison/Elk Heart',
    instructions: [
      'Split the heart open.',
      'Remove valves, connective tissue, and large vessels.',
      'Wash and dry thoroughly.',
      'Slice into steaks.',
      'Marinate with oil, garlic, Worcestershire sauce, salt, and pepper.',
      'Grill or pan-sear.',
      'Cook thoroughly and slice thinly across the grain.',
    ],
  },
  {
    id: 'offal-kidney-country-fried',
    animal: 'Offal',
    indexLetter: 'O',
    emoji: '🥩',
    title: 'Country-Fried Kidney',
    instructions: [
      'Clean thoroughly and remove the central fat/connective tissue.',
      'Soak in salted water or milk to mellow the flavor.',
      'Slice.',
      'Flour and season.',
      'Fry with onions.',
      'Cook thoroughly before eating.',
    ],
  },
  {
    id: 'offal-tongue-braised',
    animal: 'Offal',
    indexLetter: 'O',
    emoji: '🥩',
    title: 'Braised Game Tongue',
    intro: 'This works particularly well with deer or elk.',
    instructions: [
      'Wash the tongue thoroughly.',
      'Simmer in salted water with onion, garlic, and bay leaf until very tender.',
      'Remove and cool enough to handle.',
      'Peel off the outer skin.',
      'Slice the tongue.',
      'Brown the slices in butter.',
      'Serve with gravy or mustard.',
    ],
  },
  {
    id: 'turkey-herb-roasted',
    animal: 'Turkey',
    category: 'Birds',
    emoji: '🦃',
    title: 'Herb-Roasted Wild Turkey',
    ingredients: [
      '1 cleaned wild turkey',
      '½ cup butter',
      '4 garlic cloves',
      '1 onion',
      '2 cups chicken/turkey broth',
      'Rosemary and thyme',
      'Salt and pepper',
    ],
    instructions: [
      'Remove the giblets and thoroughly clean the cavity.',
      'Pat the turkey dry.',
      'Rub the entire bird with softened butter, garlic, salt, pepper, rosemary, and thyme.',
      'Put onion inside the cavity.',
      'Place breast-side up in a roasting pan.',
      'Add broth to the bottom of the pan.',
      'Roast at 325°F, basting periodically.',
      'Because wild turkey is leaner than domestic turkey, watch it carefully to prevent drying.',
      'Cook until the thickest portions reach a safe internal temperature.',
      'Rest for at least 15–20 minutes before carving.',
    ],
    tip: 'Good portions: breast, thighs, legs, wings, heart, liver, gizzard.',
  },
  {
    id: 'quail-bacon-wrapped-roasted',
    animal: 'Quail',
    category: 'Birds',
    emoji: '🐦',
    title: 'Bacon-Wrapped Roasted Quail',
    ingredients: [
      '4–6 cleaned quail',
      '4–6 strips bacon',
      '2 tbsp butter',
      'Garlic',
      'Salt and pepper',
      'Thyme',
      '½ cup chicken broth',
    ],
    instructions: [
      'Remove the innards and rinse the birds thoroughly.',
      'Pat dry.',
      'Season inside and outside with salt, pepper, garlic, and thyme.',
      'Wrap each bird with bacon.',
      'Put them in a roasting dish with butter and broth.',
      'Roast at 375°F until the meat is fully cooked.',
      'Remove the bacon during the final few minutes if you want the skin more browned.',
      'Rest briefly before serving.',
    ],
    tip: 'Quail are small, so they cook quickly and can dry out easily.',
  },
  {
    id: 'pheasant-mushroom-gravy',
    animal: 'Pheasant',
    category: 'Birds',
    emoji: '🪶',
    title: 'Pheasant with Mushroom Gravy',
    ingredients: [
      '1 cleaned pheasant',
      '4 slices bacon',
      '1 onion',
      '1 cup mushrooms',
      '2 cups chicken broth',
      '½ cup cream',
      'Thyme',
      'Salt and pepper',
    ],
    instructions: [
      'Pat the pheasant dry and season it.',
      'Wrap the breast with bacon.',
      'Brown the bird in a Dutch oven.',
      'Add onion and mushrooms.',
      'Pour in broth.',
      'Cover and bake at 325°F until tender and fully cooked.',
      'Remove the pheasant.',
      'Stir cream into the cooking liquid and simmer until it forms a gravy.',
      'Serve the pheasant with mushroom gravy.',
    ],
  },
  {
    id: 'dove-southern-fried',
    animal: 'Dove',
    category: 'Birds',
    emoji: '🕊️',
    title: 'Southern Fried Dove',
    ingredients: [
      '8–12 cleaned dove breasts',
      '1 cup buttermilk',
      '1½ cups flour',
      'Salt and pepper',
      'Garlic powder',
      'Paprika',
      'Cooking oil',
    ],
    instructions: [
      'Remove the breasts from the birds.',
      'Refrigerate them in buttermilk for several hours.',
      'Mix flour with seasonings.',
      'Remove breasts from the buttermilk and coat in flour.',
      'Heat oil in a skillet.',
      'Fry until browned and completely cooked.',
      'Drain and serve immediately.',
    ],
    tip: 'Dove breast is very lean and is excellent wrapped in bacon and grilled as well.',
  },
  {
    id: 'duck-roast-with-apples',
    animal: 'Duck',
    category: 'Birds',
    emoji: '🦆',
    title: 'Roast Wild Duck with Apples',
    ingredients: [
      '1 cleaned wild duck',
      '1 apple',
      '1 onion',
      '2 garlic cloves',
      'Salt and pepper',
      'Thyme',
      '1 cup broth',
    ],
    instructions: [
      'Remove the giblets and carefully clean the duck.',
      'Pat it dry.',
      'Season the cavity and exterior.',
      'Put chopped apple and onion inside the cavity.',
      'Place duck breast-side up in a roasting pan.',
      'Add broth.',
      'Roast at approximately 350°F, periodically draining excess rendered fat.',
      'Cook until the thickest meat reaches a safe temperature.',
      'Rest before carving.',
    ],
    tip: 'Wild duck can have a stronger flavor than domestic duck. A short saltwater or buttermilk soak can mellow it.',
  },
  {
    id: 'goose-slow-roasted',
    animal: 'Goose',
    category: 'Birds',
    emoji: '🪿',
    title: 'Slow-Roasted Wild Goose',
    ingredients: [
      '1 cleaned wild goose',
      '1 onion',
      '2 apples',
      'Garlic',
      'Salt and pepper',
      'Thyme',
      '2 cups broth',
    ],
    instructions: [
      'Remove the giblets and excess fat.',
      'Prick the skin lightly in several places without deeply piercing the meat.',
      'Season thoroughly.',
      'Stuff loosely with onion and apples.',
      'Place in a roasting pan with broth.',
      'Roast at 325°F, periodically draining fat.',
      'Continue cooking until the meat is completely cooked.',
      'Rest 15–20 minutes before carving.',
    ],
    tip: "Goose breast can also be removed and cooked separately like a steak, but don't rely on appearance alone to determine doneness.",
  },
  {
    id: 'coot-wild-rice-stew',
    animal: 'Coot',
    category: 'Birds',
    emoji: '🐦',
    title: 'Coot & Wild Rice Stew',
    intro:
      'Coot is sometimes called "mud hen." Proper cleaning and removal of skin/fat are especially important because the flavor can be quite strong.',
    ingredients: [
      '2 cleaned coots',
      '6 cups chicken broth',
      '1 cup wild rice',
      '1 onion',
      '2 carrots',
      '2 celery stalks',
      '2 garlic cloves',
      'Salt and pepper',
      'Thyme',
    ],
    instructions: [
      'Skin and clean the birds carefully.',
      'Trim away excess fat.',
      'Put the birds into broth with onion, carrots, celery, garlic, and thyme.',
      'Simmer until the meat is tender and completely cooked.',
      'Remove the birds and pick the meat from the bones.',
      'Return the meat to the broth.',
      'Add wild rice.',
      'Simmer until the rice is tender.',
      'Season to taste.',
    ],
  },
  {
    id: 'crane-roasted-sandhill-breast',
    animal: 'Crane',
    category: 'Birds',
    emoji: '🐦',
    title: 'Roasted Sandhill Crane Breast',
    ingredients: [
      '2 sandhill crane breasts',
      '2 tbsp butter',
      'Garlic',
      'Salt and pepper',
      'Rosemary',
      '½ cup red wine or broth',
    ],
    instructions: [
      'Remove the breast meat from the bone.',
      'Remove any obvious silver skin.',
      'Season with salt, pepper, garlic, and rosemary.',
      'Sear in butter in a very hot skillet.',
      'Add wine or broth.',
      'Transfer to a 375°F oven.',
      'Cook until the meat reaches a safe temperature.',
      'Rest several minutes before slicing.',
    ],
    tip: 'Sandhill crane is often considered one of the better-tasting game birds and is sometimes nicknamed "ribeye of the sky." See the Protected Birds guide above — sandhill crane hunting is legal only in designated areas/seasons with the correct license and permits.',
  },
  {
    id: 'other-small-game-birds-butter-roasted',
    animal: 'Other Small Game Birds',
    category: 'Birds',
    emoji: '🐦',
    title: 'Butter-Roasted Small Game Birds',
    intro:
      'Where legal and properly identified, birds such as certain grouse, woodcock, snipe, and other officially huntable game birds can be prepared similarly.',
    caution:
      'Do not eat unidentified "small birds." Identification needs to happen before harvest, not afterward — see the Protected Birds guide above.',
    ingredients: ['Small game birds', 'Butter', 'Salt and pepper', 'Garlic', 'Thyme', 'Bacon', 'Broth'],
    instructions: [
      'Confirm the species is legal to harvest.',
      'Pluck or skin according to the species and your preferred preparation.',
      'Remove the digestive tract and other unwanted organs.',
      'Pat the bird dry.',
      'Season with butter, salt, pepper, garlic, and thyme.',
      'Wrap larger birds with bacon.',
      'Roast around 375°F until thoroughly cooked.',
      'Allow to rest before eating.',
    ],
  },
  {
    id: 'eggs-wild-bird-scrambled',
    animal: 'Eggs',
    indexLetter: 'E',
    emoji: '🥚',
    title: 'Scrambled Wild-Bird Eggs',
    caution:
      'Do not collect eggs from nests of wild birds unless you know that collection is legal and specifically authorized. Many wild bird species and their eggs are protected. Only prepare eggs you know were legally and safely obtained.',
    ingredients: ['Wild-bird eggs', 'Salt and pepper', 'Butter'],
    instructions: [
      'Crack eggs into a bowl.',
      'Whisk with a little salt and pepper.',
      'Melt butter in a skillet.',
      'Add eggs.',
      'Stir gently until completely set.',
      'Serve immediately.',
    ],
  },
  {
    id: 'offal-bird-heart-grilled',
    animal: 'Offal',
    indexLetter: 'O',
    emoji: '🥩',
    title: 'Grilled Game-Bird Hearts',
    instructions: [
      'Clean the heart by removing vessels and connective tissue.',
      'Split and rinse.',
      'Pat dry.',
      'Marinate with oil, garlic, salt, and pepper.',
      'Grill or pan-sear.',
      'Cook thoroughly.',
      'Slice thinly.',
    ],
  },
  {
    id: 'offal-bird-liver-pan-fried',
    animal: 'Offal',
    indexLetter: 'O',
    emoji: '🥩',
    title: 'Pan-Fried Game-Bird Liver',
    caution: 'Discard a liver with unusual discoloration, cysts, spots, parasites, or an abnormal odor.',
    instructions: [
      'Remove the liver carefully.',
      'Discard it if it has unusual discoloration, cysts, spots, parasites, or an abnormal odor.',
      'Remove connective tissue.',
      'Season.',
      'Pan-fry in butter with onions.',
      'Cook thoroughly.',
    ],
  },
  {
    id: 'offal-bird-gizzard-fried',
    animal: 'Offal',
    indexLetter: 'O',
    emoji: '🥩',
    title: 'Fried Game-Bird Gizzards',
    intro: 'Gizzards are particularly good in fried preparations.',
    instructions: [
      'Split the gizzard.',
      'Remove the tough inner lining and grit.',
      'Wash thoroughly.',
      'Simmer until tender.',
      'Slice.',
      'Bread and fry.',
    ],
  },
  {
    id: 'fish-bass-southern-fried',
    animal: 'Bass',
    category: 'Fish',
    emoji: '🐟',
    title: 'Southern Fried Bass',
    intro: 'Good for: largemouth, smallmouth, spotted bass.',
    ingredients: [
      '4 bass fillets',
      '1 cup cornmeal',
      '½ cup flour',
      '1 tsp salt',
      '1 tsp black pepper',
      '1 tsp paprika',
      '½ tsp garlic powder',
      '1 cup buttermilk',
      'Cooking oil',
    ],
    instructions: [
      'Fillet the bass and remove the skin.',
      'Check carefully for bones.',
      'Soak the fillets in buttermilk for 30–60 minutes.',
      'Combine cornmeal, flour, and seasonings.',
      'Coat the fish thoroughly.',
      'Heat oil in a skillet.',
      'Fry until golden brown and the fish flakes easily.',
      'Serve with lemon, hot sauce, or tartar sauce.',
    ],
  },
  {
    id: 'fish-crappie-classic-fry',
    animal: 'Crappie',
    category: 'Fish',
    emoji: '🐟',
    title: 'Classic Crappie Fry',
    ingredients: ['Crappie fillets', 'Cornmeal', 'Flour', 'Salt and pepper', 'Paprika', 'Garlic powder', 'Milk or buttermilk', 'Oil'],
    instructions: [
      'Fillet and skin the crappie.',
      'Remove any remaining bones.',
      'Dip in milk or buttermilk.',
      'Coat with seasoned cornmeal.',
      'Fry until golden and completely cooked.',
      'Drain and serve hot.',
    ],
    tip: 'Crappie are among the best freshwater fish for a simple fish fry.',
  },
  {
    id: 'fish-catfish-southern',
    animal: 'Catfish',
    category: 'Fish',
    emoji: '🐟',
    title: 'Southern Catfish',
    ingredients: ['Catfish fillets', '1 cup cornmeal', '½ cup flour', 'Salt', 'Black pepper', 'Paprika', 'Garlic powder', 'Buttermilk', 'Oil'],
    instructions: [
      'Skin the catfish if necessary.',
      'Soak fillets in buttermilk.',
      'Mix cornmeal, flour, and seasonings.',
      'Coat the fish.',
      'Fry in hot oil until golden brown and fully cooked.',
      'Serve with hush puppies, coleslaw, and lemon.',
    ],
    tip: 'Whole catfish: you can also split and fry smaller catfish whole after scaling/cleaning them.',
  },
  {
    id: 'fish-gar-fried-nuggets',
    animal: 'Gar',
    category: 'Fish',
    emoji: '🐟',
    title: 'Fried Gar Nuggets',
    intro: 'Good for: alligator gar, longnose gar, spotted gar, shortnose gar where legally harvested.',
    caution: 'Never eat gar eggs/roe. Gar eggs contain toxins and should be discarded.',
    ingredients: ['Gar fillets', '1 cup cornmeal', '½ cup flour', 'Salt and pepper', 'Cajun seasoning', 'Egg', 'Milk', 'Oil'],
    instructions: [
      'Be extremely careful when cleaning gar — their jaws and teeth are formidable, and their scales are unusually hard.',
      'Fillet the fish rather than attempting to scale it normally.',
      'Remove the tough outer skin.',
      'Cut the meat into nuggets.',
      'Dip in beaten egg mixed with milk.',
      'Coat in seasoned cornmeal/flour.',
      'Fry until golden and cooked through.',
      'Serve with remoulade or tartar sauce.',
    ],
    tip: 'Gar meat is firm and often compared to chicken-like fish in texture.',
  },
  {
    id: 'fish-buffalo-braised',
    animal: 'Buffalo',
    category: 'Fish',
    emoji: '🐟',
    title: 'Braised Buffalo Fish',
    intro: 'Good for: bigmouth buffalo, smallmouth buffalo, black buffalo. Buffalo have numerous bones, so slow cooking works particularly well.',
    ingredients: ['Buffalo fillets or steaks', '1 onion', '2 cups tomatoes', '1 cup broth', 'Garlic', 'Salt and pepper', 'Paprika', '1 tbsp Worcestershire sauce'],
    instructions: [
      'Clean and fillet the buffalo.',
      'Remove obvious bones.',
      'Score the flesh deeply if preparing bone-in pieces.',
      'Season and brown the fish.',
      'Add onion, garlic, tomatoes, broth, and Worcestershire sauce.',
      'Cover and simmer gently until completely cooked and tender.',
      'Serve with rice or potatoes.',
    ],
  },
  {
    id: 'fish-carp-crispy-fried',
    animal: 'Carp',
    category: 'Fish',
    emoji: '🐟',
    title: 'Crispy Fried Carp',
    intro: 'Carp can be excellent when prepared correctly.',
    ingredients: ['Carp fillets', 'Cornmeal', 'Flour', 'Salt', 'Pepper', 'Garlic powder', 'Lemon', 'Oil'],
    instructions: [
      'Fillet the carp.',
      'Remove the skin.',
      'Carefully remove the Y-bones.',
      'Cut the fillets into smaller pieces.',
      'Soak in milk or buttermilk if desired.',
      'Coat in seasoned cornmeal.',
      'Fry until crisp and completely cooked.',
      'Serve with lemon.',
    ],
    tip: 'Alternative: baked carp — score the flesh closely across the fillet before baking. The small bones become much less troublesome after cooking.',
  },
  {
    id: 'fish-sucker-smoked-or-fried',
    animal: 'Sucker',
    category: 'Fish',
    emoji: '🐟',
    title: 'Smoked or Fried Sucker',
    intro: 'Good for: white sucker, redhorse suckers, hogsuckers and other legally harvestable sucker species.',
    ingredients: ['Sucker fillets', 'Salt', 'Brown sugar', 'Black pepper', 'Garlic', 'Wood for smoking'],
    instructions: [
      'Fillet carefully.',
      'Remove as many bones as practical.',
      'Make a dry cure using approximately equal parts salt and brown sugar, with pepper and garlic.',
      'Refrigerate the fish in the cure for several hours.',
      'Rinse and dry.',
      'Smoke using a controlled food-safe smoking process until completely cooked.',
      'Refrigerate promptly.',
    ],
    tip: 'Suckers are traditionally smoked because their bones make ordinary filleting challenging.',
  },
  {
    id: 'fish-freshwater-drum-blackened',
    animal: 'Freshwater Drum',
    category: 'Fish',
    emoji: '🐟',
    title: 'Blackened Drum',
    ingredients: ['Drum fillets', 'Butter', 'Cajun seasoning', 'Garlic', 'Lemon'],
    instructions: [
      'Fillet the drum.',
      'Remove skin and bones.',
      'Pat dry.',
      'Coat with melted butter.',
      'Cover with Cajun seasoning.',
      'Sear in a hot skillet.',
      'Cook until the flesh flakes easily.',
      'Finish with lemon juice.',
    ],
    tip: 'Drum are considerably better eating than their reputation suggests when taken from clean water.',
  },
  {
    id: 'fish-sunfish-whole-fried-bluegill',
    animal: 'Sunfish',
    category: 'Fish',
    emoji: '🐟',
    title: 'Whole Fried Bluegill',
    intro: 'Good for: bluegill, redear sunfish, pumpkinseed, green sunfish and similar species where legal.',
    ingredients: ['Small cleaned sunfish', 'Flour', 'Cornmeal', 'Salt and pepper', 'Paprika', 'Oil'],
    instructions: [
      'Scale the fish.',
      'Remove the head and entrails if desired, or fry them whole after cleaning.',
      'Make several shallow cuts through the sides.',
      'Season.',
      'Coat with seasoned flour/cornmeal.',
      'Fry until crisp and completely cooked.',
      'Carefully remove the bones while eating.',
    ],
    tip: 'For larger bluegill, simply fillet them.',
  },
  {
    id: 'fish-minnows-small-fish-fry',
    animal: 'Minnows',
    category: 'Fish',
    emoji: '🐟',
    title: 'Small-Fish Fry',
    caution: "Only use a species that is legally harvestable and known to be edible. Don't use bait-shop minnows as food unless they're specifically sold/approved as food fish.",
    ingredients: ['Cleaned small fish', 'Cornmeal', 'Flour', 'Salt and pepper', 'Oil'],
    instructions: [
      'Remove heads and entrails.',
      'Wash thoroughly.',
      'Dry completely.',
      'Coat with seasoned cornmeal.',
      'Fry until very crisp and fully cooked.',
      'Drain and serve.',
    ],
  },
  {
    id: 'fish-pike-cakes',
    animal: 'Pike',
    category: 'Fish',
    emoji: '🐟',
    title: 'Northern Pike Cakes',
    intro: 'Pike are delicious but notorious for their Y-bones.',
    ingredients: ['1 lb cooked pike meat', '1 egg', '½ cup breadcrumbs', '2 tbsp mayonnaise', '1 tbsp mustard', 'Onion', 'Salt and pepper'],
    instructions: [
      'Fillet the pike carefully.',
      'Remove the Y-bones.',
      'Cook the fish until completely done.',
      'Flake the meat.',
      'Mix with egg, breadcrumbs, mayonnaise, mustard, onion, salt, and pepper.',
      'Form into cakes.',
      'Refrigerate for 20–30 minutes.',
      'Pan-fry until browned on both sides.',
    ],
  },
  {
    id: 'fish-walleye-pan-fried',
    animal: 'Walleye',
    category: 'Fish',
    emoji: '🐟',
    title: 'Pan-Fried Walleye',
    ingredients: ['Walleye fillets', 'Flour', 'Salt and pepper', 'Butter', 'Lemon', 'Garlic'],
    instructions: [
      'Fillet and skin the fish.',
      'Remove bones.',
      'Season with salt and pepper.',
      'Lightly dust with flour.',
      'Melt butter in a skillet.',
      'Cook fillets until golden and completely cooked.',
      'Add garlic and lemon.',
      'Serve immediately.',
    ],
    tip: 'Walleye is one of the classic North American freshwater table fish.',
  },
  {
    id: 'fish-perch-beer-battered',
    animal: 'Perch',
    category: 'Fish',
    emoji: '🐟',
    title: 'Beer-Battered Perch',
    ingredients: ['Yellow perch fillets', '1 cup flour', '1 tsp baking powder', 'Salt and pepper', 'Cold beer or sparkling water', 'Oil'],
    instructions: [
      'Fillet and skin the perch.',
      'Remove bones.',
      'Mix flour, baking powder, salt, and pepper.',
      'Add enough cold liquid to make a thin batter.',
      'Dip the fillets.',
      'Fry until crisp and fully cooked.',
      'Drain and serve with lemon.',
    ],
  },
  {
    id: 'fish-trout-cast-iron-butter',
    animal: 'Trout',
    category: 'Fish',
    emoji: '🐟',
    title: 'Cast-Iron Trout with Butter',
    intro: 'Good for: rainbow, brown, brook, cutthroat and other legally harvestable trout.',
    ingredients: ['Trout fillets', 'Butter', 'Garlic', 'Lemon', 'Salt and pepper', 'Parsley'],
    instructions: [
      'Clean and fillet the trout.',
      'Pat dry.',
      'Season.',
      'Heat butter in a cast-iron skillet.',
      'Place trout skin-side down.',
      'Cook until the skin is crisp.',
      'Turn briefly and finish cooking.',
      'Add garlic, lemon, and parsley.',
    ],
  },
  {
    id: 'fish-salmon-cedar-plank',
    animal: 'Salmon',
    category: 'Fish',
    emoji: '🐟',
    title: 'Cedar-Plank Salmon',
    ingredients: ['Salmon fillet', 'Olive oil', 'Brown sugar', 'Garlic', 'Black pepper', 'Lemon', 'Cedar plank suitable for food use'],
    instructions: [
      'Soak the plank according to its instructions.',
      'Rub salmon with oil.',
      'Season with brown sugar, garlic, pepper, and lemon.',
      'Place salmon on the plank.',
      'Grill until completely cooked.',
      'Allow it to rest briefly before serving.',
    ],
    tip: 'Wild salmon species include Chinook, coho, sockeye, chum, and pink salmon.',
  },
  {
    id: 'fish-steelhead-lemon-garlic',
    animal: 'Steelhead',
    category: 'Fish',
    emoji: '🐟',
    title: 'Lemon-Garlic Steelhead',
    intro: 'Steelhead are rainbow trout that migrate to the ocean.',
    ingredients: ['Steelhead fillet', 'Butter', 'Garlic', 'Lemon', 'Dill', 'Salt and pepper'],
    instructions: [
      'Remove pin bones.',
      'Season the fillet.',
      'Place on a baking sheet.',
      'Add butter, garlic, lemon, and dill.',
      'Bake at 375°F until thoroughly cooked.',
      'Rest before serving.',
    ],
  },
  {
    id: 'fish-striped-bass-grilled',
    animal: 'Striped Bass',
    category: 'Fish',
    emoji: '🐟',
    title: 'Grilled Striped Bass',
    ingredients: ['Striped bass fillets', 'Olive oil', 'Lemon', 'Garlic', 'Salt and pepper'],
    instructions: [
      'Remove skin and pin bones.',
      'Brush with oil.',
      'Season.',
      'Grill over medium-high heat.',
      'Turn carefully once.',
      'Cook until completely done.',
      'Finish with lemon.',
    ],
  },
  {
    id: 'fish-redfish-cajun',
    animal: 'Redfish',
    category: 'Fish',
    emoji: '🐟',
    title: 'Cajun Redfish',
    ingredients: ['Redfish fillets', 'Butter', 'Cajun seasoning', 'Garlic', 'Lemon'],
    instructions: [
      'Leave the skin on if desired.',
      'Score the skin lightly.',
      'Coat flesh with melted butter and Cajun seasoning.',
      'Sear skin-side down.',
      'Flip and finish cooking.',
      'Add lemon and garlic butter.',
    ],
  },
  {
    id: 'fish-flounder-stuffed-baked',
    animal: 'Flounder',
    category: 'Fish',
    emoji: '🐟',
    title: 'Stuffed Baked Flounder',
    ingredients: ['Flounder fillets', 'Crabmeat', 'Breadcrumbs', 'Egg', 'Celery', 'Onion', 'Lemon', 'Butter'],
    instructions: [
      'Mix crabmeat, breadcrumbs, egg, celery, and onion.',
      'Place stuffing on the flounder.',
      'Roll or fold the fillets.',
      'Place in a buttered baking dish.',
      'Add lemon.',
      'Bake at 375°F until the fish and stuffing are completely cooked.',
    ],
  },
  {
    id: 'fish-red-snapper-oven-roasted',
    animal: 'Red Snapper',
    category: 'Fish',
    emoji: '🐟',
    title: 'Oven-Roasted Snapper',
    ingredients: ['Snapper fillets', 'Olive oil', 'Garlic', 'Lemon', 'Tomato', 'Onion', 'Salt and pepper'],
    instructions: [
      'Season the fillets.',
      'Place them in a baking dish.',
      'Add tomato, onion, garlic, and lemon.',
      'Drizzle with olive oil.',
      'Bake at 375°F until the fish flakes easily and is completely cooked.',
      'Serve with the vegetables and pan juices.',
    ],
  },
  {
    id: 'fish-sheepshead-pan-fried',
    animal: 'Sheepshead',
    category: 'Fish',
    emoji: '🐟',
    title: 'Pan-Fried Sheepshead',
    ingredients: ['Sheepshead fillets', 'Flour', 'Cornmeal', 'Salt and pepper', 'Lemon', 'Oil'],
    instructions: [
      'Fillet carefully.',
      'Remove skin and bones.',
      'Dip in seasoned flour/cornmeal.',
      'Pan-fry until golden and cooked through.',
      'Serve with lemon.',
    ],
    tip: 'Sheepshead have impressive teeth, so use care when handling the fish.',
  },
  {
    id: 'fish-mullet-smoked',
    animal: 'Mullet',
    category: 'Fish',
    emoji: '🐟',
    title: 'Smoked Mullet',
    intro: 'Mullet is particularly associated with Gulf Coast cooking.',
    ingredients: ['Mullet fillets', 'Salt', 'Brown sugar', 'Black pepper', 'Garlic'],
    instructions: [
      'Fillet and remove the skin if desired.',
      'Cure with salt, brown sugar, pepper, and garlic.',
      'Refrigerate several hours.',
      'Rinse and dry.',
      'Smoke using a controlled food-safe smoking method until fully cooked.',
      'Refrigerate leftovers promptly.',
    ],
  },
  {
    id: 'fish-bowfin-fried-patties',
    animal: 'Bowfin',
    category: 'Fish',
    emoji: '🐟',
    title: 'Fried Bowfin Patties',
    intro: 'Bowfin meat is soft, so turning it into patties works well.',
    ingredients: ['Cooked bowfin meat', 'Egg', 'Breadcrumbs', 'Onion', 'Mustard', 'Salt and pepper', 'Oil'],
    instructions: [
      'Fillet and skin the bowfin.',
      'Cook the meat thoroughly.',
      'Flake it.',
      'Mix with egg, breadcrumbs, onion, mustard, salt, and pepper.',
      'Form into patties.',
      'Refrigerate briefly.',
      'Fry until browned and completely cooked.',
    ],
  },
  {
    id: 'fish-eel-braised-american',
    animal: 'Eel',
    category: 'Fish',
    emoji: '🐟',
    title: 'Braised American Eel',
    caution: 'American eel is subject to state-specific regulations and conservation concerns, so verify that harvest is legal where you are.',
    ingredients: ['Cleaned eel', 'Soy sauce', 'Brown sugar', 'Garlic', 'Ginger', 'Water'],
    instructions: [
      'Have the eel properly cleaned and skinned.',
      'Cut into sections.',
      'Simmer with water, garlic, ginger, soy sauce, and brown sugar.',
      'Reduce the sauce as the eel cooks.',
      'Continue until completely cooked and tender.',
      'Serve over rice.',
    ],
  },
  {
    id: 'fish-paddlefish-smoked',
    animal: 'Paddlefish',
    category: 'Fish',
    emoji: '🐟',
    title: 'Smoked Paddlefish',
    intro: 'Paddlefish regulations are highly restricted in many states, so verify legality before harvesting.',
    caution: 'Never eat paddlefish roe unless you have verified the species and applicable health guidance.',
    ingredients: ['Paddlefish fillets', 'Salt', 'Brown sugar', 'Black pepper', 'Garlic'],
    instructions: [
      'Fillet carefully.',
      'Remove skin and bones.',
      'Cure with salt, sugar, pepper, and garlic.',
      'Refrigerate during curing.',
      'Rinse and dry.',
      'Smoke using a reliable food-safe process until fully cooked.',
    ],
  },
  {
    id: 'fish-sturgeon-grilled',
    animal: 'Sturgeon',
    category: 'Fish',
    emoji: '🐟',
    title: 'Grilled Sturgeon',
    intro: 'Sturgeon are heavily regulated in many places.',
    ingredients: ['Sturgeon steaks', 'Olive oil', 'Garlic', 'Lemon', 'Salt and pepper'],
    instructions: [
      'Only use legally obtained sturgeon.',
      'Cut into steaks.',
      'Brush with oil.',
      'Season.',
      'Grill over medium heat.',
      'Turn once.',
      'Cook completely and serve with lemon-garlic butter.',
    ],
  },
  {
    id: 'fish-cheeks-butter-fried',
    animal: 'Fish Parts',
    category: 'Fish',
    emoji: '🫀',
    title: 'Butter-Fried Fish Cheeks',
    intro:
      "Unlike mammals, fish generally aren't worth treating as a \"nose-to-tail\" animal unless you're experienced with the species. Commonly usable: fillets, cheeks, collars, belly meat, roe from appropriate species, and liver from certain species. Fish cheeks are particularly good.",
    instructions: [
      'Remove the cheeks from a large fish.',
      'Rinse and pat dry.',
      'Season with salt and pepper.',
      'Dust lightly with flour.',
      'Fry in butter.',
      'Add garlic and lemon.',
      'Cook completely.',
    ],
  },
  {
    id: 'fish-roe-trout-salmon',
    animal: 'Fish Roe',
    category: 'Fish',
    emoji: '🥚',
    title: 'Trout/Sockeye Salmon Roe',
    caution:
      "Roe can be edible, but don't assume the eggs of every species are safe to eat — gar roe is toxic and must never be eaten. Don't experiment with roe from an unfamiliar species simply because another species' roe is edible.",
    instructions: [
      'Remove roe sacs carefully.',
      'Rinse gently.',
      'Separate individual eggs if desired.',
      'Cure with a measured salt solution or use a tested roe-curing recipe.',
      'Keep refrigerated.',
      'Serve chilled.',
    ],
  },
  {
    id: 'frog-bullfrog-classic-fried-legs',
    animal: 'Bullfrog',
    category: 'Frogs',
    emoji: '🐸',
    title: 'Classic Fried Frog Legs',
    intro: 'Bullfrog legs are probably the most iconic American frog dish.',
    ingredients: [
      '8–12 cleaned bullfrog legs',
      '1 cup buttermilk',
      '1½ cups flour',
      '½ cup cornmeal',
      '1 tsp salt',
      '1 tsp black pepper',
      '1 tsp paprika',
      '½ tsp garlic powder',
      'Cooking oil',
      'Lemon',
    ],
    instructions: [
      'Skin and clean the frog legs.',
      'Trim away damaged tissue.',
      'Refrigerate the legs in buttermilk for 1–4 hours.',
      'Combine flour, cornmeal, salt, pepper, paprika, and garlic powder.',
      'Remove the legs from the buttermilk and coat thoroughly.',
      'Heat oil in a heavy skillet.',
      'Fry the legs until golden brown.',
      'Continue cooking until the meat is completely cooked through.',
      'Drain and serve with lemon and tartar sauce.',
    ],
    tip: 'Flavor: mild and slightly sweet, with a texture often compared to chicken.',
  },
  {
    id: 'frog-leopard-pan-fried-legs',
    animal: 'Leopard Frog',
    category: 'Frogs',
    emoji: '🐸',
    title: 'Pan-Fried Frog Legs',
    intro: 'Leopard frogs are traditionally eaten in some parts of the United States, but local harvest regulations vary considerably.',
    ingredients: ['Frog legs', '½ cup flour', '½ cup cornmeal', 'Salt and pepper', 'Garlic powder', 'Butter', 'Lemon'],
    instructions: [
      'Properly identify the frog before harvesting.',
      'Skin and clean the legs.',
      'Pat them dry.',
      'Mix flour, cornmeal, salt, pepper, and garlic powder.',
      'Lightly coat the legs.',
      'Melt butter in a skillet.',
      'Cook the frog legs over medium heat, turning once.',
      'Continue until completely cooked.',
      'Finish with fresh lemon juice.',
    ],
    tip: 'This is one of the simplest ways to appreciate the delicate flavor of leopard frog.',
  },
  {
    id: 'frog-pickerel-garlic-butter-legs',
    animal: 'Pickerel Frog',
    category: 'Frogs',
    emoji: '🐸',
    title: 'Garlic Butter Frog Legs',
    caution:
      'Pickerel frogs can be confused with other frogs (especially northern leopard frogs) — identification should be based on the whole animal and reliable regional identification characteristics, not just color or spots.',
    ingredients: ['Pickerel frog legs', '3 tbsp butter', '2 garlic cloves', 'Salt and pepper', 'Lemon', 'Parsley'],
    instructions: [
      'Positively identify the frog.',
      'Skin and clean the legs.',
      'Pat dry and season.',
      'Melt butter in a skillet.',
      'Add minced garlic.',
      'Add frog legs.',
      'Sauté until browned and thoroughly cooked.',
      'Finish with lemon and parsley.',
    ],
  },
  {
    id: 'frog-wood-fried-legs',
    animal: 'Wood Frog',
    category: 'Frogs',
    emoji: '🐸',
    title: 'Fried Frog Legs',
    caution: 'Wood frogs are eaten in some traditional and subsistence contexts, but they are not universally legal to harvest, and regulations vary — confirm harvest is legal in your location first.',
    ingredients: ['Frog legs', 'Buttermilk', 'Flour', 'Cornmeal', 'Salt', 'Pepper', 'Paprika', 'Oil'],
    instructions: [
      'Confirm that harvest is legal in your location.',
      'Skin and clean the legs.',
      'Soak briefly in buttermilk.',
      'Coat with seasoned flour and cornmeal.',
      'Fry until golden.',
      'Cook thoroughly.',
      'Drain and serve hot.',
    ],
  },
  {
    id: 'frog-green-cajun-legs',
    animal: 'Green Frog',
    category: 'Frogs',
    emoji: '🐸',
    title: 'Cajun Frog Legs',
    ingredients: ['Green frog legs', '1 cup flour', '1 tsp Cajun seasoning', '½ tsp garlic powder', '½ tsp paprika', 'Salt and pepper', '2 eggs', 'Hot sauce', 'Oil'],
    instructions: [
      'Clean and skin the frog legs.',
      'Beat eggs with a little hot sauce.',
      'Mix flour with seasonings.',
      'Dip legs into egg mixture.',
      'Coat with seasoned flour.',
      'Fry until crisp and fully cooked.',
      'Serve with remoulade or hot sauce.',
    ],
  },
  {
    id: 'frog-tree-frog-garlic-herb-saute',
    animal: 'Tree Frog',
    category: 'Frogs',
    emoji: '🐸',
    title: 'Garlic & Herb Sauté',
    intro: 'For a confirmed, legally harvestable edible tree-frog species only.',
    caution:
      "Tree frogs deserve much more caution than the other frogs here. Don't assume every tree frog is an edible species — several have very restricted ranges, special conservation status, or other concerns. Do not eat an unidentified tree frog merely because someone says it is edible.",
    ingredients: ['Cleaned frog legs', 'Butter', 'Garlic', 'Thyme', 'Salt and pepper', 'Lemon'],
    instructions: [
      'Positively identify the species.',
      'Verify that harvesting it is legal.',
      'Skin and clean the legs.',
      'Season lightly.',
      'Melt butter in a skillet.',
      'Add garlic and thyme.',
      'Sauté frog legs until browned and completely cooked.',
      'Finish with lemon.',
    ],
  },
  {
    id: 'lizard-skink-simple-roasted',
    animal: 'Skink',
    category: 'Lizards',
    emoji: '🦎',
    title: 'Simple Roasted Skink',
    caution:
      'Skinks are a large and diverse group — a generic "skink recipe" is not recommended. Only use a properly identified, legally harvestable species.',
    ingredients: ['Properly identified, legally harvested skink', 'Oil or butter', 'Salt', 'Black pepper', 'Garlic', 'Lemon', 'Herbs'],
    instructions: [
      'Positively identify the species before harvesting.',
      'Confirm that collection is legal in your jurisdiction.',
      'Wear disposable gloves while cleaning.',
      'Remove the skin and internal organs.',
      'Rinse the meat and keep it chilled.',
      'Season with oil, salt, pepper, garlic, and herbs.',
      'Roast or pan-cook until the meat is thoroughly cooked throughout.',
      'Finish with lemon.',
    ],
  },
  {
    id: 'turtle-snapping-classic-soup',
    animal: 'Snapping Turtle',
    category: 'Turtles',
    emoji: '🐢',
    title: 'Classic Turtle Soup',
    intro: 'Common snapping turtle is one of the classic American turtle food animals, where legal to harvest.',
    ingredients: [
      '2–3 lb cleaned snapping-turtle meat',
      '1 onion',
      '2 celery stalks',
      '2 carrots',
      '3 garlic cloves',
      '6 cups beef/chicken broth',
      '1 can diced tomatoes',
      '2 tbsp flour',
      '2 tbsp butter',
      '1 tbsp Worcestershire sauce',
      '1 tsp thyme',
      'Salt and pepper',
      'Optional: hard-boiled eggs',
    ],
    instructions: [
      'Make sure the turtle is legally harvestable and identify it before collection.',
      'Handle the turtle carefully — snapping turtles can inflict serious bites.',
      'Clean and butcher the turtle, separating usable meat from the shell and removing the organs.',
      'Cut the meat into manageable pieces.',
      'Brown the meat in butter.',
      'Add onion, celery, carrots, and garlic.',
      'Add broth, tomatoes, Worcestershire sauce, and thyme.',
      'Cover and simmer gently until the meat is very tender and thoroughly cooked.',
      'Mix flour with a little cool water and add it to thicken the soup.',
      'Season with salt and pepper.',
      'Serve with chopped hard-boiled egg if desired.',
    ],
    tip: 'Good portions: neck, legs, tail, and body meat.',
  },
  {
    id: 'turtle-snapping-fried-nuggets',
    animal: 'Snapping Turtle',
    category: 'Turtles',
    emoji: '🐢',
    title: 'Fried Turtle Nuggets',
    intro: 'This is a simpler alternative to soup.',
    ingredients: ['Turtle meat', 'Buttermilk', 'Flour', 'Cornmeal', 'Salt and pepper', 'Paprika', 'Garlic powder', 'Cooking oil'],
    instructions: [
      'Clean and trim the meat.',
      'Cut into bite-sized pieces.',
      'Soak in refrigerated buttermilk for several hours.',
      'Mix cornmeal, flour, and seasonings.',
      'Coat the meat.',
      'Fry until browned.',
      'Continue cooking until the meat is thoroughly cooked.',
      'Drain and serve with hot sauce or tartar sauce.',
    ],
  },
  {
    id: 'turtle-softshell-pan-fried',
    animal: 'Softshell Turtle',
    category: 'Turtles',
    emoji: '🐢',
    title: 'Pan-Fried Softshell',
    caution:
      'Softshell turtles can produce excellent meat, but species identification and regulations are important, especially because some populations are protected or heavily regulated.',
    ingredients: ['Cleaned softshell turtle', 'Flour', 'Cornmeal', 'Salt and pepper', 'Paprika', 'Butter or cooking oil', 'Lemon'],
    instructions: [
      'Confirm the exact species and that harvest is legal.',
      'Handle the turtle carefully.',
      'Clean and butcher it using an appropriate turtle-processing method.',
      'Cut usable meat into pieces.',
      'Season with salt, pepper, and paprika.',
      'Lightly coat with flour and cornmeal.',
      'Pan-fry until browned and thoroughly cooked.',
      'Finish with lemon.',
    ],
    tip: 'Softshell meat is relatively mild and tender compared with some harder-shelled turtles.',
  },
  {
    id: 'turtle-softshell-cajun-stew',
    animal: 'Softshell Turtle',
    category: 'Turtles',
    emoji: '🐢',
    title: 'Cajun Turtle Stew',
    ingredients: ['2 lb softshell turtle meat', '1 onion', '1 bell pepper', '2 celery stalks', '3 garlic cloves', '3 cups broth', '1 can tomatoes', '1 tbsp Cajun seasoning', '2 tbsp flour', '2 tbsp oil'],
    instructions: [
      'Clean and cut the meat.',
      'Brown it in oil.',
      'Remove the meat.',
      'Cook onion, pepper, celery, and garlic.',
      'Stir in flour.',
      'Add broth and tomatoes.',
      'Return turtle meat to the pot.',
      'Add Cajun seasoning.',
      'Simmer slowly until tender and thoroughly cooked.',
      'Serve over rice.',
    ],
  },
  {
    id: 'snake-nonvenomous-fried',
    animal: 'Nonvenomous Snake',
    category: 'Snakes',
    emoji: '🐍',
    title: 'Fried Snake',
    intro:
      'Some larger nonvenomous snakes have traditionally been eaten in parts of the United States — examples can include certain water snakes, rat snakes, racers, and kingsnakes — but whether a particular species may legally be collected varies by state.',
    ingredients: [
      '1 legally harvested, positively identified nonvenomous snake',
      '1 cup buttermilk',
      '1½ cups flour',
      '½ cup cornmeal',
      '1 tsp salt',
      '1 tsp black pepper',
      '1 tsp paprika',
      '½ tsp garlic powder',
      'Cooking oil',
      'Lemon',
    ],
    instructions: [
      'Identify the species before handling or harvesting it.',
      'Confirm that the species is legally harvestable where you are.',
      'Wear gloves while cleaning.',
      'Remove the head and carefully skin and dress the snake.',
      'Remove the internal organs.',
      'Wash the meat and keep it refrigerated.',
      'Cut the meat into manageable sections.',
      'Soak in refrigerated buttermilk for 1–4 hours.',
      'Mix flour, cornmeal, and seasonings.',
      'Coat the meat thoroughly.',
      'Fry until golden brown.',
      'Continue cooking until the meat is completely cooked throughout.',
      'Serve with lemon or hot sauce.',
    ],
    tip: 'Snake meat is lean and can be somewhat bony, so frying or stewing works particularly well.',
  },
  {
    id: 'snake-nonvenomous-stew',
    animal: 'Nonvenomous Snake',
    category: 'Snakes',
    emoji: '🐍',
    title: 'Snake Stew',
    intro: 'Good for larger nonvenomous snakes.',
    ingredients: ['1–2 lb cleaned snake meat', '1 onion', '2 carrots', '2 celery stalks', '3 garlic cloves', '4 cups broth', '1 cup diced tomatoes', '1 tsp thyme', 'Salt and pepper', 'Potatoes'],
    instructions: [
      'Properly clean and skin the snake.',
      'Cut the meat into sections.',
      'Brown the pieces in a heavy pot.',
      'Add onion, celery, carrots, and garlic.',
      'Add broth and tomatoes.',
      'Season with thyme, salt, and pepper.',
      'Cover and simmer slowly until tender and thoroughly cooked.',
      'Add potatoes during the final portion of cooking.',
      'Remove bones carefully before serving if desired.',
    ],
  },
  {
    id: 'snake-rattlesnake-fried',
    animal: 'Rattlesnake',
    category: 'Snakes',
    emoji: '🐍',
    title: 'Fried Rattlesnake',
    intro: 'Rattlesnake is the most recognizable American snake traditionally prepared as food.',
    caution:
      "Rattlesnakes are venomous and potentially dangerous to handle — eating rattlesnake does not make handling a live rattlesnake safe. Do not attempt to catch or handle a live rattlesnake for food; if you encounter one, leave it alone. Only use a snake that was legally harvested by a person using appropriate, lawful methods, and use appropriate protective equipment when processing. Removing the head does not immediately make a rattlesnake harmless — reflexive biting can occur after death, and the venom apparatus can remain dangerous. Only experienced, legally authorized handlers should process venomous snakes.",
    ingredients: [
      'Legally harvested rattlesnake meat',
      '1 cup buttermilk',
      '1½ cups flour',
      '½ cup cornmeal',
      'Salt',
      'Black pepper',
      'Paprika',
      'Garlic powder',
      'Cooking oil',
      'Lemon',
    ],
    instructions: [
      'Do not attempt to catch or handle a live rattlesnake for food — if you encounter one, leave it alone.',
      'Only use a snake that was legally harvested by a person using appropriate, lawful methods.',
      'Use appropriate protective equipment when processing.',
      'Remove the head and carefully skin and dress the carcass.',
      'Remove the internal organs.',
      'Keep the meat chilled.',
      'Cut the meat into sections.',
      'Soak in refrigerated buttermilk.',
      'Coat with seasoned flour and cornmeal.',
      'Fry until browned.',
      'Cook completely throughout.',
      'Serve with lemon or a spicy dipping sauce.',
    ],
  },
  {
    id: 'snake-rattlesnake-stew',
    animal: 'Rattlesnake',
    category: 'Snakes',
    emoji: '🐍',
    title: 'Rattlesnake Stew',
    caution: 'Use only legally obtained and professionally/appropriately processed meat.',
    ingredients: ['Cleaned rattlesnake meat', '1 onion', '2 carrots', '2 celery stalks', '3 garlic cloves', '4 cups broth', '1 can tomatoes', 'Potatoes', 'Salt and pepper', 'Thyme'],
    instructions: [
      'Use only legally obtained and professionally/appropriately processed meat.',
      'Cut the cleaned meat into sections.',
      'Brown it.',
      'Add vegetables and garlic.',
      'Add broth and tomatoes.',
      'Season.',
      'Cover and simmer until tender and thoroughly cooked.',
      'Add potatoes toward the end.',
      'Remove bones before serving if desired.',
    ],
  },
  {
    id: 'crawfish-red-swamp-cajun-boil',
    animal: 'Crawfish',
    category: 'Crawfish',
    emoji: '🦞',
    title: 'Cajun Crawfish Boil',
    intro:
      'Red Swamp Crayfish (Procambarus clarkii), also called Louisiana crawfish or red swamp crawfish, is probably the most famous American crayfish as a food animal.',
    ingredients: [
      '3–5 lb live crawfish',
      '2 lb small potatoes',
      '4–6 ears corn',
      '1 onion',
      '1 head garlic',
      'Lemon',
      'Cajun seasoning',
      'Water',
    ],
    instructions: [
      'Keep live crawfish chilled until preparation.',
      'Rinse thoroughly and remove mud and debris.',
      'Bring seasoned water to a strong boil.',
      'Add potatoes, onion, garlic, and corn.',
      'Cook until the vegetables are nearly tender.',
      'Add crawfish.',
      'Return the water to a boil and cook until the crawfish are completely cooked.',
      'Drain.',
      'Serve hot with additional Cajun seasoning and lemon.',
    ],
    tip: 'Best portions: tail meat, claws, and occasionally other cleaned edible portions.',
  },
  {
    id: 'crawfish-white-river-garlic-butter',
    animal: 'White River Crawfish',
    category: 'Crawfish',
    emoji: '🦞',
    title: 'Garlic-Butter Crawfish',
    intro:
      'White River Crawfish (Procambarus zonangulus) is particularly important in the southern United States and is commonly associated with commercial crawfish production.',
    ingredients: ['2 lb cooked crawfish', '½ cup butter', '5 garlic cloves', 'Lemon', 'Parsley', 'Cajun seasoning'],
    instructions: [
      'Cook the crawfish thoroughly.',
      'Remove the tails from the shells.',
      'Melt butter in a skillet.',
      'Add garlic and cook briefly.',
      'Add crawfish meat and Cajun seasoning.',
      'Sauté for several minutes.',
      'Finish with lemon juice and parsley.',
    ],
    tip: 'Serve over rice or crusty bread.',
  },
  {
    id: 'crawfish-virile-fried-tails',
    animal: 'Virile Crayfish',
    category: 'Crawfish',
    emoji: '🦞',
    title: 'Fried Crayfish Tails',
    intro: 'Virile Crayfish (Faxonius virilis, formerly Orconectes virilis) is a widespread northern and central U.S. crayfish.',
    ingredients: ['Cleaned crayfish tails', 'Flour', 'Cornmeal', 'Salt', 'Pepper', 'Paprika', 'Garlic powder', 'Buttermilk', 'Oil'],
    instructions: [
      'Remove the tail meat.',
      'Rinse and pat dry.',
      'Dip in buttermilk.',
      'Coat with seasoned flour and cornmeal.',
      'Fry until golden brown and completely cooked.',
      'Drain and serve with lemon or remoulade.',
    ],
  },
  {
    id: 'crawfish-signal-pnw-chowder',
    animal: 'Signal Crayfish',
    category: 'Crawfish',
    emoji: '🦞',
    title: 'Pacific Northwest Crayfish Chowder',
    intro: 'Signal Crayfish (Pacifastacus leniusculus) is native to parts of the Pacific Northwest and also introduced in other areas.',
    ingredients: [
      '2 lb crayfish',
      '3 potatoes',
      '1 onion',
      '2 celery stalks',
      '2 cups milk',
      '2 cups broth',
      '2 tbsp butter',
      'Salt and pepper',
      'Parsley',
    ],
    instructions: [
      'Cook the crayfish thoroughly.',
      'Remove the meat from the shells.',
      'Sauté onion and celery in butter.',
      'Add potatoes and broth.',
      'Simmer until potatoes are tender.',
      'Add milk.',
      'Add crayfish meat near the end.',
      'Heat thoroughly without aggressively boiling the milk.',
      'Season and garnish with parsley.',
    ],
  },
  {
    id: 'crawfish-rusty-crispy-fried',
    animal: 'Rusty Crayfish',
    category: 'Crawfish',
    emoji: '🦞',
    title: 'Crispy Rusty Crayfish',
    intro: 'Rusty Crayfish (Faxonius rusticus) is an invasive species in portions of the United States and Great Lakes region.',
    caution:
      'Verify that collection is legal. In areas where rusty crayfish are invasive, harvesting them for consumption can sometimes be encouraged — but never transport or release live crayfish unless specifically permitted.',
    ingredients: ['Crayfish tails', 'Cornmeal', 'Flour', 'Salt and pepper', 'Garlic', 'Paprika', 'Oil'],
    instructions: [
      'Verify that collection is legal.',
      'Clean the crayfish thoroughly.',
      'Cook the crayfish and remove the tail meat.',
      'Coat with seasoned cornmeal and flour.',
      'Fry until crisp and fully cooked.',
      'Serve with lemon.',
    ],
  },
  {
    id: 'crawfish-ringed-etouffee',
    animal: 'Ringed Crayfish',
    category: 'Crawfish',
    emoji: '🦞',
    title: 'Crayfish Étouffée',
    intro: 'Ringed Crayfish (Faxonius neglectus) is found primarily in portions of the central United States.',
    ingredients: [
      '2 lb cooked crayfish meat',
      '1 onion',
      '1 bell pepper',
      '2 celery stalks',
      '3 garlic cloves',
      '3 tbsp butter',
      '2 tbsp flour',
      '2 cups broth',
      'Cajun seasoning',
      'Cooked rice',
    ],
    instructions: [
      'Melt butter in a pot.',
      'Stir in flour to create a roux.',
      'Add onion, bell pepper, celery, and garlic.',
      'Cook until softened.',
      'Slowly add broth.',
      'Add cooked crayfish meat.',
      'Season with Cajun seasoning.',
      'Simmer gently for about 15 minutes.',
      'Serve over rice.',
    ],
  },
  {
    id: 'crawfish-big-river-bisque',
    animal: 'Big River-Type Crayfish',
    category: 'Crawfish',
    emoji: '🦞',
    title: 'Crayfish Bisque',
    intro: 'Several closely related crayfish (virile/big river-type crayfish) are encountered across the Midwest and Northeast.',
    ingredients: [
      '2 lb crayfish',
      '1 onion',
      '1 celery stalk',
      '1 carrot',
      '3 garlic cloves',
      '4 cups seafood broth',
      '1 cup cream',
      'Butter',
      'Paprika',
      'Salt and pepper',
    ],
    instructions: [
      'Cook the crayfish thoroughly.',
      'Remove the meat.',
      'Sauté vegetables in butter.',
      'Add broth.',
      'Simmer until vegetables are soft.',
      'Add crayfish meat.',
      'Blend part of the soup if desired.',
      'Add cream.',
      'Season and heat through.',
    ],
  },
  {
    id: 'crawfish-small-native-fry',
    animal: 'Small Native Crayfish',
    category: 'Crawfish',
    emoji: '🦞',
    title: 'Small-Crayfish Fry',
    intro:
      "America has numerous smaller crayfish species (shiners and other small natives) that don't have the commercial importance of Louisiana crawfish, so this uses a general small-crayfish fry rather than a recipe for every individual species.",
    ingredients: ['Legally collected small crayfish', 'Cornmeal', 'Flour', 'Salt', 'Pepper', 'Garlic powder', 'Paprika', 'Oil'],
    instructions: [
      'Positively identify the species.',
      'Verify that collection is legal.',
      'Keep the crayfish alive and chilled until preparation.',
      'Rinse thoroughly.',
      'Cook thoroughly before shelling.',
      'Remove the edible meat.',
      'Coat with seasoned cornmeal.',
      'Fry until crisp and completely cooked.',
    ],
    tip: "Reality check: many small native species yield so little meat that they aren't worth harvesting individually.",
  },
  {
    id: 'crawfish-red-swamp-pasta',
    animal: 'Crawfish',
    category: 'Crawfish',
    emoji: '🦞',
    title: 'Crawfish Pasta',
    intro: 'Because red swamp crawfish are so widely available, they are worth a second preparation.',
    ingredients: [
      '1½ lb cooked crawfish tails',
      '12 oz pasta',
      '3 tbsp butter',
      '3 garlic cloves',
      '1 cup cream',
      '½ cup Parmesan',
      'Cajun seasoning',
      'Parsley',
    ],
    instructions: [
      'Cook pasta and reserve some pasta water.',
      'Melt butter.',
      'Add garlic.',
      'Add cream and Parmesan.',
      'Season with Cajun seasoning.',
      'Add crawfish tails.',
      'Toss with pasta.',
      'Add pasta water if needed to loosen the sauce.',
      'Garnish with parsley.',
    ],
  },
  {
    id: 'mussel-asian-clam-garlic-butter',
    animal: 'Asian Clam',
    category: 'Mussels',
    emoji: '🦪',
    title: 'Garlic-Butter Asian Clams',
    intro: 'Asian clams (Corbicula fluminea) are an introduced species that is widespread across much of the United States.',
    caution:
      'Asian clams are filter feeders and can concentrate contaminants from the water. Never collect freshwater shellfish from questionable or contaminated water.',
    ingredients: ['2 lb live Asian clams', '4 tbsp butter', '4 garlic cloves', '½ cup white wine or broth', 'Lemon', 'Parsley', 'Black pepper'],
    instructions: [
      'Only collect them where harvesting is legal.',
      'Discard cracked, dead, or foul-smelling clams.',
      'Rinse thoroughly under clean water.',
      'Melt butter in a large pot.',
      'Add garlic and cook briefly.',
      'Add clams and wine/broth.',
      'Cover and steam until the shells open.',
      'Discard any shells that remain closed after cooking.',
      'Finish with lemon, parsley, and pepper.',
      'Remove the meat from the shells and serve immediately.',
    ],
  },
  {
    id: 'mussel-freshwater-snails-garlic-herb',
    animal: 'Freshwater Snails',
    category: 'Mussels',
    emoji: '🐚',
    title: 'Garlic & Herb Snails',
    intro:
      'Several freshwater snails are eaten around the world, but American freshwater snails should not be treated as a blanket food category — this is for a legally obtained, confirmed edible species only.',
    caution:
      'Never eat freshwater snails raw. Freshwater snails can participate in parasite life cycles, including parasites that can infect humans.',
    ingredients: ['Cleaned freshwater snails', 'Butter', 'Garlic', 'Parsley', 'Lemon', 'Salt and pepper'],
    instructions: [
      'Confirm the species is legal and suitable for consumption.',
      'Keep live snails chilled.',
      'Rinse thoroughly.',
      'Remove the meat according to the species.',
      'Cook thoroughly in boiling water or by steaming.',
      'Finish in a skillet with butter and garlic.',
      'Add parsley and lemon.',
      'Serve hot.',
    ],
  },
  {
    id: 'mussel-asiatic-clam-spicy-pasta',
    animal: 'Asian Clam',
    category: 'Mussels',
    emoji: '🦪',
    title: 'Spicy Clam Pasta',
    intro: 'Since Corbicula fluminea (Asiatic clam) is so widespread, it deserves another preparation.',
    ingredients: ['2 lb live Asian clams', '12 oz spaghetti', '4 garlic cloves', '3 tbsp olive oil', '½ tsp red pepper flakes', '½ cup broth', 'Parsley', 'Lemon'],
    instructions: [
      'Rinse the clams thoroughly.',
      'Cook pasta separately.',
      'Sauté garlic and pepper flakes in oil.',
      'Add clams and broth.',
      'Cover and steam until shells open.',
      'Discard unopened clams.',
      'Remove most of the clam meat from the shells.',
      'Toss with pasta.',
      'Finish with parsley and lemon.',
    ],
  },
  {
    id: 'mussel-large-freshwater-snails-butter-fried',
    animal: 'Large Freshwater Snails',
    category: 'Mussels',
    emoji: '🐚',
    title: 'Butter-Fried Freshwater Snails',
    intro:
      'Some larger freshwater snails may be edible, but the same rule applies as any other wild mollusk: positive identification → legal harvest → clean water → thorough cooking. For an approved species:',
    ingredients: ['Cleaned snail meat', 'Butter', 'Garlic', 'Salt', 'Pepper', 'Lemon', 'Parsley'],
    instructions: [
      'Clean the snails thoroughly.',
      'Cook them completely in boiling water.',
      'Remove the meat.',
      'Melt butter in a skillet.',
      'Add garlic.',
      'Add snail meat.',
      'Sauté until hot and thoroughly cooked.',
      'Season with salt and pepper.',
      'Finish with lemon and parsley.',
    ],
  },
  {
    id: 'insect-field-cricket-pan-fried',
    animal: 'Field Crickets',
    category: 'Insects',
    emoji: '🦗',
    title: 'Pan-Fried Crispy Crickets',
    intro: 'Good candidates: Gryllus species.',
    ingredients: [
      '1–2 cups live field crickets',
      '1 tbsp oil or butter',
      'Salt',
      'Black pepper',
      'Garlic powder',
      'Paprika',
      'Optional: chili powder',
    ],
    instructions: [
      'Collect only where pesticide use is known to be absent and collection is legal.',
      'Keep the crickets contained and cool.',
      'Rinse them thoroughly.',
      'Briefly blanch or boil them before final cooking.',
      'Drain and pat dry.',
      'Remove wings and legs if desired.',
      'Toss with oil and seasonings.',
      'Pan-fry until crispy and thoroughly cooked.',
      'Serve as a snack or over rice.',
    ],
    tip: 'Flavor: nutty, roasted, somewhat similar to toasted seeds.',
  },
  {
    id: 'insect-house-cricket-roasted-chili',
    animal: 'House Crickets',
    category: 'Insects',
    emoji: '🦗',
    title: 'Roasted Chili Crickets',
    intro:
      'House crickets (Acheta domesticus) are one of the most commonly farmed insects for human consumption.',
    ingredients: ['2 cups food-grade house crickets', '1 tbsp oil', 'Chili powder', 'Garlic powder', 'Salt', 'Lime'],
    instructions: [
      'Use food-grade/farmed crickets, rather than crickets collected around homes.',
      'Rinse and dry.',
      'Blanch briefly.',
      'Pat dry.',
      'Toss with oil and seasonings.',
      'Roast at approximately 350°F until crisp.',
      'Finish with lime juice.',
    ],
    tip: 'This is actually one of the easiest insect recipes to introduce people to.',
  },
  {
    id: 'insect-tree-cricket-garlic-butter',
    animal: 'Tree Crickets',
    category: 'Insects',
    emoji: '🦗',
    title: 'Garlic Butter Crickets',
    intro: 'Tree crickets are generally much smaller and more delicate than field crickets.',
    caution:
      "Tree crickets are tiny, so they aren't particularly efficient to collect for food. Farmed crickets are generally a better culinary choice.",
    ingredients: ['Cleaned tree crickets', 'Butter', 'Garlic', 'Salt', 'Lemon', 'Parsley'],
    instructions: [
      'Positively identify the species.',
      'Collect only from an uncontaminated location where permitted.',
      'Rinse thoroughly.',
      'Blanch briefly.',
      'Melt butter in a skillet.',
      'Add garlic.',
      'Add crickets.',
      'Cook until crisp and completely cooked.',
      'Add lemon and parsley.',
    ],
  },
  {
    id: 'insect-grasshopper-classic-fried',
    animal: 'Grasshoppers',
    category: 'Insects',
    emoji: '🦗',
    title: 'Classic Fried Grasshoppers',
    intro: 'This is probably the quintessential American wild-insect recipe.',
    ingredients: [
      '2 cups large grasshoppers',
      '1 cup flour',
      '½ cup cornmeal',
      'Salt',
      'Pepper',
      'Paprika',
      'Garlic powder',
      'Oil',
    ],
    instructions: [
      'Collect only from areas free of pesticides and other chemical contamination.',
      'Remove wings and legs.',
      'Rinse thoroughly.',
      'Blanch briefly.',
      'Drain and dry.',
      'Coat with seasoned flour and cornmeal.',
      'Fry until crisp.',
      "Make sure they're thoroughly cooked before eating.",
      'Season while hot.',
    ],
    tip: 'Larger grasshoppers are generally more worthwhile than tiny species.',
  },
  {
    id: 'insect-differential-grasshopper-spicy-roasted',
    animal: 'Differential Grasshopper',
    category: 'Insects',
    emoji: '🦗',
    title: 'Spicy Roasted Grasshoppers',
    intro: 'Differential Grasshopper (Melanoplus differentialis) is a common large grasshopper across much of North America.',
    ingredients: ['Large grasshoppers', 'Oil', 'Chili powder', 'Garlic powder', 'Salt', 'Lime'],
    instructions: [
      'Collect from a pesticide-free location.',
      'Remove wings and legs.',
      'Rinse.',
      'Blanch briefly.',
      'Dry thoroughly.',
      'Toss with oil and spices.',
      'Roast around 350°F until crisp.',
      'Finish with lime.',
    ],
  },
  {
    id: 'insect-two-striped-grasshopper-garlic-pepper',
    animal: 'Two-Striped Grasshopper',
    category: 'Insects',
    emoji: '🦗',
    title: 'Garlic-Pepper Grasshoppers',
    intro: 'Two-Striped Grasshopper: Melanoplus bivittatus.',
    ingredients: ['Grasshoppers', 'Butter or oil', 'Garlic', 'Black pepper', 'Salt', 'Lemon'],
    instructions: [
      'Positively identify the species.',
      'Collect only where pesticides have not been used.',
      'Remove wings and legs.',
      'Rinse.',
      'Blanch briefly.',
      'Sauté in butter with garlic and pepper.',
      'Continue cooking until crispy and completely cooked.',
      'Add lemon before serving.',
    ],
  },
  {
    id: 'insect-katydid-crispy-fried',
    animal: 'Katydids',
    category: 'Insects',
    emoji: '🦗',
    title: 'Crispy Fried Katydids',
    intro: 'Katydids belong to the family Tettigoniidae and include numerous American species.',
    caution: 'There are many different katydid species, so not every American katydid should be treated as automatically edible.',
    ingredients: ['Large katydids', 'Flour', 'Cornmeal', 'Salt', 'Pepper', 'Paprika', 'Oil'],
    instructions: [
      'Positively identify the species.',
      'Collect only from uncontaminated locations.',
      'Remove wings and legs.',
      'Rinse.',
      'Blanch briefly.',
      'Coat with seasoned flour/cornmeal.',
      'Fry until crisp and thoroughly cooked.',
      'Drain and season.',
    ],
  },
  {
    id: 'insect-mormon-cricket-roasted',
    animal: 'Mormon Cricket',
    category: 'Insects',
    emoji: '🦗',
    title: 'Roasted Mormon Crickets',
    intro:
      'Mormon Cricket (Anabrus simplex) is, despite the name, actually a large flightless katydid, not a true cricket. It has a long history of being eaten by Indigenous peoples of the Great Basin.',
    ingredients: ['Mormon crickets', 'Oil', 'Salt', 'Garlic', 'Chili powder'],
    instructions: [
      'Verify the species.',
      'Collect only from an uncontaminated area.',
      'Remove wings/legs as appropriate.',
      'Rinse thoroughly.',
      'Blanch.',
      'Toss with oil and seasonings.',
      'Roast until crispy and thoroughly cooked.',
    ],
    tip: "They're substantial enough to make a much more practical wild-insect meal than tiny tree crickets.",
  },
  {
    id: 'insect-locust-roasted-grasshoppers',
    animal: 'Locusts',
    category: 'Insects',
    emoji: '🦗',
    title: 'Roasted Locust-Style Grasshoppers',
    intro:
      'In America, "locust" can mean two different things: people sometimes call large grasshoppers locusts, especially during population outbreaks, but periodical cicadas are also sometimes mistakenly called locusts — cicadas are not locusts. Here, "locust" means a grasshopper that exhibits a locust phase or is commonly called a locust.',
    ingredients: ['Large legally collected grasshoppers/locusts', 'Oil', 'Salt', 'Smoked paprika', 'Garlic', 'Lime'],
    instructions: [
      "Confirm the insect's identity.",
      "Make certain the collection area hasn't been treated with pesticides.",
      'Remove wings and legs.',
      'Rinse.',
      'Blanch briefly.',
      'Dry.',
      'Toss with oil and seasonings.',
      'Roast at approximately 350°F until crisp.',
      'Finish with lime.',
    ],
  },
]

export const RECIPE_SAFETY_RULES: string[] = [
  'Know the species and local regulations before harvesting or eating it.',
  "Don't eat an animal that appeared sick, unusually behaved, or had suspicious lesions or organs.",
  'Keep carcasses cold and prevent cross-contamination with other food.',
  'Use separate cutting boards/knives for raw game when possible.',
  "Don't taste-test ground wild game before it's fully cooked.",
  "Don't assume freezing makes all parasites or pathogens harmless.",
  'For animals with particular disease concerns — especially raccoon, opossum, armadillo, muskrat, and nutria — check current state wildlife/health guidance before consuming.',
  'Pregnant people, young children, older adults, and immunocompromised people should be especially cautious with wild game.',
]

export interface ProtectedBirdsSpecialCase {
  title: string
  text: string
}

export interface ProtectedBirdsGuide {
  neverHarvest: string[]
  specialCases: ProtectedBirdsSpecialCase[]
  safestRule: string
}

/**
 * US-focused legal/identification guide, deliberately kept separate from
 * the recipe cards — this is about which birds must never be treated as
 * food in the first place, not how to cook one. Shown prominently on the
 * Recipes page, above the recipe index, since several new bird recipes
 * (duck, goose, sandhill crane, and the "other small game birds" entry)
 * only make sense read alongside this warning.
 */
export const PROTECTED_BIRDS_GUIDE: ProtectedBirdsGuide = {
  neverHarvest: [
    'Bald and golden eagles — federally protected under the Bald and Golden Eagle Protection Act.',
    'Songbirds — most native songbirds are protected (robins, cardinals, blue jays, sparrows, finches, wrens, chickadees, mockingbirds, and many other small perching birds).',
    'Hawks, falcons, and other raptors — protected; do not hunt or eat them.',
    'Owls — protected.',
    'Vultures — protected.',
    'Pelicans — protected.',
    'Most native shorebirds — generally protected.',
    'Many herons, egrets, gulls, terns, and similar waterbirds — do not assume they are legal game.',
    'Whooping cranes — strictly protected; do not hunt or possess them.',
  ],
  specialCases: [
    {
      title: 'Sandhill crane',
      text: 'Legal to hunt only in designated areas during designated seasons under applicable regulations — the rules are highly specific. You must have the appropriate license, season, location, and any required permits.',
    },
    {
      title: 'Ducks and geese',
      text: 'Many species are legally hunted under regulated migratory-bird seasons, but identification matters — you cannot simply shoot any duck or goose you encounter. Federal migratory-bird regulations can involve species restrictions, season dates, daily bag limits, possession limits, shooting hours, approved hunting methods, federal/state licensing, and special permits.',
    },
  ],
  safestRule: "If you cannot positively identify the bird, don't harvest it.",
}

export interface FishSafetyGuide {
  /** The all-caps core rule, shown as the headline of the "Before You Eat It" box. */
  beforeYouEatIt: string
  /** Why a healthy-looking fish can still be unsafe (water contamination, not the animal itself). */
  contaminationNote: string
}

/**
 * Fish-specific safety framing, shown once above the "F" letter section
 * (every fish recipe files under F regardless of species — see the
 * file-level note on Recipe). Distinct from the animal-handling cautions
 * on individual recipes: this is about the water a fish came from, not the
 * fish itself.
 */
export const FISH_SAFETY_GUIDE: FishSafetyGuide = {
  beforeYouEatIt: 'IDENTIFY IT. CHECK THE REGULATIONS. CHECK THE WATER. THEN COOK IT.',
  contaminationNote:
    'A fish can be perfectly healthy-looking but still be unsafe to eat because of mercury, PCBs, PFAS, algal toxins, sewage contamination, or other pollutants in the water where it was caught. Local advisories can also recommend eating only certain portions, limiting how frequently a species is eaten, or avoiding it altogether.',
}

export interface FrogSafetyGuide {
  /** "Never eat a frog if:" identification checklist. */
  doNotEat: string[]
  colorMythWarning: string
  confusionNote: string
  toadsWarning: string
  eggsWarning: string
  smallFrogConditions: string[]
  smallFrogOtherwise: string
  additionalSpeciesNote: string
  otherPortionsNote: string
  basicFormula: string
  classicCombinations: { label: string; text: string }[]
  finalSafetyNote: string
}

/**
 * Frog-specific safety/identification guide, shown once within the "F"
 * section right before the frog recipes (frogs file under F alongside
 * fish, per an explicit product rule — same reasoning as fish-under-F).
 * Deliberately covers what NOT to eat (toads, unidentified/small frogs,
 * frog eggs) as directly as the recipes themselves.
 */
export const FROG_SAFETY_GUIDE: FrogSafetyGuide = {
  doNotEat: [
    "You can't positively identify the species.",
    "It is unusually colored and you don't know why.",
    'It has obvious lesions or abnormalities.',
    "You don't know whether the species is protected.",
    "You don't know whether collection is legal in that state.",
    'It was found dead rather than freshly and legally harvested.',
    'It has been exposed to questionable water or chemicals.',
  ],
  colorMythWarning:
    'Don\'t use "brightly colored = poisonous, dull colored = safe" as an identification rule — that isn\'t reliable for North American frogs.',
  confusionNote:
    'Pickerel frogs and northern leopard frogs can be confused by inexperienced collectors. Identification should use multiple characteristics and a regional field guide rather than relying on a single spot pattern.',
  toadsWarning:
    'TOADS — NOT RECOMMENDED AS FOOD. Toads have specialized parotoid glands and other skin glands that can produce defensive toxins, and some species produce particularly dangerous compounds. Species can be difficult to distinguish, toxicity varies between species, skin secretions can contaminate meat, handling secretions can be hazardous, and some toads are protected. Do not harvest or consume an unidentified frog/toad.',
  eggsWarning:
    "Frog eggs are not recommended as food. They're ecologically important, collection can be prohibited depending on the species and jurisdiction, and they aren't a particularly practical food source.",
  smallFrogConditions: [
    'The species is positively identified.',
    'Your state/local regulations specifically allow harvest.',
    'The frog is large enough to provide a worthwhile amount of meat.',
  ],
  smallFrogOtherwise:
    'Otherwise, leave it alone. This covers cricket frogs, chorus frogs, and other small native frogs — even where collection might technically be permitted, the amount of meat is negligible compared with larger frogs, so they are not recommended for food.',
  additionalSpeciesNote:
    "Depending on location and regulations, other species that have been eaten include certain introduced or locally established frog populations beyond those listed here — but \"edible\" does not automatically mean \"legal to collect.\" State wildlife regulations can differ dramatically.",
  otherPortionsNote:
    "Frog legs are the primary portion worth harvesting. The body contains relatively little meat compared with the legs, so frog organs aren't included here.",
  basicFormula: 'Clean → skin → chill → soak/marinade → bread → fry → cook completely → serve hot.',
  classicCombinations: [
    { label: 'Fried', text: 'flour + cornmeal' },
    { label: 'Cajun', text: 'seasoned flour + hot oil' },
    { label: 'Garlic butter', text: 'skillet + butter + garlic + lemon' },
    { label: 'Grilled', text: 'oil + herbs + lemon' },
    { label: 'Baked', text: 'butter + breadcrumbs + herbs' },
  ],
  finalSafetyNote:
    "Don't eat frog legs raw or undercooked. Wild amphibians can carry pathogens such as Salmonella, so thorough cooking and good separation between raw frogs and ready-to-eat food are important.",
}

export interface SpeciesStatusEntry {
  name: string
  /** Short status badge, e.g. "🚨 VENOMOUS — do not handle" or "⚠️ Species-specific". */
  status: string
  examples?: string[]
  note?: string
}

export interface ExtraGuideNote {
  heading: string
  text: string
}

/** Reusable shape for a "here's the legal/safety status of every related
 * species we didn't write a recipe for" guide — used by the Lizard,
 * Turtle, and Snake sections, each of which has one real recipe group and
 * a long tail of species that range from "verify locally" to "venomous,
 * never harvest." */
export interface AnimalGroupGuide {
  title: string
  intro?: string
  statusEntries: SpeciesStatusEntry[]
  extraNotes?: ExtraGuideNote[]
}

/** Shown once in the "L" section, after the one lizard recipe (Skink) —
 * lizards file under L, matching each species' own group name here since
 * there's no blanket "all lizards" recipe collision to resolve. */
export const LIZARD_GUIDE: AnimalGroupGuide = {
  title: 'What About Lizard Meat Generally?',
  intro:
    "There are places around the world where larger lizards are traditionally eaten, particularly animals such as monitor lizards and iguanas. That doesn't mean the same practice should be applied to small North American lizards.",
  statusEntries: [
    { name: 'Skinks', status: '⚠️ Species-specific; generally not worthwhile' },
    { name: 'Whiptails', status: '⚠️ Generally leave wild specimens alone' },
    { name: 'Fence lizards', status: '🚫 Not recommended' },
    { name: 'Anoles', status: '🚫 Not recommended' },
    { name: 'Horned lizards', status: '🚨 Protected/restricted — do not harvest' },
  ],
}

/** Shown once in the "T" section, after the snapping/softshell turtle
 * recipes. */
export const TURTLE_GUIDE: AnimalGroupGuide = {
  title: 'Other Turtles — Species-by-Species Status',
  statusEntries: [
    {
      name: 'Box turtles',
      status: '🚨 DO NOT HARVEST FOR FOOD',
      examples: ['Eastern box turtle', 'Three-toed box turtle', 'Ornate box turtle', 'Gulf Coast box turtle', 'Other Terrapene species'],
      note: 'Leave wild box turtles where you find them.',
    },
    {
      name: 'Mud turtles',
      status: '⚠️ Species-specific',
      examples: ['Eastern mud turtle', 'Mississippi mud turtle', 'Yellow mud turtle', 'Sonoran mud turtle'],
      note: 'Some populations are restricted — verify legality before considering harvest. If your jurisdiction explicitly allows a particular mud turtle, turtle soup or slow braising is the most sensible preparation.',
    },
    {
      name: 'Musk turtles',
      status: '🚫 Not recommended for wild food',
      examples: ['Common musk turtle', 'Loggerhead musk turtle', 'Razor-backed musk turtle', 'Flattened musk turtle'],
      note: 'Small size, conservation concerns, and species-specific restrictions make musk turtles poor candidates for harvesting. The flattened musk turtle in particular is a conservation concern.',
    },
    {
      name: 'Painted turtles',
      status: '⚠️ Verify species and local regulations',
      examples: ['Eastern painted turtle', 'Midland painted turtle', 'Southern painted turtle', 'Western painted turtle'],
      note: 'Widespread, but regulations vary and collection may be restricted. If legally obtained, slow cooking in a soup or stew is the traditional approach.',
    },
    {
      name: 'Diamondback terrapin',
      status: '🚨 Special conservation warning',
      note: "Inhabits coastal salt-marsh environments and has experienced significant pressures in portions of its range. Don't assume it's legal to collect — state regulations can restrict possession, size, season, collection method, and the number that may be taken. Check current state regulations; do not harvest where protected or closed.",
    },
  ],
  extraNotes: [
    {
      heading: '🥚 Turtle eggs',
      text: 'Not recommended for food. Nest disturbance can harm populations, and collection is prohibited or restricted in many jurisdictions.',
    },
    {
      heading: '🫀 Turtle organs',
      text: "Not recommended as a general recipe. Turtle organs aren't necessary to make good turtle dishes, and abnormal-looking organs should never be consumed.",
    },
    {
      heading: '⚠️ Food-safety rule',
      text: "Turtles deserve more caution than most fish. Reptiles can carry Salmonella even when they appear perfectly healthy — use separate equipment for raw turtle, wash hands thoroughly, disinfect preparation surfaces, and prevent raw turtle from contacting ready-to-eat food. Don't eat turtles from contaminated waters: turtles can accumulate environmental contaminants, and cooking doesn't reliably eliminate heavy metals or persistent chemicals.",
    },
  ],
}

/** Shown once in the "S" section, after the nonvenomous-snake/rattlesnake
 * recipes. */
export const SNAKE_GUIDE: AnimalGroupGuide = {
  title: 'Other Snakes — Species-by-Species Status',
  statusEntries: [
    {
      name: 'Water snakes',
      status: '⚠️ Species-specific — do not harvest based on appearance alone',
      examples: ['Northern water snake', 'Common water snake', 'Plain-bellied water snake', 'Banded water snake', 'Diamondback water snake'],
      note: 'Frequently confused with venomous snakes, particularly cottonmouths in the Southeast. If you cannot positively identify the species, leave the snake alone. For a legally harvested species, the Fried Snake or Snake Stew recipes above can be used.',
    },
    {
      name: 'Rat snakes',
      status: '⚠️ Legal status varies',
      examples: ['Eastern ratsnake', 'Western ratsnake', 'Central ratsnake', 'Corn snake'],
      note: 'Some are common; others have specific collection restrictions. Use the Fried Snake recipe above after confirming the exact species may legally be harvested.',
    },
    {
      name: 'Kingsnakes',
      status: '⚠️ Species-specific',
      examples: ['Eastern kingsnake', 'Speckled kingsnake', 'California kingsnake', 'Prairie kingsnake'],
      note: 'Many kingsnakes are valuable native predators and some populations have conservation concerns — only harvest a specific kingsnake if current local regulations clearly allow it.',
    },
    {
      name: 'Copperhead',
      status: '🚨 VENOMOUS — do not handle',
      note: 'A venomous pit viper. Do not attempt to capture, kill, or process one for food. Sometimes mistaken for harmless water snakes — if encountered, give it distance and let it leave.',
    },
    {
      name: 'Cottonmouth',
      status: '🚨 VENOMOUS — do not handle for food',
      note: 'A venomous pit viper found primarily in the southeastern US, often confused with harmless water snakes. Never use "it has a triangular head" or "it opened its mouth" as your sole identification method.',
    },
    {
      name: 'Coral snakes',
      status: '🚨 NEVER HARVEST FOR FOOD',
      examples: ['Eastern coral snake', 'Texas coral snake', 'Arizona/Sonoran coral snake'],
      note: "Venomous — leave them alone. Don't rely on the red/yellow/black band rhyme as identification; similar-looking snakes occur in different regions.",
    },
    {
      name: 'Other rattlesnakes',
      status: '🚨 VENOMOUS — not a do-it-yourself wild-food animal',
      examples: ['Western diamondback', 'Eastern diamondback', 'Timber rattlesnake', 'Prairie rattlesnake', 'Mojave rattlesnake', 'Sidewinder', 'Western rattlesnake', 'Black-tailed rattlesnake', 'Massasauga', 'Pygmy rattlesnakes'],
      note: "Although rattlesnake meat has culinary traditions, processing instructions for venomous snakes don't belong in a general-purpose cookbook — the risk of envenomation during capture and processing isn't worth presenting as an ordinary recipe.",
    },
    {
      name: 'Massasauga',
      status: '🚨 VENOMOUS & conservation concern — DO NOT HARVEST',
      note: 'The eastern massasauga is a conservation concern in parts of its range and is protected under federal law as an endangered species. If you encounter one, leave it alone.',
    },
    {
      name: 'Pygmy rattlesnakes',
      status: '🚨 VENOMOUS — do not handle',
      note: 'Small but venomous — their small size does not mean their bite is harmless.',
    },
    {
      name: 'Small nonvenomous snakes',
      status: 'Not recommended — little meat, ecologically valuable',
      examples: ['Garter snakes', 'Ring-necked snakes', "Dekay's brownsnakes", 'Rough earth snakes', 'Smooth earth snakes', 'Worm snakes', 'Red-bellied snakes', 'Crowned snakes'],
      note: "Small nonvenomous snake ≠ worthwhile food animal. Don't harvest a snake simply because you can technically eat it.",
    },
  ],
  extraNotes: [
    {
      heading: '🥚 Snake eggs',
      text: 'Do not collect for food. Species identification can be difficult, some species are protected, removing eggs can harm local populations, many species produce relatively few eggs, and collection may violate wildlife regulations.',
    },
    {
      heading: '🫀 Snake organs',
      text: "Keep the snake section focused on muscle meat. Don't consume organs from an unfamiliar wild reptile — if an organ looks abnormal, has parasites, cysts, discoloration, or an unusual odor, discard the carcass rather than trying to salvage it.",
    },
  ],
}

/** Shown once in the "C" section, after the crawfish/crayfish recipes —
 * crawfish/crayfish file under C as a blanket category (like Fish under F
 * and Birds under B), regardless of the specific species' own name. */
export const CRAWFISH_GUIDE: AnimalGroupGuide = {
  title: 'Burrowing Crayfish & General Crawfish Notes',
  statusEntries: [
    {
      name: 'Digger / Primary-Burrowing Crayfish',
      status: '⚠️ SPECIES-SPECIFIC — VERIFY LEGALITY FIRST',
      note: "The United States has numerous primary-burrowing crayfish, including species that spend much of their lives away from open streams. Because this group contains many obscure native species with restricted distributions, no generic harvest recipe is given here, and digging them up isn't encouraged. Some burrowing crayfish are rare or have restricted ranges — harvesting them can damage local populations and habitat. If a particular species is legally obtained, the cooked meat can be used in the same dishes as other crayfish: boils, étouffée, chowder, pasta, or fried tails.",
    },
  ],
  extraNotes: [
    {
      heading: '🦞 How to Clean Crayfish',
      text: "For edible, legally harvested crayfish: keep them alive and chilled until you're ready to cook them, rinse thoroughly under clean running water, remove obvious mud, debris, and damaged individuals, and cook thoroughly. Once cooked, twist off the tail, peel away the shell, remove the digestive tract from the tail if desired, extract claw meat from larger species, and refrigerate cooked meat promptly. ⚠️ Don't eat raw crayfish — raw or undercooked freshwater crustaceans can carry parasites and pathogens.",
    },
    {
      heading: '🦞 What About the "Mustard"?',
      text: 'The yellow material inside a crawfish, often called "mustard," is associated with the hepatopancreas/digestive organs. Eat the tail and claw meat, and discard internal organs if you\'re uncertain about the water quality or species. Crayfish can accumulate contaminants from their environment, so local fish-consumption advisories matter, particularly for crayfish harvested from urban, industrial, or contaminated waters.',
    },
    {
      heading: '🦞 Crayfish From Different Waters',
      text: "Don't assume a crayfish is edible simply because another crayfish species is. Avoid eating crayfish collected from sewage-contaminated water, industrially contaminated waterways, areas under a local consumption advisory, water with known chemical contamination, or locations where harvesting is prohibited. Cooking kills many biological hazards but doesn't reliably remove contaminants such as mercury, PCBs, or other persistent pollutants.",
    },
  ],
}

/** Shown once in the "M" section, after the mollusk recipes — mussels,
 * clams, and freshwater snails all file under M as one blanket "mussels"
 * category, per the same rule used for fish/birds/crawfish, even though
 * a clam or snail isn't literally a mussel. */
export const MUSSEL_GUIDE: AnimalGroupGuide = {
  title: 'Freshwater Mussels & Snails — Species-by-Species Status',
  intro:
    "North America has one of the world's great freshwater-mussel faunas, but many species have undergone severe population declines. Don't collect a mussel simply because it looks like an edible clam — treat an unidentified freshwater mussel as 🚨 LEAVE IT ALONE. Before collecting a native mussel, determine the exact species, the jurisdiction, whether recreational harvest is allowed, the current season, size restrictions, the daily possession limit, its conservation status, and whether the specific waterway has a closure.",
  statusEntries: [
    {
      name: 'Freshwater Pearl Mussels',
      status: '🚨 Generally Protected — DO NOT COLLECT AN UNIDENTIFIED NATIVE MUSSEL',
      examples: [
        'Eastern elliptio',
        'Plain pocketbook',
        'Fatmucket',
        'Giant floater',
        'Three-ridge',
        'Washboard',
        'Pimpleback',
        'White heelsplitter',
        'Spike',
        'Many others',
      ],
      note: 'Native freshwater mussels are among the most imperiled groups of animals in North America. Verify the exact species and current regulations before harvesting — some native mussels are legally harvestable in particular states, but many are protected or have strict harvest limits. No generic recipe is given for wild native mussels.',
    },
    {
      name: 'Ramshorn Snails',
      status: '🟡 Edible in some contexts, but not recommended for wild harvest',
      note: 'The meat yield is extremely small, while the risks associated with consuming unidentified wild freshwater mollusks make them a poor food choice.',
    },
    {
      name: 'Mystery/Apple Snails',
      status: '🚨 Species-specific — DO NOT EAT AN UNIDENTIFIED APPLE SNAIL',
      note: 'Some introduced apple/mystery-type snail species have invasive populations, while others have different legal and health considerations. If a particular species is legally harvestable and approved for consumption, it can be boiled, steamed, prepared in garlic butter, curried, or stir-fried — but no generic American wild-harvest recipe is given for the entire group.',
    },
    {
      name: 'Freshwater Limpets',
      status: '🚫 Not a practical food animal',
      note: 'Freshwater limpets are tiny aquatic snails that are extremely small, difficult to collect, poor in meat, and ecologically useful. Leave them in the ecosystem.',
    },
    {
      name: 'Pond Snails',
      status: '⚠️ Not recommended',
      note: '"Pond snail" encompasses multiple species, and some can be intermediate hosts for parasites. They\'re much more useful to the ecosystem than they are as a meal.',
    },
    {
      name: 'River Mussels',
      status: '🚨 Identify to species before harvest',
      examples: ['Elliptio', 'Lampsilis', 'Pyganodon', 'Strophitus', 'Amblema', 'Potamilus', 'Quadrula and related groups'],
      note: "Historically, some freshwater mussels were eaten in the United States, but today you cannot responsibly treat \"river mussel\" as one edible species. Check current state regulations and conservation status; if identification is uncertain, leave it alone. If you have a legally harvested species your state specifically permits for consumption, the traditional preparation is thorough cooking followed by removal of the meat, rather than eating them raw.",
    },
  ],
  extraNotes: [
    {
      heading: '☠️ Water Quality Matters',
      text: "Freshwater mollusks are filter feeders, meaning they can concentrate substances present in their environment. Don't collect freshwater shellfish from industrial waterways, sewage-contaminated water, areas with known chemical contamination, waters under a shellfish consumption advisory, or locations where harvesting is prohibited. Cooking isn't a magic solution for chemical contamination — heat can kill many pathogens, but it doesn't reliably eliminate heavy metals, PCBs, PFAS, or other persistent contaminants.",
    },
    {
      heading: '🦪 What About Eating Them Raw?',
      text: "NO RAW WILD FRESHWATER MOLLUSKS. Don't eat wild freshwater mussels, clams, or snails raw or undercooked. Thorough cooking is particularly important because freshwater mollusks can harbor pathogens and parasites.",
    },
  ],
}

export interface InsectSafetyGuide {
  /** "🟢 Good candidates" — worthwhile, generally reasonable food insects. */
  goodCandidates: string[]
  /** "🟡 Use caution" — technically edible but not a great choice. */
  useCaution: string[]
  /** "🚨 Leave alone" — do not eat. */
  leaveAlone: string[]
  /** The Eastern lubber grasshopper callout — a concrete example of why "all grasshoppers are edible" is unsafe. */
  lubberWarning: string
  pesticideWarning: string
  pesticideAvoidLocations: string[]
  prepFormula: string
}

/** Shown once in the "Insects" category section, after the cricket/
 * grasshopper/katydid recipes. Insects file into their own dedicated
 * category rather than the plain A-Z index, per the same blanket-group
 * rule used for Birds/Fish/Frogs/etc. */
export const INSECT_SAFETY_GUIDE: InsectSafetyGuide = {
  goodCandidates: ['Large-bodied grasshoppers', 'Field crickets', 'Larger katydids', 'Mormon crickets', 'Food-grade farmed crickets'],
  useCaution: ['Tiny tree crickets', 'Unidentified katydids', 'Unidentified small grasshoppers'],
  leaveAlone: [
    'Lubber grasshoppers',
    'Any insect from a pesticide-treated area',
    'Any unidentified insect',
    'Insects collected near roads, industrial areas, or contaminated waterways',
  ],
  lubberWarning:
    "🚨 DO NOT EAT LUBBER GRASSHOPPERS. Eastern lubber grasshoppers (Romalea microptera) are large, conspicuous southeastern grasshoppers that can contain defensive toxins and should not be treated as a food species — don't assume that cooking makes a chemically defended insect safe. This is a good example of why \"all grasshoppers are edible\" is not a safe rule.",
  pesticideWarning:
    "Pesticides are the biggest wild-insect issue. You generally cannot make pesticide residues safe simply by cooking the insect.",
  pesticideAvoidLocations: [
    'Recently sprayed lawns',
    'Agricultural fields unless you know the pesticide history',
    'Parks treated with insecticides',
    'Roadside areas',
    'Golf courses',
    'Industrial areas',
    'Areas treated for mosquito control',
  ],
  prepFormula:
    'Identify → verify legality → pesticide-free location → rinse → blanch → remove wings/legs → dry → roast/fry → season.',
}

/** Groups only the plain-A-Z recipes (those with an `indexLetter`, i.e. no
 * `category`) — category recipes are rendered in their own dedicated
 * section instead, via getCategoryRecipes. */
export function groupRecipesByLetter(recipes: Recipe[]): Record<string, Recipe[]> {
  const groups: Record<string, Recipe[]> = {}
  for (const recipe of recipes) {
    if (!recipe.indexLetter) continue
    const key = recipe.indexLetter.toUpperCase()
    groups[key] = groups[key] ?? []
    groups[key].push(recipe)
  }
  return groups
}

/** All recipes belonging to one dedicated category section, in their
 * original array order. */
export function getCategoryRecipes(recipes: Recipe[], category: RecipeCategory): Recipe[] {
  return recipes.filter((r) => r.category === category)
}

export function groupRecipesByAnimal(recipes: Recipe[]): { animal: string; recipes: Recipe[] }[] {
  const order: string[] = []
  const groups: Record<string, Recipe[]> = {}
  for (const recipe of recipes) {
    if (!groups[recipe.animal]) {
      groups[recipe.animal] = []
      order.push(recipe.animal)
    }
    groups[recipe.animal].push(recipe)
  }
  return order.map((animal) => ({ animal, recipes: groups[animal] }))
}
