import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import Stripe from "stripe";
import { ADMIN_EMAIL, TRIAL_DURATION_MS } from "./constants";

// Signed into the Stripe dashboard once the webhook endpoint is added there
// (Developers -> Webhooks -> Add endpoint -> copy the "Signing secret").
// Set with: firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");

type Tier = "trial" | "free" | "premium" | "gold";

function isPaidEventActive(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}

/**
 * Admin-only: grants permanent "gold" tier (full access, never billed) to
 * an email address. If that email already has an account, the upgrade
 * applies immediately. If not, it's queued in pendingGoldGrants and applied
 * the moment they sign in for the first time (see createUserProfile).
 */
export const grantGoldMembership = onCall({ invoker: "public" }, async (request) => {
  const callerEmail = request.auth?.token.email;
  if (!request.auth || callerEmail?.toLowerCase() !== ADMIN_EMAIL) {
    throw new HttpsError("permission-denied", "Only the app admin can grant gold membership.");
  }

  const email = (request.data as { email?: string })?.email?.trim().toLowerCase();
  if (!email) {
    throw new HttpsError("invalid-argument", "An email address is required.");
  }

  const db = getFirestore();

  try {
    const userRecord = await getAuth().getUserByEmail(email);
    await db.collection("users").doc(userRecord.uid).set(
      { tier: "gold" as Tier, trialEndsAt: null, goldGrantedAt: Date.now(), goldGrantedBy: callerEmail },
      { merge: true },
    );
    logger.info("grantGoldMembership: applied immediately", { email, uid: userRecord.uid });
    return { granted: true, pending: false };
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code !== "auth/user-not-found") {
      logger.error("grantGoldMembership: lookup failed", { email, err });
      throw new HttpsError("internal", "Could not look up that email.");
    }
    await db.collection("pendingGoldGrants").doc(email).set({
      grantedAt: Date.now(),
      grantedBy: callerEmail,
    });
    logger.info("grantGoldMembership: queued for first sign-in", { email });
    return { granted: false, pending: true };
  }
});

/**
 * Admin-only, one-time migration: every account created before this
 * paywall shipped has tier "free" with no trialEndsAt (that field didn't
 * exist yet). This gives each of them the same fresh 3-day trial a new
 * signup gets, starting from the moment it's run. Safe to run more than
 * once — accounts already migrated (or gold/premium) are left alone.
 */
export const backfillTrialTiers = onCall({ invoker: "public" }, async (request) => {
  const callerEmail = request.auth?.token.email;
  if (!request.auth || callerEmail?.toLowerCase() !== ADMIN_EMAIL) {
    throw new HttpsError("permission-denied", "Only the app admin can run this migration.");
  }

  const db = getFirestore();
  const snap = await db.collection("users").where("tier", "==", "free").get();
  const now = Date.now();
  const batch = db.batch();

  snap.forEach((doc) => {
    const email = (doc.data().email as string | null) ?? null;
    const isAdmin = email?.toLowerCase() === ADMIN_EMAIL;
    batch.set(
      doc.ref,
      isAdmin
        ? { tier: "gold" as Tier, trialEndsAt: null }
        : { tier: "trial" as Tier, trialEndsAt: now + TRIAL_DURATION_MS },
      { merge: true },
    );
  });

  if (snap.size > 0) await batch.commit();
  logger.info("backfillTrialTiers: migrated existing accounts", { updated: snap.size });
  return { updated: snap.size };
});

/**
 * Stripe webhook target. Verifies the request actually came from Stripe
 * (via the signing secret), then keeps Firestore's tier in sync with the
 * subscription. Deliberately never needs a Stripe *secret* API key —
 * signature verification is a local check, and we look up "which of our
 * users does this Stripe customer belong to" from our own stripeCustomers
 * mapping (written at checkout time) rather than calling Stripe's API.
 *
 * A "gold" tier (admin-granted, unrelated to billing) is never touched
 * here, even if that same person also happens to have a Stripe
 * subscription — gold always wins.
 */
export const stripeWebhook = onRequest(
  { invoker: "public", secrets: [STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (typeof signature !== "string") {
      res.status(400).send("Missing Stripe-Signature header");
      return;
    }

    const stripe = new Stripe("sk_not_used_webhook_verification_only");
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, signature, STRIPE_WEBHOOK_SECRET.value());
    } catch (err) {
      logger.warn("stripeWebhook: signature verification failed", { message: (err as Error).message });
      res.status(400).send("Invalid signature");
      return;
    }

    const db = getFirestore();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        if (!customerId) {
          logger.warn("stripeWebhook: checkout session had no customer id", { sessionId: session.id });
          break;
        }

        let uid = session.client_reference_id ?? null;
        const email = session.customer_details?.email ?? null;

        if (!uid && email) {
          const matches = await db.collection("users").where("email", "==", email).limit(1).get();
          uid = matches.empty ? null : matches.docs[0].id;
        }

        if (!uid) {
          logger.error("stripeWebhook: could not match checkout session to a user", {
            sessionId: session.id,
            email,
          });
          await db.collection("stripeOrphanPayments").doc(session.id).set({
            customerId,
            email,
            subscriptionId: typeof session.subscription === "string" ? session.subscription : null,
            receivedAt: Date.now(),
          });
          break;
        }

        await db.collection("stripeCustomers").doc(customerId).set({ uid });

        const userRef = db.collection("users").doc(uid);
        const userSnap = await userRef.get();
        const currentTier = (userSnap.data()?.tier as Tier | undefined) ?? "trial";

        await userRef.set(
          {
            stripeCustomerId: customerId,
            stripeSubscriptionId:
              typeof session.subscription === "string" ? session.subscription : null,
            subscriptionStatus: "active",
            ...(currentTier !== "gold" ? { tier: "premium" as Tier, trialEndsAt: null } : {}),
          },
          { merge: true },
        );
        logger.info("stripeWebhook: checkout completed", { uid, customerId });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

        const mapping = await db.collection("stripeCustomers").doc(customerId).get();
        if (!mapping.exists) {
          logger.warn("stripeWebhook: subscription event for unknown customer", { customerId });
          break;
        }
        const uid = mapping.data()?.uid as string;
        const userRef = db.collection("users").doc(uid);
        const userSnap = await userRef.get();
        const currentTier = (userSnap.data()?.tier as Tier | undefined) ?? "trial";

        if (currentTier === "gold") {
          // Gold is a standing admin grant, independent of billing — leave it alone.
          await userRef.set({ subscriptionStatus: subscription.status }, { merge: true });
          break;
        }

        const active = event.type === "customer.subscription.updated" && isPaidEventActive(subscription.status);
        await userRef.set(
          {
            subscriptionStatus: subscription.status,
            tier: (active ? "premium" : "free") as Tier,
          },
          { merge: true },
        );
        logger.info("stripeWebhook: subscription status updated", { uid, status: subscription.status });
        break;
      }

      default:
        logger.info("stripeWebhook: ignoring unhandled event type", { type: event.type });
    }

    res.status(200).send("ok");
  },
);
