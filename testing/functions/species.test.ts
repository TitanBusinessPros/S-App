import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// ---- In-memory Firestore mock: path-prefixed (collection/doc) keys, so
// `users` (for requirePaidAccess) and `speciesLookupCredits` (for the daily
// lookup limit) can share one flat store without colliding when the same
// uid is used as the doc id in both -- see water.test.ts for the same
// pattern. ----
let store: Record<string, any> = {};

function docRef(path: string) {
  return {
    id: path.split("/").pop() as string,
    get: jest.fn(async () => ({
      exists: store[path] !== undefined,
      data: () => store[path],
    })),
    set: jest.fn(async (data: any, opts?: { merge?: boolean }) => {
      store[path] = opts?.merge ? { ...(store[path] ?? {}), ...data } : data;
    }),
  };
}
const collectionMock = jest.fn((name: string) => ({ doc: (id: string) => docRef(`${name}/${id}`) }));
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

const AUTH = { uid: "test-uid" };

/** getSpeciesNearby now requires requirePaidAccess -- seed a profile that
 * passes it by default so the existing tests below (about species-lookup
 * behavior, not entitlement) don't each need to do this themselves. */
function seedPaidProfile(uid = AUTH.uid) {
  store[`users/${uid}`] = { tier: "premium" };
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SPECIES_DATA } = require("../../functions/src/speciesData");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isActiveInMonth, milesToKm, hasNearbyOccurrence, getSpeciesNearby } = require("../../functions/src/species");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DAILY_SPECIES_LOOKUP_LIMIT } = require("../../functions/src/speciesLookupCredits");

const VALID_CATEGORIES = [
  "edible-plant",
  "tree-wood",
  "edible-wildlife",
  "edible-insect",
  "dangerous-plant",
  "dangerous-animal",
];

describe("SPECIES_DATA", () => {
  it("is non-empty and every entry has the required shape", () => {
    expect(SPECIES_DATA.length).toBeGreaterThan(0);

    for (const entry of SPECIES_DATA) {
      expect(entry.id).toEqual(expect.any(String));
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.commonName.length).toBeGreaterThan(0);
      expect(entry.scientificName.length).toBeGreaterThan(0);
      expect(entry.summary.length).toBeGreaterThan(0);
      expect(VALID_CATEGORIES).toContain(entry.category);
      expect(Array.isArray(entry.activeMonths)).toBe(true);
      expect(entry.activeMonths.length).toBeGreaterThan(0);
      for (const month of entry.activeMonths) {
        expect(month).toBeGreaterThanOrEqual(1);
        expect(month).toBeLessThanOrEqual(12);
      }
    }
  });

  it("has unique ids", () => {
    const ids = SPECIES_DATA.map((e: { id: string }) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every tree-wood entry a woodUse block", () => {
    const trees = SPECIES_DATA.filter((e: { category: string }) => e.category === "tree-wood");
    expect(trees.length).toBeGreaterThan(0);
    for (const tree of trees) {
      expect(tree.woodUse).toBeDefined();
    }
  });
});

describe("isActiveInMonth", () => {
  it("returns true when the month is in activeMonths", () => {
    expect(isActiveInMonth({ activeMonths: [9, 10, 11] }, 10)).toBe(true);
  });

  it("returns false when the month is not in activeMonths", () => {
    expect(isActiveInMonth({ activeMonths: [9, 10, 11] }, 3)).toBe(false);
  });
});

describe("milesToKm", () => {
  it("converts miles to kilometers", () => {
    expect(milesToKm(10)).toBeCloseTo(16.09344, 4);
  });
});

describe("hasNearbyOccurrence", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns true when GBIF reports at least one occurrence", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 3 }) }) as unknown as typeof fetch;
    await expect(hasNearbyOccurrence("Rubus spp.", 35.5, -97.5, 16)).resolves.toBe(true);
  });

  it("returns false when GBIF reports zero occurrences", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 0 }) }) as unknown as typeof fetch;
    await expect(hasNearbyOccurrence("Rubus spp.", 35.5, -97.5, 16)).resolves.toBe(false);
  });

  it("throws when GBIF responds with a non-OK status", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 }) as unknown as typeof fetch;
    await expect(hasNearbyOccurrence("Rubus spp.", 35.5, -97.5, 16)).rejects.toThrow(/status 503/);
  });
});

describe("getSpeciesNearby", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    store = {};
    seedPaidProfile();
  });
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });
  afterAll(() => {
    testEnv.cleanup();
  });

  it("rejects missing/invalid arguments", async () => {
    const wrapped = testEnv.wrap(getSpeciesNearby);
    await expect(wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10 } })).rejects.toThrow(/required numbers/);
  });

  it("rejects an out-of-range month", async () => {
    const wrapped = testEnv.wrap(getSpeciesNearby);
    await expect(
      wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 13 } }),
    ).rejects.toThrow(/month must be between/);
  });

  it("rejects an unauthenticated call", async () => {
    const wrapped = testEnv.wrap(getSpeciesNearby);
    await expect(
      wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 } }),
    ).rejects.toThrow(/Sign in/);
  });

  it("rejects a free-tier (trial-expired) account with permission-denied, proving the server enforces this directly", async () => {
    store["users/locked-uid"] = { tier: "free" };
    const wrapped = testEnv.wrap(getSpeciesNearby);
    await expect(
      wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 }, auth: { uid: "locked-uid" } }),
    ).rejects.toMatchObject({ code: "permission-denied" });
  });

  it("includes creditsRemaining in the result and decrements it across calls", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 0 }) }) as unknown as typeof fetch;
    const wrapped = testEnv.wrap(getSpeciesNearby);

    const first = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 }, auth: AUTH });
    expect(first.creditsRemaining).toBe(DAILY_SPECIES_LOOKUP_LIMIT - 1);

    const second = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 }, auth: AUTH });
    expect(second.creditsRemaining).toBe(DAILY_SPECIES_LOOKUP_LIMIT - 2);
  });

  it("rejects the call after DAILY_SPECIES_LOOKUP_LIMIT lookups within 24h", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ count: 0 }) }) as unknown as typeof fetch;
    const wrapped = testEnv.wrap(getSpeciesNearby);

    for (let i = 0; i < DAILY_SPECIES_LOOKUP_LIMIT; i++) {
      await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 }, auth: AUTH });
    }

    await expect(
      wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 }, auth: AUTH }),
    ).rejects.toMatchObject({ code: "resource-exhausted" });
  });

  it("only calls GBIF for in-season species, and labels the confirmed one", async () => {
    // Every species active in month 1 (January) — a small, deterministic set.
    const januaryEntries = SPECIES_DATA.filter((e: { activeMonths: number[] }) => e.activeMonths.includes(1));
    expect(januaryEntries.length).toBeGreaterThan(0);

    const fetchMock = jest.fn().mockImplementation((url: string) => {
      // Confirm only the first january-active species; deny the rest.
      const requestedName = new URL(url).searchParams.get("scientificName");
      const confirm = requestedName === januaryEntries[0].scientificName;
      return Promise.resolve({ ok: true, json: async () => ({ count: confirm ? 1 : 0 }) });
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getSpeciesNearby);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 }, auth: AUTH });

    // Only species active in January are ever queried.
    expect(fetchMock).toHaveBeenCalledTimes(januaryEntries.length);

    const confirmedEntry = result.species.find((s: { id: string }) => s.id === januaryEntries[0].id);
    expect(confirmedEntry.confirmed).toBe(true);
    expect(result.radiusMiles).toBe(10);
    expect(result.month).toBe(1);
  });

  it("includes every in-season entry in a category even when only one sibling in that category is GBIF-confirmed", async () => {
    // Regression guard: a category with several curated entries used to
    // collapse down to only the one that happened to get a GBIF hit,
    // hiding the rest entirely (e.g. showing only one of five in-season
    // dangerous animals). tree-wood has multiple January-active entries,
    // making it a good case to prove the others are no longer dropped.
    const januaryEntries = SPECIES_DATA.filter((e: { activeMonths: number[] }) => e.activeMonths.includes(1));
    const treeWoodJan = januaryEntries.filter((e: { category: string }) => e.category === "tree-wood");
    expect(treeWoodJan.length).toBeGreaterThan(1);

    const fetchMock = jest.fn().mockImplementation((url: string) => {
      const requestedName = new URL(url).searchParams.get("scientificName");
      const confirm = requestedName === treeWoodJan[0].scientificName; // confirm only the first
      return Promise.resolve({ ok: true, json: async () => ({ count: confirm ? 1 : 0 }) });
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getSpeciesNearby);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 }, auth: AUTH });

    // Nothing is dropped just because a sibling in the same category got confirmed.
    expect(result.species).toHaveLength(januaryEntries.length);

    const resultTreeWood = result.species.filter((s: { category: string }) => s.category === "tree-wood");
    expect(resultTreeWood).toHaveLength(treeWoodJan.length);
    expect(resultTreeWood.find((s: { id: string }) => s.id === treeWoodJan[0].id).confirmed).toBe(true);
    for (const other of treeWoodJan.slice(1)) {
      expect(resultTreeWood.find((s: { id: string }) => s.id === other.id).confirmed).toBe(false);
    }
  });

  it("falls back to all curated entries, labeled unconfirmed, when every GBIF lookup fails", async () => {
    const januaryEntries = SPECIES_DATA.filter((e: { activeMonths: number[] }) => e.activeMonths.includes(1));
    global.fetch = jest.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    const wrapped = testEnv.wrap(getSpeciesNearby);
    const result = await wrapped({ data: { lat: 35.5, lng: -97.5, radiusMiles: 10, month: 1 }, auth: AUTH });

    // GBIF being fully unreachable degrades to "show curated content,
    // honestly unconfirmed" rather than returning nothing.
    expect(result.species).toHaveLength(januaryEntries.length);
    expect(result.species.every((s: { confirmed: boolean }) => s.confirmed === false)).toBe(true);
  });
});
