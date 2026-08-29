import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

const setMock = jest.fn().mockResolvedValue(undefined);
const docMock = jest.fn(() => ({ set: setMock }));
const collectionMock = jest.fn(() => ({ doc: docMock }));

jest.mock("firebase-admin/firestore", () => ({
  getFirestore: () => ({ collection: collectionMock }),
}));
jest.mock("firebase-admin/app", () => ({
  initializeApp: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createUserProfile } = require("../../functions/src/index");

describe("createUserProfile", () => {
  afterAll(() => {
    testEnv.cleanup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates a Firestore profile doc defaulted to the free tier", async () => {
    const wrapped = testEnv.wrap(createUserProfile);
    const fakeUser = {
      uid: "user-123",
      email: "person@example.com",
      displayName: "Test Person",
      photoURL: "https://example.com/pic.jpg",
    };

    await wrapped(fakeUser as never);

    expect(collectionMock).toHaveBeenCalledWith("users");
    expect(docMock).toHaveBeenCalledWith("user-123");
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "person@example.com",
        displayName: "Test Person",
        photoURL: "https://example.com/pic.jpg",
        tier: "free",
      })
    );
  });

  it("falls back to null for missing profile fields", async () => {
    const wrapped = testEnv.wrap(createUserProfile);
    const fakeUser = { uid: "user-456" };

    await wrapped(fakeUser as never);

    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: null,
        displayName: null,
        photoURL: null,
        tier: "free",
      })
    );
  });
});
