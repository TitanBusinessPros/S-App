import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functionsV1 from "firebase-functions/v1";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

/**
 * Simple health-check callable function. Proves out the deploy pipeline
 * and the CI test-coverage enforcement (see testing/functions/).
 * Replace/extend as real functions are added.
 */
export const healthCheck = onCall((request) => {
  logger.info("healthCheck invoked", { auth: !!request.auth });
  return {
    status: "ok",
    timestamp: Date.now(),
  };
});

/**
 * Runs once, server-side, the first time a user signs in (Google-only auth
 * creates their Firebase Auth user record, which fires this trigger).
 * Creates their Firestore profile with a default "free" tier.
 *
 * Deliberately NOT client-writable (see firestore.rules) — tier upgrades
 * must go through a trusted Cloud Function once Stripe billing lands, never
 * a direct client write, or users could grant themselves premium for free.
 */
export const createUserProfile = functionsV1.auth.user().onCreate(async (user) => {
  const db = getFirestore();
  await db.collection("users").doc(user.uid).set({
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    tier: "free",
    createdAt: Date.now(),
  });
  logger.info("createUserProfile: profile created", { uid: user.uid });
});
