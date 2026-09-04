import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

const ADMIN_EMAIL = "adonai4you@gmail.com";

let store: Record<string, Record<string, unknown>>;

function docRef(path: string) {
  return {
    get: jest.fn(async () => ({ exists: store[path] !== undefined, data: () => store[path] })),
    set: jest.fn(async (data: Record<string, unknown>) => {
      store[path] = data;
    }),
    delete: jest.fn(async () => {
      delete store[path];
    }),
  };
}

const collectionMock = jest.fn((name: string) => ({ doc: (id: string) => docRef(`${name}/${id}`) }));

jest.mock("firebase-admin/firestore", () => ({
  getFirestore: () => ({ collection: collectionMock }),
}));
jest.mock("firebase-admin/app", () => ({
  initializeApp: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createUserProfile } = require("../../functions/src/index");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TRIAL_DURATION_MS } = require("../../functions/src/constants");

describe("createUserProfile", () => {
  beforeEach(() => {
    store = {};
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it("starts an ordinary sign-in on a 30-day trial", async () => {
    const wrapped = testEnv.wrap(createUserProfile);
    const before = Date.now();
    const fakeUser = {
      uid: "user-123",
      email: "person@example.com",
      displayName: "Test Person",
      photoURL: "https://example.com/pic.jpg",
    };

    await wrapped(fakeUser as never);

    const profile = store["users/user-123"];
    expect(profile).toMatchObject({
      email: "person@example.com",
      displayName: "Test Person",
      photoURL: "https://example.com/pic.jpg",
      tier: "trial",
    });
    expect(profile.trialEndsAt as number).toBeGreaterThanOrEqual(before + TRIAL_DURATION_MS);
  });

  it("falls back to null for missing profile fields", async () => {
    const wrapped = testEnv.wrap(createUserProfile);
    const fakeUser = { uid: "user-456" };

    await wrapped(fakeUser as never);

    expect(store["users/user-456"]).toMatchObject({
      email: null,
      displayName: null,
      photoURL: null,
      tier: "trial",
    });
  });

  it("gives the admin's own email permanent gold with no trial", async () => {
    const wrapped = testEnv.wrap(createUserProfile);
    const fakeUser = { uid: "admin-uid", email: ADMIN_EMAIL };

    await wrapped(fakeUser as never);

    expect(store["users/admin-uid"]).toMatchObject({ tier: "gold", trialEndsAt: null });
  });

  it("applies a pending gold grant immediately and clears it", async () => {
    store["pendingGoldGrants/waiting@example.com"] = { grantedBy: ADMIN_EMAIL, grantedAt: 1 };
    const wrapped = testEnv.wrap(createUserProfile);
    const fakeUser = { uid: "user-789", email: "waiting@example.com" };

    await wrapped(fakeUser as never);

    expect(store["users/user-789"]).toMatchObject({ tier: "gold", trialEndsAt: null });
    expect(store["pendingGoldGrants/waiting@example.com"]).toBeUndefined();
  });
});
