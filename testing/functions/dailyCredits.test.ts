import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// ---- In-memory Firestore mock: path-prefixed (collection/doc) keys, same
// pattern as water.test.ts, so this generic helper's own tests can exercise
// more than one collection without colliding. ----
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { consumeDailyCredit } = require("../../functions/src/dailyCredits");

const LIMIT = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MESSAGE = "out of credits for today";

describe("consumeDailyCredit", () => {
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

  it("allows exactly `limit` consumes, decrementing creditsRemaining each time", async () => {
    for (let i = 0; i < LIMIT; i++) {
      const result = await consumeDailyCredit("testCredits", "user-1", LIMIT, WINDOW_MS, MESSAGE);
      expect(result.creditsRemaining).toBe(LIMIT - (i + 1));
    }
  });

  it("rejects the next consume once the limit is used up, as a resource-exhausted error with the given message", async () => {
    for (let i = 0; i < LIMIT; i++) {
      await consumeDailyCredit("testCredits", "user-2", LIMIT, WINDOW_MS, MESSAGE);
    }
    await expect(consumeDailyCredit("testCredits", "user-2", LIMIT, WINDOW_MS, MESSAGE)).rejects.toMatchObject({
      code: "resource-exhausted",
      message: MESSAGE,
    });
  });

  it("includes a resetAt exactly windowMs after the window's first consume", async () => {
    const start = 1_700_000_000_000;
    Date.now = jest.fn(() => start);
    for (let i = 0; i < LIMIT; i++) {
      await consumeDailyCredit("testCredits", "user-3", LIMIT, WINDOW_MS, MESSAGE);
    }

    Date.now = jest.fn(() => start + 1000);
    let caught: any;
    try {
      await consumeDailyCredit("testCredits", "user-3", LIMIT, WINDOW_MS, MESSAGE);
    } catch (err) {
      caught = err;
    }
    expect(caught.details.resetAt).toBe(start + WINDOW_MS);
  });

  it("tracks each uid against its own separate credit pool", async () => {
    for (let i = 0; i < LIMIT; i++) {
      await consumeDailyCredit("testCredits", "user-a", LIMIT, WINDOW_MS, MESSAGE);
    }
    const result = await consumeDailyCredit("testCredits", "user-b", LIMIT, WINDOW_MS, MESSAGE);
    expect(result.creditsRemaining).toBe(LIMIT - 1);
  });

  it("tracks each collection against its own separate credit pool, even for the same uid", async () => {
    for (let i = 0; i < LIMIT; i++) {
      await consumeDailyCredit("collectionA", "same-uid", LIMIT, WINDOW_MS, MESSAGE);
    }
    const result = await consumeDailyCredit("collectionB", "same-uid", LIMIT, WINDOW_MS, MESSAGE);
    expect(result.creditsRemaining).toBe(LIMIT - 1);
  });

  it("resets the window once windowMs has elapsed since the first consume", async () => {
    const start = 1_700_000_000_000;
    Date.now = jest.fn(() => start);
    for (let i = 0; i < LIMIT; i++) {
      await consumeDailyCredit("testCredits", "user-4", LIMIT, WINDOW_MS, MESSAGE);
    }

    Date.now = jest.fn(() => start + WINDOW_MS + 1);
    const result = await consumeDailyCredit("testCredits", "user-4", LIMIT, WINDOW_MS, MESSAGE);
    expect(result.creditsRemaining).toBe(LIMIT - 1);
  });
});
