import { HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

type Tier = "trial" | "free" | "premium" | "gold";

interface UserDoc {
  tier?: Tier;
  trialEndsAt?: number | null;
}

/**
 * Server-side mirror of web/src/lib/entitlement.ts's computeEntitlement --
 * true for gold/premium, or a trial that hasn't hit trialEndsAt yet. Kept
 * deliberately in lockstep with the client version; if one changes, change
 * both.
 */
export function hasAccess(profile: UserDoc | undefined, now: number = Date.now()): boolean {
  if (!profile) return false;
  if (profile.tier === "gold" || profile.tier === "premium") return true;
  if (profile.tier === "trial" && typeof profile.trialEndsAt === "number") {
    return profile.trialEndsAt > now;
  }
  return false;
}

/**
 * The actual enforcement point for every paid feature backed by a Cloud
 * Function (currently getWaterFeatures, getSpeciesNearby) -- the client-side
 * PaidFeatureRoute component only decides what the app *renders*; nothing
 * stops someone from calling the callable directly, bypassing the UI
 * entirely. This is what makes that not work: it re-reads the caller's own
 * Firestore profile (never trusts anything the client claims about its own
 * tier) and throws permission-denied if they don't currently have access.
 *
 * Compass and First Aid deliberately don't call this -- they stay free
 * after the trial (see PaidFeatureRoute.tsx / Dashboard.tsx) and neither
 * has a paid-feature Cloud Function to begin with.
 */
export async function requirePaidAccess(uid: string): Promise<void> {
  const db = getFirestore();
  const snap = await db.collection("users").doc(uid).get();
  const profile = snap.exists ? (snap.data() as UserDoc) : undefined;

  if (!hasAccess(profile)) {
    throw new HttpsError(
      "permission-denied",
      "Your free trial has ended. Subscribe to keep using this feature.",
    );
  }
}
