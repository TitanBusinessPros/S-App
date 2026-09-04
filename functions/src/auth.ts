import * as logger from "firebase-functions/logger";
import * as functionsV1 from "firebase-functions/v1";
import { getFirestore } from "firebase-admin/firestore";
import { ADMIN_EMAIL, TRIAL_DURATION_MS } from "./constants";

/**
 * Runs once, server-side, the first time a user signs in (Google-only auth
 * creates their Firebase Auth user record, which fires this trigger).
 * Creates their Firestore profile and decides their starting tier:
 *
 *   - The admin's own email always gets permanent "gold" access.
 *   - An email an admin already pre-granted gold to (see grantGoldMembership
 *     in billing.ts, which queues a pendingGoldGrants doc for anyone who
 *     doesn't have an account yet) gets gold immediately, no trial needed.
 *   - Everyone else gets a 30-day free trial of every feature, tracked via
 *     trialEndsAt. Nothing server-side "expires" it — the client computes
 *     locked-out state itself by comparing against that timestamp (see
 *     web/src/lib/entitlement.ts).
 *
 * Deliberately NOT client-writable (see firestore.rules) — tier upgrades
 * must go through a trusted Cloud Function, never a direct client write, or
 * users could grant themselves premium/gold for free.
 */
export const createUserProfile = functionsV1.auth.user().onCreate(async (user) => {
  const db = getFirestore();
  const email = user.email ?? null;
  const now = Date.now();

  let tier: "gold" | "trial" = "trial";
  let trialEndsAt: number | null = now + TRIAL_DURATION_MS;

  if (email && email.toLowerCase() === ADMIN_EMAIL) {
    tier = "gold";
    trialEndsAt = null;
  } else if (email) {
    const pendingRef = db.collection("pendingGoldGrants").doc(email.toLowerCase());
    const pendingSnap = await pendingRef.get();
    if (pendingSnap.exists) {
      tier = "gold";
      trialEndsAt = null;
      await pendingRef.delete();
    }
  }

  await db.collection("users").doc(user.uid).set({
    email,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    tier,
    trialEndsAt,
    createdAt: now,
  });
  logger.info("createUserProfile: profile created", { uid: user.uid, tier });
});
