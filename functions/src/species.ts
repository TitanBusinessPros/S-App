import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { SPECIES_DATA, type SpeciesEntry } from "./speciesData";
import { clampRadiusMiles } from "./water";
import { requirePaidAccess } from "./entitlement";
import { consumeSpeciesLookupCredit } from "./speciesLookupCredits";

export function isActiveInMonth(entry: SpeciesEntry, month: number): boolean {
  return entry.activeMonths.includes(month);
}

export function milesToKm(miles: number): number {
  return miles * 1.609344;
}

const GBIF_OCCURRENCE_ENDPOINT = "https://api.gbif.org/v1/occurrence/search";

interface GbifSearchResult {
  count: number;
}

/**
 * Confirms whether GBIF (the Global Biodiversity Information Facility) has
 * at least one real recorded occurrence of scientificName within radiusKm
 * of (lat, lng). This is what keeps species results honest — a species
 * only shows up if there's an actual observation nearby, not just because
 * it's plausible for the region.
 */
export async function hasNearbyOccurrence(
  scientificName: string,
  lat: number,
  lng: number,
  radiusKm: number,
): Promise<boolean> {
  const url = new URL(GBIF_OCCURRENCE_ENDPOINT);
  url.searchParams.set("scientificName", scientificName);
  url.searchParams.set("geoDistance", `${lat},${lng},${radiusKm}km`);
  url.searchParams.set("hasCoordinate", "true");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`GBIF request failed with status ${response.status}`);
  }
  const json = (await response.json()) as GbifSearchResult;
  return json.count > 0;
}

/**
 * Returns curated species entries that are (a) in season for the given
 * month and (b) confirmed present nearby via at least one real GBIF
 * occurrence record within the radius. A species with no GBIF confirmation
 * is left out rather than guessed at. If a single species' GBIF lookup
 * fails (network hiccup), that species is excluded from this response
 * rather than failing the whole request.
 *
 * Requires an active trial/premium/gold tier (see entitlement.ts) — a
 * locked account gets permission-denied here even if it calls this function
 * directly, bypassing the client's PaidFeatureRoute gate.
 *
 * Also rate-limited to DAILY_SPECIES_LOOKUP_LIMIT calls per signed-in user
 * per rolling 24h window (see speciesLookupCredits.ts) — mirrors
 * getWaterFeatures' water-scan limit, on its own separate credit pool.
 */
export const getSpeciesNearby = onCall({ invoker: "public" }, async (request) => {
  const { lat, lng, radiusMiles, month } = (request.data ?? {}) as {
    lat?: number;
    lng?: number;
    radiusMiles?: number;
    month?: number;
  };

  if (
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    typeof radiusMiles !== "number" ||
    typeof month !== "number"
  ) {
    throw new HttpsError("invalid-argument", "lat, lng, radiusMiles, and month are required numbers.");
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new HttpsError("invalid-argument", "lat/lng out of range.");
  }
  if (month < 1 || month > 12) {
    throw new HttpsError("invalid-argument", "month must be between 1 and 12.");
  }

  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Sign in to see nearby species.");
  }
  await requirePaidAccess(uid);
  const { creditsRemaining } = await consumeSpeciesLookupCredit(uid);

  const clampedRadius = clampRadiusMiles(radiusMiles);
  const radiusKm = milesToKm(clampedRadius);

  const inSeason = SPECIES_DATA.filter((entry) => isActiveInMonth(entry, month));

  const confirmedFlags = await Promise.all(
    inSeason.map(async (entry) => {
      try {
        return await hasNearbyOccurrence(entry.scientificName, lat, lng, radiusKm);
      } catch (err) {
        logger.error("getSpeciesNearby: GBIF lookup failed", { species: entry.scientificName, err });
        return false;
      }
    }),
  );

  // Every in-season curated entry is always included — GBIF confirmation
  // is a per-entry trust label, not a category-wide filter. Hiding an
  // entire category's other entries just because one happened to get a
  // GBIF hit nearby (e.g. showing only one of five in-season dangerous
  // animals) understated the curated reference for no real reason; each
  // entry is honestly labeled "confirmed: false" (regionally documented,
  // not confirmed nearby) rather than implying a sighting that was never
  // verified — but it's still shown.
  const species = inSeason.map((entry, i) => ({ ...entry, confirmed: confirmedFlags[i] }));

  logger.info("getSpeciesNearby: success", {
    month,
    radiusMiles: clampedRadius,
    confirmed: species.filter((s) => s.confirmed).length,
    fallback: species.filter((s) => !s.confirmed).length,
    checked: inSeason.length,
  });

  return { species, radiusMiles: clampedRadius, month, creditsRemaining };
});
