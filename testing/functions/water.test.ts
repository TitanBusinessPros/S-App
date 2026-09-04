import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// ---- In-memory Firestore mock (collection/doc/get/set + runTransaction) ----
let store: Record<string, any> = {};

const docMock = jest.fn((id: string) => {
  const ref = {
    id,
    get: jest.fn(async () => ({
      exists: store[id] !== undefined,
      data: () => store[id],
    })),
    set: jest.fn(async (data: any, opts?: { merge?: boolean }) => {
      store[id] = opts?.merge ? { ...(store[id] ?? {}), ...data } : data;
    }),
  };
  return ref;
});
const collectionMock = jest.fn(() => ({ doc: docMock }));
const runTransactionMock = jest.fn(async (updateFn: (tx: any) => Promise<void> | void) => {
  const tx = {
    get: async (ref: any) => ref.get(),
    set: (ref: any, data: any, opts?: any) => {
      ref.set(data, opts);
    },
  };
  return updateFn(tx);
});

jest.mock("firebase-admin/firestore", () => ({
  getFirestore: () => ({ collection: collectionMock, runTransaction: runTransactionMock }),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  milesToMeters,
  clampRadiusMiles,
  haversineMiles,
  buildQueryUrl,
  representativePoint,
  getWaterFeatures,
  MIN_RADIUS_MILES,
  MAX_RADIUS_MILES,
  TARGET_COUNT,
  LAYER_WATERBODY,
  LAYER_FLOWLINE,
  LAYER_SPRING,
} = require("../../functions/src/water");

const METADATA_JSON = { copyrightText: "Credits: USGS TNM / NGTOC – 3D National Hydrography Program (3DHP.) Data refreshed August 5, 2026." };
const SEARCH_LAT = 35.5;
const SEARCH_LNG = -97.5;

/** A point `offsetIndex` steps east of the search point — distance from the
 * search point increases monotonically with offsetIndex, so tests can
 * assert nearest-first ordering and which indices got cut. */
function pointFeature(objectId: number, offsetIndex: number, featuretype: number, name: string | null = null) {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [SEARCH_LNG + offsetIndex * 0.001, SEARCH_LAT] },
    properties: { OBJECTID: objectId, featuretype, gnisidlabel: name },
  };
}

function metersToMilesRounded(meters: number): number {
  return Math.round(meters / 1609.344);
}

/** Mocks USGS responses keyed by ring radius (in miles, rounded): for each
 * ring size actually requested, returns a fixed set of synthetic features
 * per layer. Rings/layers not configured return zero features. */
function mockUsgsFetch(byRingMiles: Record<number, { 60?: any[]; 50?: any[]; 20?: any[] }>) {
  return jest.fn(async (url: string) => {
    if (url.startsWith("https://3dhp.nationalmap.gov/arcgis/rest/services/usgs_3dhp_all/FeatureServer?f=json")) {
      return { ok: true, json: async () => METADATA_JSON };
    }
    const parsed = new URL(url);
    const layerMatch = /FeatureServer\/(\d+)\/query/.exec(parsed.pathname);
    const layer = layerMatch ? (Number(layerMatch[1]) as 60 | 50 | 20) : null;
    if (!layer) throw new Error(`Unexpected URL in test: ${url}`);

    const ringMiles = metersToMilesRounded(Number(parsed.searchParams.get("distance")));
    const offset = Number(parsed.searchParams.get("resultOffset") ?? 0);
    const all = byRingMiles[ringMiles]?.[layer] ?? [];
    const page = all.slice(offset, offset + 2000);
    const exceededTransferLimit = offset + page.length < all.length;
    return { ok: true, json: async () => ({ type: "FeatureCollection", features: page, exceededTransferLimit }) };
  });
}

describe("milesToMeters", () => {
  it("converts miles to meters", () => {
    expect(milesToMeters(1)).toBeCloseTo(1609.344, 3);
  });
});

describe("clampRadiusMiles", () => {
  it("clamps into [MIN_RADIUS_MILES, MAX_RADIUS_MILES]", () => {
    expect(clampRadiusMiles(-5)).toBe(MIN_RADIUS_MILES);
    expect(clampRadiusMiles(500)).toBe(MAX_RADIUS_MILES);
    expect(clampRadiusMiles(25)).toBe(25);
  });
});

describe("haversineMiles", () => {
  it("returns 0 for the same point", () => {
    expect(haversineMiles(35.5, -97.5, 35.5, -97.5)).toBe(0);
  });

  it("returns a larger distance for a farther point", () => {
    const near = haversineMiles(35.5, -97.5, 35.501, -97.5);
    const far = haversineMiles(35.5, -97.5, 35.6, -97.5);
    expect(far).toBeGreaterThan(near);
  });
});

describe("representativePoint", () => {
  it("returns a point geometry's coordinate directly", () => {
    expect(representativePoint({ type: "Point", coordinates: [-97.5, 35.5] })).toEqual({ lat: 35.5, lng: -97.5 });
  });

  it("returns null for missing/empty geometry", () => {
    expect(representativePoint(null)).toBeNull();
    expect(representativePoint({ type: "Point", coordinates: [] })).toBeNull();
  });
});

describe("buildQueryUrl", () => {
  it("builds a point+distance geojson query for Waterbody with no where filter", () => {
    const url = buildQueryUrl(LAYER_WATERBODY, 35.5, -97.5, 16093.44);
    const parsed = new URL(url);
    expect(parsed.pathname).toBe("/arcgis/rest/services/usgs_3dhp_all/FeatureServer/60/query");
    expect(parsed.searchParams.get("distance")).toBe("16093.44");
    expect(parsed.searchParams.get("f")).toBe("geojson");
    expect(parsed.searchParams.get("outSR")).toBe("4326");
    expect(parsed.searchParams.has("where")).toBe(false);
  });

  it("filters Flowline to featuretype 1,2,3", () => {
    const url = buildQueryUrl(LAYER_FLOWLINE, 35.5, -97.5, 16093.44);
    expect(new URL(url).searchParams.get("where")).toBe("featuretype IN (1,2,3)");
  });

  it("filters HydroLocation to springs only (featuretype 7)", () => {
    const url = buildQueryUrl(LAYER_SPRING, 35.5, -97.5, 16093.44);
    expect(new URL(url).searchParams.get("where")).toBe("featuretype = 7");
  });

  it("supports pagination via resultOffset", () => {
    const url = buildQueryUrl(LAYER_WATERBODY, 35.5, -97.5, 16093.44, { resultOffset: 2000 });
    expect(new URL(url).searchParams.get("resultOffset")).toBe("2000");
  });
});

describe("getWaterFeatures", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    store = {};
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it("rejects missing/invalid arguments", async () => {
    const wrapped = testEnv.wrap(getWaterFeatures);
    await expect(wrapped({ data: { lat: 35.5 } })).rejects.toThrow(/required numbers/);
  });

  it("rejects out-of-range coordinates", async () => {
    const wrapped = testEnv.wrap(getWaterFeatures);
    await expect(wrapped({ data: { lat: 999, lng: 0, radiusMiles: 10 } })).rejects.toThrow(/out of range/);
  });

  it("caps at TARGET_COUNT, sorted nearest-first, without expanding the ring, when the first ring already has enough", async () => {
    const waterbody = Array.from({ length: 60 }, (_, i) => pointFeature(i, i, 3)); // indices 0-59
    const flowline = Array.from({ length: 60 }, (_, i) => pointFeature(1000 + i, 60 + i, 1)); // indices 60-119
    global.fetch = mockUsgsFetch({ 5: { 60: waterbody, 50: flowline } }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getWaterFeatures);
    const result = await wrapped({ data: { lat: SEARCH_LAT, lng: SEARCH_LNG, radiusMiles: 100 } });

    expect(result.count).toBe(TARGET_COUNT);
    expect(result.features).toHaveLength(TARGET_COUNT);
    expect(result.totalFound).toBe(120);
    expect(result.resultComplete).toBe(false);
    expect(result.searchedRadiusMiles).toBe(5); // never had to expand past the first ring

    // Nearest-first: distances are non-decreasing.
    for (let i = 1; i < result.features.length; i++) {
      expect(result.features[i].distanceMiles).toBeGreaterThanOrEqual(result.features[i - 1].distanceMiles);
    }
    // The 20 farthest (offset indices 100-119) were cut.
    const ids = new Set(result.features.map((f: any) => f.sourceFeatureId));
    expect(ids.has("1059")).toBe(false); // offset index 119 -> objectId 1059
    expect(ids.has("0")).toBe(true); // the closest point is kept
  });

  it("expands the ring when the first ring has too few candidates, and stops once TARGET_COUNT is reached", async () => {
    const smallRing = [pointFeature(1, 0, 3)]; // only 1 feature within 5mi
    const biggerRing = Array.from({ length: 150 }, (_, i) => pointFeature(i, i, 3)); // 150 within 15mi
    global.fetch = mockUsgsFetch({
      5: { 60: smallRing, 50: [], 20: [] },
      15: { 60: biggerRing, 50: [], 20: [] },
    }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getWaterFeatures);
    const result = await wrapped({ data: { lat: SEARCH_LAT, lng: SEARCH_LNG, radiusMiles: 100 } });

    expect(result.searchedRadiusMiles).toBe(15);
    expect(result.count).toBe(TARGET_COUNT);
    expect(result.totalFound).toBe(150);
    expect(result.resultComplete).toBe(false);
  });

  it("stops expanding at the requested radius and reports complete when genuinely fewer than TARGET_COUNT exist", async () => {
    const sparse = Array.from({ length: 10 }, (_, i) => pointFeature(i, i, 3));
    // Requested radius is 20mi -> ring sequence is 5, 15, 20 (capped).
    global.fetch = mockUsgsFetch({
      5: { 60: sparse.slice(0, 3), 50: [], 20: [] },
      15: { 60: sparse.slice(0, 6), 50: [], 20: [] },
      20: { 60: sparse, 50: [], 20: [] },
    }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getWaterFeatures);
    const result = await wrapped({ data: { lat: SEARCH_LAT, lng: SEARCH_LNG, radiusMiles: 20 } });

    expect(result.searchedRadiusMiles).toBe(20);
    expect(result.count).toBe(10);
    expect(result.totalFound).toBe(10);
    expect(result.resultComplete).toBe(true);
  });

  it("returns a cache hit without calling USGS again", async () => {
    const now = Date.now();
    store["35.5_-97.5_10"] = {
      lat: 35.5,
      lng: -97.5,
      radiusMiles: 10,
      searchedRadiusMiles: 5,
      features: [{ id: "60/1", name: "Cached Lake", waterType: "lake", lat: 35.5, lng: -97.5, distanceMiles: 0, sourceFeatureId: "1", sourceLayer: 60 }],
      count: 1,
      totalFound: 1,
      resultComplete: true,
      source: "usgs-3dhp",
      attribution: "Credits: USGS TNM / NGTOC",
      sourceRefreshDate: "August 5, 2026",
      fetchedAt: now,
      expiresAt: now + 1000 * 60 * 60,
      schemaVersion: 2,
      fetchLockedAt: null,
    };

    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getWaterFeatures);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10 } });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.fromCache).toBe(true);
    expect(result.count).toBe(1);
    expect(result.features[0].name).toBe("Cached Lake");
  });

  it("treats a cache entry from an older schema version as a miss and fetches fresh", async () => {
    const now = Date.now();
    // radiusMiles: 5 keeps this to a single ring (min(5, 5) === 5, which
    // already equals the max requested radius), avoiding needing to model
    // ring-expansion superset behavior in the mock for this test.
    store["35.5_-97.5_5"] = {
      // Old (pre-nearest-100) shape: no searchedRadiusMiles/totalFound, schemaVersion 1.
      lat: 35.5,
      lng: -97.5,
      radiusMiles: 5,
      features: new Array(3000).fill(0).map((_, i) => ({ id: `60/${i}` })),
      count: 3000,
      resultComplete: true,
      source: "usgs-3dhp",
      attribution: "old",
      sourceRefreshDate: null,
      fetchedAt: now,
      expiresAt: now + 1000 * 60 * 60,
      schemaVersion: 1,
      fetchLockedAt: null,
    };

    const fresh = [pointFeature(1, 0, 3)];
    global.fetch = mockUsgsFetch({ 5: { 60: fresh, 50: [], 20: [] } }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getWaterFeatures);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 5 } });

    expect(result.fromCache).toBe(false);
    expect(result.count).toBe(1);
  });

  it("fails cleanly when a USGS request fails, without caching a result", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 }) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getWaterFeatures);
    await expect(wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10 } })).rejects.toThrow(/returned an error/);

    const cacheKey = "35.5_-97.5_10";
    expect(store[cacheKey]?.resultComplete).toBeUndefined();
    expect(store[cacheKey]?.features).toBeUndefined();
  });
});
