import functionsTest from "firebase-functions-test";

const testEnv = functionsTest();

const ADMIN_EMAIL = "adonai4you@gmail.com";
const ADMIN_AUTH = { uid: "admin-uid", token: { email: ADMIN_EMAIL } };

// ---- In-memory Firestore mock: collection/doc/get/set/delete, where().get(),
// where().limit().get(), and batch() — see testing/functions/water.test.ts
// for the same pattern applied to a simpler shape. ----
let store: Record<string, Record<string, unknown>>;

function docRef(path: string) {
  return {
    id: path.split("/").pop() as string,
    get: jest.fn(async () => ({
      exists: store[path] !== undefined,
      data: () => store[path],
      id: path.split("/").pop(),
    })),
    set: jest.fn(async (data: Record<string, unknown>, opts?: { merge?: boolean }) => {
      store[path] = opts?.merge ? { ...(store[path] ?? {}), ...data } : data;
    }),
    delete: jest.fn(async () => {
      delete store[path];
    }),
  };
}

function queryResultFrom(collectionName: string, field: string, value: unknown, max?: number) {
  const matches = Object.entries(store)
    .filter(([path, data]) => path.startsWith(`${collectionName}/`) && data[field] === value)
    .slice(0, max);
  const docs = matches.map(([path, data]) => ({ id: path.split("/").pop(), data: () => data, ref: docRef(path) }));
  return { empty: docs.length === 0, size: docs.length, docs, forEach: (fn: (d: (typeof docs)[number]) => void) => docs.forEach(fn) };
}

const collectionMock = jest.fn((name: string) => ({
  doc: (id: string) => docRef(`${name}/${id}`),
  where: (field: string, _op: string, value: unknown) => ({
    get: async () => queryResultFrom(name, field, value),
    limit: (n: number) => ({ get: async () => queryResultFrom(name, field, value, n) }),
  }),
}));

const batchMock = jest.fn(() => {
  const ops: Array<() => void> = [];
  return {
    set: (ref: ReturnType<typeof docRef>, data: Record<string, unknown>, opts?: { merge?: boolean }) => {
      ops.push(() => {
        store[`__pending__`]; // no-op keeps types happy
        void ref.set(data, opts);
      });
    },
    commit: async () => {
      ops.forEach((op) => op());
    },
  };
});

jest.mock("firebase-admin/firestore", () => ({
  getFirestore: () => ({ collection: collectionMock, batch: batchMock }),
}));

const getUserByEmailMock = jest.fn();
jest.mock("firebase-admin/auth", () => ({
  getAuth: () => ({ getUserByEmail: getUserByEmailMock }),
}));

const constructEventMock = jest.fn();
jest.mock("stripe", () => jest.fn().mockImplementation(() => ({ webhooks: { constructEvent: constructEventMock } })));

jest.mock("firebase-functions/params", () => ({
  defineSecret: () => ({ value: () => "whsec_test_secret" }),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { grantGoldMembership, backfillTrialTiers, stripeWebhook } = require("../../functions/src/billing");

function fakeRes() {
  return {
    statusCode: 200,
    body: "",
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    send(body: string) {
      this.body = body;
      return this;
    },
  };
}

beforeEach(() => {
  store = {};
  jest.clearAllMocks();
});

afterAll(() => {
  testEnv.cleanup();
});

describe("grantGoldMembership", () => {
  const wrapped = testEnv.wrap(grantGoldMembership);

  it("rejects an unauthenticated caller", async () => {
    await expect(wrapped({ data: { email: "someone@example.com" } })).rejects.toThrow(
      /Only the app admin/,
    );
  });

  it("rejects a caller who isn't the admin", async () => {
    await expect(
      wrapped({ data: { email: "someone@example.com" }, auth: { uid: "u1", token: { email: "not-admin@example.com" } } }),
    ).rejects.toThrow(/Only the app admin/);
  });

  it("rejects a missing email", async () => {
    await expect(wrapped({ data: {}, auth: ADMIN_AUTH })).rejects.toThrow(/email address is required/);
  });

  it("grants gold immediately when the account already exists", async () => {
    getUserByEmailMock.mockResolvedValue({ uid: "existing-uid" });
    store["users/existing-uid"] = { tier: "trial", email: "person@example.com" };

    const result = await wrapped({ data: { email: "Person@Example.com" }, auth: ADMIN_AUTH });

    expect(getUserByEmailMock).toHaveBeenCalledWith("person@example.com");
    expect(result).toEqual({ granted: true, pending: false });
    expect(store["users/existing-uid"]).toMatchObject({ tier: "gold", trialEndsAt: null, goldGrantedBy: ADMIN_EMAIL });
  });

  it("queues a pending grant when no account exists yet", async () => {
    getUserByEmailMock.mockRejectedValue({ code: "auth/user-not-found" });

    const result = await wrapped({ data: { email: "future@example.com" }, auth: ADMIN_AUTH });

    expect(result).toEqual({ granted: false, pending: true });
    expect(store["pendingGoldGrants/future@example.com"]).toMatchObject({ grantedBy: ADMIN_EMAIL });
  });

  it("surfaces an internal error for anything other than user-not-found", async () => {
    getUserByEmailMock.mockRejectedValue({ code: "auth/internal-error" });

    await expect(wrapped({ data: { email: "broken@example.com" }, auth: ADMIN_AUTH })).rejects.toThrow(
      /Could not look up that email/,
    );
  });
});

describe("backfillTrialTiers", () => {
  const wrapped = testEnv.wrap(backfillTrialTiers);

  it("rejects a non-admin caller", async () => {
    await expect(wrapped({ data: {}, auth: { uid: "u1", token: { email: "not-admin@example.com" } } })).rejects.toThrow(
      /Only the app admin/,
    );
  });

  it("migrates legacy free accounts to a fresh trial, and the admin's own legacy account to gold", async () => {
    store["users/user-1"] = { tier: "free", email: "person@example.com" };
    store["users/admin-uid"] = { tier: "free", email: ADMIN_EMAIL };
    store["users/already-trial"] = { tier: "trial", email: "other@example.com", trialEndsAt: 123 };

    const result = await wrapped({ data: {}, auth: ADMIN_AUTH });

    expect(result).toEqual({ updated: 2 });
    expect(store["users/user-1"]).toMatchObject({ tier: "trial" });
    expect((store["users/user-1"].trialEndsAt as number)).toBeGreaterThan(Date.now());
    expect(store["users/admin-uid"]).toMatchObject({ tier: "gold", trialEndsAt: null });
    expect(store["users/already-trial"]).toMatchObject({ tier: "trial", trialEndsAt: 123 });
  });

  it("is a no-op when nothing is left on the legacy free tier", async () => {
    const result = await wrapped({ data: {}, auth: ADMIN_AUTH });
    expect(result).toEqual({ updated: 0 });
  });
});

describe("stripeWebhook", () => {
  it("rejects a request with no Stripe-Signature header", async () => {
    const res = fakeRes();
    await stripeWebhook({ headers: {}, rawBody: Buffer.from("{}") }, res);
    expect(res.statusCode).toBe(400);
  });

  it("rejects a request whose signature fails verification", async () => {
    constructEventMock.mockImplementation(() => {
      throw new Error("bad signature");
    });
    const res = fakeRes();
    await stripeWebhook({ headers: { "stripe-signature": "bad" }, rawBody: Buffer.from("{}") }, res);
    expect(res.statusCode).toBe(400);
  });

  async function sendEvent(event: unknown) {
    constructEventMock.mockReturnValue(event);
    const res = fakeRes();
    await stripeWebhook({ headers: { "stripe-signature": "valid" }, rawBody: Buffer.from("{}") }, res);
    return res;
  }

  it("upgrades the matching user to premium via client_reference_id", async () => {
    store["users/uid-1"] = { tier: "trial", email: "person@example.com" };

    const res = await sendEvent({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_1",
          customer: "cus_1",
          subscription: "sub_1",
          client_reference_id: "uid-1",
          customer_details: { email: "person@example.com" },
        },
      },
    });

    expect(res.statusCode).toBe(200);
    expect(store["users/uid-1"]).toMatchObject({
      tier: "premium",
      stripeCustomerId: "cus_1",
      stripeSubscriptionId: "sub_1",
      subscriptionStatus: "active",
    });
    expect(store["stripeCustomers/cus_1"]).toEqual({ uid: "uid-1" });
  });

  it("falls back to matching by email when client_reference_id is missing", async () => {
    store["users/uid-2"] = { tier: "trial", email: "byemail@example.com" };

    await sendEvent({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_2",
          customer: "cus_2",
          subscription: "sub_2",
          client_reference_id: null,
          customer_details: { email: "byemail@example.com" },
        },
      },
    });

    expect(store["users/uid-2"]).toMatchObject({ tier: "premium" });
  });

  it("records an orphan payment when no user can be matched", async () => {
    await sendEvent({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_3",
          customer: "cus_3",
          subscription: "sub_3",
          client_reference_id: null,
          customer_details: { email: "nobody@example.com" },
        },
      },
    });

    expect(store["stripeOrphanPayments/cs_3"]).toMatchObject({ email: "nobody@example.com" });
  });

  it("never downgrades a gold user's tier, but still records their Stripe ids", async () => {
    store["users/gold-uid"] = { tier: "gold", email: "gold@example.com" };

    await sendEvent({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_4",
          customer: "cus_4",
          subscription: "sub_4",
          client_reference_id: "gold-uid",
          customer_details: { email: "gold@example.com" },
        },
      },
    });

    expect(store["users/gold-uid"]).toMatchObject({ tier: "gold", stripeCustomerId: "cus_4" });
  });

  it("promotes to premium on an active subscription.updated event", async () => {
    store["users/uid-5"] = { tier: "trial", email: "a@example.com" };
    store["stripeCustomers/cus_5"] = { uid: "uid-5" };

    await sendEvent({
      type: "customer.subscription.updated",
      data: { object: { customer: "cus_5", status: "active" } },
    });

    expect(store["users/uid-5"]).toMatchObject({ tier: "premium", subscriptionStatus: "active" });
  });

  it("drops to free on a canceled subscription.updated event", async () => {
    store["users/uid-6"] = { tier: "premium", email: "b@example.com" };
    store["stripeCustomers/cus_6"] = { uid: "uid-6" };

    await sendEvent({
      type: "customer.subscription.updated",
      data: { object: { customer: "cus_6", status: "canceled" } },
    });

    expect(store["users/uid-6"]).toMatchObject({ tier: "free", subscriptionStatus: "canceled" });
  });

  it("drops to free on subscription.deleted", async () => {
    store["users/uid-7"] = { tier: "premium", email: "c@example.com" };
    store["stripeCustomers/cus_7"] = { uid: "uid-7" };

    await sendEvent({
      type: "customer.subscription.deleted",
      data: { object: { customer: "cus_7", status: "canceled" } },
    });

    expect(store["users/uid-7"]).toMatchObject({ tier: "free" });
  });

  it("leaves a gold user's tier alone on a subscription cancellation", async () => {
    store["users/gold-uid-2"] = { tier: "gold", email: "gold2@example.com" };
    store["stripeCustomers/cus_8"] = { uid: "gold-uid-2" };

    await sendEvent({
      type: "customer.subscription.deleted",
      data: { object: { customer: "cus_8", status: "canceled" } },
    });

    expect(store["users/gold-uid-2"]).toMatchObject({ tier: "gold", subscriptionStatus: "canceled" });
  });

  it("ignores a subscription event for a customer we have no mapping for", async () => {
    const res = await sendEvent({
      type: "customer.subscription.updated",
      data: { object: { customer: "cus_unknown", status: "active" } },
    });
    expect(res.statusCode).toBe(200);
  });

  it("acknowledges but ignores event types it doesn't handle", async () => {
    const res = await sendEvent({ type: "invoice.paid", data: { object: {} } });
    expect(res.statusCode).toBe(200);
  });
});
