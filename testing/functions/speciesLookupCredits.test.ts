import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// ---- In-memory Firestore mock (collection/doc/get/set + runTransaction) —
// same flat pattern as testing/functions/waterScanCredits.test.ts. This
// module only ever touches the speciesLookupCredits collection, so a flat
// store keyed by uid alone is unambiguous here. ----
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
  consumeSpeciesLookupCredit,
  DAILY_SPECIES_LOOKUP_LIMIT,
  SPECIES_LOOKUP_WINDOW_MS,
} = require("../../functions/src/speciesLookupCredits");

describe("consumeSpeciesLookupCredit", () => {
  const originalNow = Date.now;

  beforeEach(() => {
    store = {};
    jest.clearAllMocks();
  });

  afterEach(() => {
    Date.now = originalNow;
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it("allows exactly DAILY_SPECIES_LOOKUP_LIMIT consumes, decrementing creditsRemaining each time", async () => {
    for (let i = 0; i < DAILY_SPECIES_LOOKUP_LIMIT; i++) {
      const result = await consumeSpeciesLookupCredit("user-1");
      expect(result.creditsRemaining).toBe(DAILY_SPECIES_LOOKUP_LIMIT - (i + 1));
    }
  });

  it("rejects the next consume once the limit is used up, as a resource-exhausted error", async () => {
    for (let i = 0; i < DAILY_SPECIES_LOOKUP_LIMIT; i++) {
      await consumeSpeciesLookupCredit("user-2");
    }
    await expect(consumeSpeciesLookupCredit("user-2")).rejects.toMatchObject({ code: "resource-exhausted" });
  });

  it("includes a resetAt exactly SPECIES_LOOKUP_WINDOW_MS after the window's first consume", async () => {
    const start = 1_700_000_000_000;
    Date.now = jest.fn(() => start);
    for (let i = 0; i < DAILY_SPECIES_LOOKUP_LIMIT; i++) {
      await consumeSpeciesLookupCredit("user-3");
    }

    Date.now = jest.fn(() => start + 1000);
    let caught: any;
    try {
      await consumeSpeciesLookupCredit("user-3");
    } catch (err) {
      caught = err;
    }
    expect(caught.details.resetAt).toBe(start + SPECIES_LOOKUP_WINDOW_MS);
  });

  it("tracks each uid against its own separate credit pool", async () => {
    for (let i = 0; i < DAILY_SPECIES_LOOKUP_LIMIT; i++) {
      await consumeSpeciesLookupCredit("user-a");
    }
    const result = await consumeSpeciesLookupCredit("user-b");
    expect(result.creditsRemaining).toBe(DAILY_SPECIES_LOOKUP_LIMIT - 1);
  });

  it("resets the window once SPECIES_LOOKUP_WINDOW_MS has elapsed since the first consume", async () => {
    const start = 1_700_000_000_000;
    Date.now = jest.fn(() => start);
    for (let i = 0; i < DAILY_SPECIES_LOOKUP_LIMIT; i++) {
      await consumeSpeciesLookupCredit("user-4");
    }

    Date.now = jest.fn(() => start + SPECIES_LOOKUP_WINDOW_MS + 1);
    const result = await consumeSpeciesLookupCredit("user-4");
    expect(result.creditsRemaining).toBe(DAILY_SPECIES_LOOKUP_LIMIT - 1);
  });
});
