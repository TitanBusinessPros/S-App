import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Nominatim (OpenStreetMap Foundation) usage policy requires an identifying
// User-Agent and reasonable request volume — browsers can't reliably set a
// custom User-Agent from client-side fetch(), so this runs server-side,
// same pattern as the Overpass/USGS calls elsewhere in this app.
const USER_AGENT = "SurvivalDayApp/1.0 (+https://github.com/TitanBusinessPros/S-App)";
const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/reverse";
const REQUEST_TIMEOUT_MS = 10000;

export interface GetLocationNameResult {
  /** The nearest town/city, e.g. "Norman, Oklahoma" — null if none could be resolved. */
  locality: string | null;
  attribution: string;
}

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  county?: string;
  state?: string;
}

async function fetchJson(url: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`Nominatim request failed with status ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Resolves the nearest town/city name for a GPS point via Nominatim
 * (OpenStreetMap) reverse geocoding, so the Weather page can show "Weather
 * for Norman, Oklahoma" instead of just raw coordinates. A lookup failure
 * is deliberately non-fatal — it returns `locality: null` rather than
 * throwing, so the weather forecast itself still loads with a generic
 * fallback title.
 */
export const getLocationName = onCall({ invoker: "public", timeoutSeconds: 30 }, async (request) => {
  const { lat, lng } = (request.data ?? {}) as { lat?: number; lng?: number };

  if (typeof lat !== "number" || typeof lng !== "number") {
    throw new HttpsError("invalid-argument", "lat and lng are required numbers.");
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new HttpsError("invalid-argument", "lat/lng out of range.");
  }

  const url = new URL(NOMINATIM_ENDPOINT);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");

  let json: { address?: NominatimAddress };
  try {
    json = await fetchJson(url.toString());
  } catch (err) {
    logger.error("getLocationName: reverse geocode failed", { err });
    return { locality: null, attribution: "" };
  }

  const addr = json.address ?? {};
  const place = addr.city ?? addr.town ?? addr.village ?? addr.hamlet ?? addr.county ?? null;
  const locality = place ? (addr.state ? `${place}, ${addr.state}` : place) : null;

  logger.info("getLocationName: success", { resolved: locality !== null });

  return { locality, attribution: "© OpenStreetMap contributors" };
});
