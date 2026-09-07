import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

// ---- In-memory Firestore mock (users collection only, so a flat store
// keyed by uid alone is unambiguous here) — see water.test.ts for the
// collection-prefixed version used where multiple collections are involved. ----
let store: Record<string, any> = {};

const docMock = jest.fn((id: string) => ({
  id,
  get: jest.fn(async () => ({ exists: store[id] !== undefined, data: () => store[id] })),
}));
const collectionMock = jest.fn(() => ({ doc: docMock }));

jest.mock("firebase-admin/firestore", () => ({
  getFirestore: () => ({ collection: collectionMock }),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { hasAccess, requirePaidAccess } = require("../../functions/src/entitlement");

describe("hasAccess", () => {
  it("is false when there's no profile at all", () => {
    expect(hasAccess(undefined)).toBe(false);
  });

  it("is true for gold", () => {
    expect(hasAccess({ tier: "gold" })).toBe(true);
  });

  it("is true for premium", () => {
    expect(hasAccess({ tier: "premium" })).toBe(true);
  });

  it("is true for a trial that hasn't ended yet", () => {
    const now = 1_700_000_000_000;
    expect(hasAccess({ tier: "trial", trialEndsAt: now + 1000 }, now)).toBe(true);
  });

  it("is false for a trial that already ended", () => {
    const now = 1_700_000_000_000;
    expect(hasAccess({ tier: "trial", trialEndsAt: now - 1000 }, now)).toBe(false);
  });

  it("is false for free tier", () => {
    expect(hasAccess({ tier: "free" })).toBe(false);
  });

  it("is false for a legacy trial with no trialEndsAt to check", () => {
    expect(hasAccess({ tier: "trial" })).toBe(false);
  });
});

describe("requirePaidAccess", () => {
  beforeEach(() => {
    store = {};
    jest.clearAllMocks();
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it("resolves for a user with an active premium tier", async () => {
    store["premium-uid"] = { tier: "premium" };
    await expect(requirePaidAccess("premium-uid")).resolves.toBeUndefined();
  });

  it("resolves for a user with an active trial", async () => {
    store["trial-uid"] = { tier: "trial", trialEndsAt: Date.now() + 1000 * 60 * 60 };
    await expect(requirePaidAccess("trial-uid")).resolves.toBeUndefined();
  });

  it("rejects with permission-denied for a locked (free-tier) user", async () => {
    store["free-uid"] = { tier: "free" };
    await expect(requirePaidAccess("free-uid")).rejects.toMatchObject({ code: "permission-denied" });
  });

  it("rejects with permission-denied for an expired trial", async () => {
    store["expired-uid"] = { tier: "trial", trialEndsAt: Date.now() - 1000 };
    await expect(requirePaidAccess("expired-uid")).rejects.toMatchObject({ code: "permission-denied" });
  });

  it("rejects with permission-denied when no profile doc exists at all", async () => {
    await expect(requirePaidAccess("no-such-uid")).rejects.toMatchObject({ code: "permission-denied" });
  });
});
