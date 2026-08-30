import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const MIN_RADIUS_MILES = 1;
export const MAX_RADIUS_MILES = 100;

export type WaterType = "river" | "stream" | "canal" | "pond" | "lake" | "reservoir" | "water";

export interface WaterFeature {
  id: string;
  name: string | null;
  waterType: WaterType;
  lat: number;
  lng: number;
}

export function milesToMeters(miles: number): number {
  return miles * 1609.344;
}

/** Builds an Overpass QL query for water features within radiusMeters of (lat, lng). */
export function buildOverpassQuery(lat: number, lng: number, radiusMeters: number): string {
  const around = `around:${radiusMeters},${lat},${lng}`;
  return `
[out:json][timeout:25];
(
  way["natural"="water"](${around});
  way["waterway"~"^(river|stream|canal)$"](${around});
  way["water"~"^(pond|lake|reservoir)$"](${around});
  node["natural"="spring"](${around});
);
out center 500;
`.trim();
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

function classifyWaterType(tags: Record<string, string>): WaterType | null {
  if (tags.waterway === "river") return "river";
  if (tags.waterway === "stream") return "stream";
  if (tags.waterway === "canal") return "canal";
  if (tags.water === "pond") return "pond";
  if (tags.water === "lake") return "lake";
  if (tags.water === "reservoir") return "reservoir";
  if (tags.natural === "spring") return "water";
  if (tags.natural === "water") return "water";
  return null;
}

/** Converts a raw Overpass response into our simplified WaterFeature shape. */
export function parseOverpassResponse(response: OverpassResponse): WaterFeature[] {
  const features: WaterFeature[] = [];

  for (const el of response.elements ?? []) {
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat == null || lng == null) continue;

    const tags = el.tags ?? {};
    const waterType = classifyWaterType(tags);
    if (!waterType) continue;

    features.push({
      id: `${el.type}/${el.id}`,
      name: tags.name ?? null,
      waterType,
      lat,
      lng,
    });
  }

  return features;
}

/** Clamps a requested radius into our supported [MIN_RADIUS_MILES, MAX_RADIUS_MILES] range. */
export function clampRadiusMiles(radiusMiles: number): number {
  return Math.min(Math.max(radiusMiles, MIN_RADIUS_MILES), MAX_RADIUS_MILES);
}

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

/**
 * Returns nearby water features (rivers, streams, canals, ponds, lakes,
 * reservoirs, springs) within radiusMiles of the given point, sourced live
 * from OpenStreetMap via the Overpass API. Capped at 500 results and a
 * 100-mile radius to keep Overpass queries fast and within its usage policy.
 */
export const getWaterFeatures = onCall({ invoker: "public" }, async (request) => {
  const { lat, lng, radiusMiles } = (request.data ?? {}) as {
    lat?: number;
    lng?: number;
    radiusMiles?: number;
  };

  if (typeof lat !== "number" || typeof lng !== "number" || typeof radiusMiles !== "number") {
    throw new HttpsError("invalid-argument", "lat, lng, and radiusMiles are required numbers.");
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new HttpsError("invalid-argument", "lat/lng out of range.");
  }

  const clampedRadius = clampRadiusMiles(radiusMiles);
  const query = buildOverpassQuery(lat, lng, milesToMeters(clampedRadius));

  let response: Response;
  try {
    response = await fetch(OVERPASS_ENDPOINT, {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  } catch (err) {
    logger.error("getWaterFeatures: Overpass request failed", { err });
    throw new HttpsError("unavailable", "Could not reach the water-data source. Try again shortly.");
  }

  if (!response.ok) {
    logger.error("getWaterFeatures: Overpass returned non-OK", { status: response.status });
    throw new HttpsError("unavailable", "The water-data source returned an error. Try again shortly.");
  }

  const json = (await response.json()) as OverpassResponse;
  const features = parseOverpassResponse(json);

  logger.info("getWaterFeatures: success", { count: features.length, radiusMiles: clampedRadius });

  return { features, radiusMiles: clampedRadius, truncated: features.length >= 500 };
});
