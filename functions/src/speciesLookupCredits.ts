import { consumeDailyCredit, type ConsumeCreditResult } from "./dailyCredits";

/** How many species/wildlife lookups a signed-in user gets before the credit window resets. */
export const DAILY_SPECIES_LOOKUP_LIMIT = 3;

/** The credit window: a rolling 24 hours from the first lookup that opened
 * the current window — not a fixed midnight reset. Mirrors
 * WATER_SCAN_WINDOW_MS (see waterScanCredits.ts). */
export const SPECIES_LOOKUP_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ConsumeSpeciesLookupCreditResult = ConsumeCreditResult;

/**
 * Atomically checks and consumes one species-lookup credit for `uid`,
 * gating every call to getSpeciesNearby — the actual enforcement point, so
 * it can't be bypassed by a client that skips its own bookkeeping. Mirrors
 * consumeWaterScanCredit (see waterScanCredits.ts) via the same shared
 * dailyCredits.ts transaction, scoped to its own speciesLookupCredits/{uid}
 * collection so the two limits never share credits.
 *
 * Throws a `resource-exhausted` HttpsError (with `details.resetAt`, the
 * epoch ms the next credit becomes available) once DAILY_SPECIES_LOOKUP_LIMIT
 * is used up within the current window.
 */
export async function consumeSpeciesLookupCredit(uid: string): Promise<ConsumeSpeciesLookupCreditResult> {
  return consumeDailyCredit(
    "speciesLookupCredits",
    uid,
    DAILY_SPECIES_LOOKUP_LIMIT,
    SPECIES_LOOKUP_WINDOW_MS,
    "You've used all 3 species lookups for today. They reset 24 hours after your first lookup.",
  );
}
