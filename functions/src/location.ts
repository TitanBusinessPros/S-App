import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// U.S. Census Bureau Geocoder -- replaces the old Nominatim (OpenStreetMap
// Foundation) reverse-geocoding call. Verified directly before switching:
// no commercial-use restriction in the Census API Terms of Service
// (https://www.census.gov/data/developers/about/terms-of-service.html),
// unlike OSM's own tile-usage policy, which is why the map basemap moved
// to OpenFreeMap separately. Covers the US, Puerto Rico, and US Island
// Areas only -- fine for this app's audience. A descriptive User-Agent
// isn't required by Census the way it is for Nominatim, but costs nothing
// to keep sending.
const USER_AGENT = "SurvivalDayApp/1.0 (+https://github.com/TitanBusinessPros/S-App)";
const CENSUS_GEOCODER_ENDPOINT = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates";
const REQUEST_TIMEOUT_MS = 10000;

export interface GetLocationNameResult {
  /** The nearest town/city, e.g. "Norman, Oklahoma" — null if none could be resolved. */
  locality: string | null;
  attribution: string;
}

interface CensusGeography {
  BASENAME?: string;
  NAME?: string;
}

interface CensusGeographiesResponse {
  result?: {
    geographies?: {
      "Incorporated Places"?: CensusGeography[];
      "County Subdivisions"?: CensusGeography[];
      Counties?: CensusGeography[];
      States?: CensusGeography[];
    };
  };
}

async function fetchJson(url: string): Promise<CensusGeographiesResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`Census geocoder request failed with status ${res.status}`);
    return (await res.json()) as CensusGeographiesResponse;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Resolves the nearest place name for a GPS point via the U.S. Census
 * Bureau's Geocoder, so Plants, Wildlife & Wood can show "near Norman,
 * Oklahoma" instead of raw coordinates. A lookup failure is deliberately
 * non-fatal — it returns `locality: null` rather than throwing, so the
 * species list itself still loads with a generic fallback title.
 *
 * Falls back from the most specific geography Census returns down to the
 * broadest: an incorporated place (city/town) first, then a county
 * subdivision (covers unincorporated areas), then the county itself.
 */
export const getLocationName = onCall({ invoker: "public", timeoutSeconds: 30 }, async (request) => {
  const { lat, lng } = (request.data ?? {}) as { lat?: number; lng?: number };

  if (typeof lat !== "number" || typeof lng !== "number") {
    throw new HttpsError("invalid-argument", "lat and lng are required numbers.");
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new HttpsError("invalid-argument", "lat/lng out of range.");
  }

  const url = new URL(CENSUS_GEOCODER_ENDPOINT);
  url.searchParams.set("x", String(lng));
  url.searchParams.set("y", String(lat));
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("vintage", "Current_Current");
  url.searchParams.set("format", "json");

  let json: CensusGeographiesResponse;
  try {
    json = await fetchJson(url.toString());
  } catch (err) {
    logger.error("getLocationName: reverse geocode failed", { err });
    return { locality: null, attribution: "" };
  }

  const geographies = json.result?.geographies ?? {};
  const place =
    geographies["Incorporated Places"]?.[0]?.BASENAME ??
    geographies["County Subdivisions"]?.[0]?.BASENAME ??
    geographies.Counties?.[0]?.NAME ??
    null;
  const state = geographies.States?.[0]?.NAME ?? null;
  const locality = place ? (state ? `${place}, ${state}` : place) : null;

  logger.info("getLocationName: success", { resolved: locality !== null });

  return { locality, attribution: "Source: U.S. Census Bureau" };
});
