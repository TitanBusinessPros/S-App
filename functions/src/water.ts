import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";

export const MIN_RADIUS_MILES = 1;
export const MAX_RADIUS_MILES = 100;

/** We only ever return the closest TARGET_COUNT water features — see
 * fetchNearestFeatures for why, and getWaterFeatures's docstring for what
 * this trades away. */
export const TARGET_COUNT = 100;

export type WaterType = "river" | "canal" | "lake" | "ocean" | "spring" | "drainageway";

export interface WaterFeature {
  id: string;
  name: string | null;
  waterType: WaterType;
  lat: number;
  lng: number;
  /** Straight-line distance from the search point, in miles. */
  distanceMiles: number;
  /** The source's own OBJECTID (or id3dhp fallback) for this feature. */
  sourceFeatureId: string;
  /** Which 3DHP FeatureServer layer this came from: 60=Waterbody, 50=Flowline, 20=HydroLocation (springs). */
  sourceLayer: 60 | 50 | 20;
}

export interface GetWaterFeaturesResult {
  /** Up to TARGET_COUNT features, nearest first. */
  features: WaterFeature[];
  /** The radius the caller asked for (also the cache-key basis). */
  radiusMiles: number;
  /** The radius actually searched to find these results — may be smaller
   * than radiusMiles if TARGET_COUNT was already reached in a tighter
   * ring, or capped at radiusMiles if the full requested area was searched. */
  searchedRadiusMiles: number;
  count: number;
  /** How many matching features actually exist within searchedRadiusMiles —
   * count when nothing was cut, larger than count when we truncated to the
   * nearest TARGET_COUNT. */
  totalFound: number;
  /** True only when totalFound === count, i.e. nothing was cut. */
  resultComplete: boolean;
  source: "usgs-3dhp";
  attribution: string;
  sourceRefreshDate: string | null;
  fetchedAt: number;
  fromCache: boolean;
}

export function milesToMeters(miles: number): number {
  return miles * 1609.344;
}

/** Clamps a requested radius into our supported [MIN_RADIUS_MILES, MAX_RADIUS_MILES] range. */
export function clampRadiusMiles(radiusMiles: number): number {
  return Math.min(Math.max(radiusMiles, MIN_RADIUS_MILES), MAX_RADIUS_MILES);
}

const EARTH_RADIUS_MILES = 3958.7613;

/** Great-circle distance between two lat/lng points, in miles. */
export function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

const USGS_BASE = "https://3dhp.nationalmap.gov/arcgis/rest/services/usgs_3dhp_all/FeatureServer";
const USER_AGENT = "SurvivalDayApp/1.0 (+https://github.com/TitanBusinessPros/S-App)";

export const LAYER_WATERBODY = 60 as const;
export const LAYER_FLOWLINE = 50 as const;
export const LAYER_SPRING = 20 as const;
type LayerId = typeof LAYER_WATERBODY | typeof LAYER_FLOWLINE | typeof LAYER_SPRING;

const LAYER_WHERE: Record<LayerId, string | undefined> = {
  // Waterbody: all four documented featuretypes (River/Canal/Lake/Ocean-or-
  // Great-Lake) are legitimate user-visible water bodies — no filter.
  [LAYER_WATERBODY]: undefined,
  // Flowline: keep only Channel Line/Canal/Drainageway (1,2,3). Exclude
  // 4-7 (Surface/Waterbody/Elevation-Breaching/Hydro-Unenforced Connector)
  // — those are network-topology plumbing artifacts, not real features a
  // person would see on the ground.
  [LAYER_FLOWLINE]: "featuretype IN (1,2,3)",
  // HydroLocation: springs only (featuretype 7). Excludes Sink (8, where
  // water disappears underground) and Waterbody Outlet (3, a topological
  // point), neither of which is a visible water source.
  [LAYER_SPRING]: "featuretype = 7",
};

// Waterbody featuretype domain (confirmed live against the service):
// 1=River, 2=Canal, 3=Lake, 4=Ocean or Great Lake. There is no distinct
// "Pond" or "Reservoir" class in this source — small ponds are folded into
// "Lake" (verified live: sub-acre polygons carry featuretype=3). We must
// not call those "ponds" — see waterTypeLabel-equivalent on the client.
const WATERBODY_TYPE: Record<number, WaterType> = { 1: "river", 2: "canal", 3: "lake", 4: "ocean" };

// Flowline featuretype domain: 1=Channel Line (the generic class covering
// rivers/streams/creeks together — this source does not distinguish them),
// 2=Canal, 3=Drainageway (ditches/drains). 4-7 are excluded via LAYER_WHERE
// above and never reach this map.
const FLOWLINE_TYPE: Record<number, WaterType> = { 1: "river", 2: "canal", 3: "drainageway" };

// HydroLocation featuretype domain: only 7 (Spring) is queried (see
// LAYER_WHERE), so this map only ever needs that one entry.
const SPRING_TYPE: Record<number, WaterType> = { 7: "spring" };

function classify(layer: LayerId, featuretype: number): WaterType | null {
  if (layer === LAYER_WATERBODY) return WATERBODY_TYPE[featuretype] ?? null;
  if (layer === LAYER_FLOWLINE) return FLOWLINE_TYPE[featuretype] ?? null;
  return SPRING_TYPE[featuretype] ?? null;
}

interface ArcGisGeometry {
  type: string;
  coordinates: unknown;
}

interface ArcGisFeature {
  type: "Feature";
  geometry: ArcGisGeometry | null;
  properties: Record<string, unknown>;
}

interface ArcGisFeatureCollection {
  type: "FeatureCollection";
  features?: ArcGisFeature[];
  exceededTransferLimit?: boolean;
  properties?: { exceededTransferLimit?: boolean };
}

function flattenCoords(coords: unknown, out: [number, number][]): void {
  if (!Array.isArray(coords)) return;
  if (typeof coords[0] === "number" && typeof coords[1] === "number") {
    out.push([coords[0] as number, coords[1] as number]);
    return;
  }
  for (const c of coords) flattenCoords(c, out);
}

/**
 * Approximates a representative point for any GeoJSON geometry (Point,
 * LineString, Polygon, MultiPolygon, ...) by averaging every vertex. This
 * is a vertex-average, not a true geometric centroid or area/length
 * calculation — it's only used to place a map marker and rank by distance.
 * Real size/length metadata comes from the source's own fields (areasqkm,
 * lengthkm), not from this approximation.
 */
export function representativePoint(geometry: ArcGisGeometry | null | undefined): { lat: number; lng: number } | null {
  if (!geometry) return null;
  const pts: [number, number][] = [];
  flattenCoords(geometry.coordinates, pts);
  if (pts.length === 0) return null;
  let sumLng = 0;
  let sumLat = 0;
  for (const [lng, lat] of pts) {
    sumLng += lng;
    sumLat += lat;
  }
  return { lat: sumLat / pts.length, lng: sumLng / pts.length };
}

function pointGeometryParam(lat: number, lng: number): string {
  return JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } });
}

export function buildQueryUrl(
  layer: LayerId,
  lat: number,
  lng: number,
  radiusMeters: number,
  opts: { resultOffset?: number } = {},
): string {
  const params = new URLSearchParams({
    geometry: pointGeometryParam(lat, lng),
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    distance: String(radiusMeters),
    units: "esriSRUnit_Meter",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "*",
    outSR: "4326",
    f: "geojson",
    resultRecordCount: String(PAGE_SIZE),
    resultOffset: String(opts.resultOffset ?? 0),
  });
  const where = LAYER_WHERE[layer];
  if (where) params.set("where", where);
  return `${USGS_BASE}/${layer}/query?${params.toString()}`;
}

const PAGE_SIZE = 2000;
const REQUEST_TIMEOUT_MS = 30000;

// A defensive per-layer, per-ring cap — not a rejection threshold anymore
// (we never reject; see fetchNearestFeatures). This just stops a single,
// unusually dense ring from paginating indefinitely; by the time any ring
// hits this many candidates we already have far more than TARGET_COUNT to
// rank, so stopping early costs nothing.
const RING_FETCH_CAP = 3000;

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days — hydrography changes rarely.
const SCHEMA_VERSION = 2;
const LOCK_TIMEOUT_MS = 30000;

const DEFAULT_ATTRIBUTION = "Credits: USGS TNM / NGTOC – 3D National Hydrography Program (3DHP.)";

async function fetchJson(url: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) {
      throw new Error(`USGS request failed with status ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

/** Fetches one layer within radiusMeters, paginating until the service
 * reports no more results OR the defensive RING_FETCH_CAP is hit. Returned
 * features have no distanceMiles yet — that's added once we know which
 * point we're ranking from (see fetchNearestFeatures). */
async function fetchLayerWithinRadius(
  layer: LayerId,
  lat: number,
  lng: number,
  radiusMeters: number,
): Promise<Omit<WaterFeature, "distanceMiles">[]> {
  const out: Omit<WaterFeature, "distanceMiles">[] = [];
  let offset = 0;

  for (;;) {
    const json: ArcGisFeatureCollection = await fetchJson(
      buildQueryUrl(layer, lat, lng, radiusMeters, { resultOffset: offset }),
    );
    const batch = json.features ?? [];

    for (const f of batch) {
      const featuretype = Number(f.properties?.featuretype);
      const waterType = classify(layer, featuretype);
      if (!waterType) continue;
      const point = representativePoint(f.geometry);
      if (!point) continue;
      const sourceFeatureId = String(f.properties?.OBJECTID ?? f.properties?.id3dhp ?? "");
      out.push({
        id: `${layer}/${sourceFeatureId}`,
        name: (f.properties?.gnisidlabel as string | null | undefined) ?? null,
        waterType,
        lat: point.lat,
        lng: point.lng,
        sourceFeatureId,
        sourceLayer: layer,
      });
    }

    const exceeded = json.exceededTransferLimit ?? json.properties?.exceededTransferLimit ?? false;
    offset += batch.length;

    if (!exceeded || batch.length === 0 || out.length >= RING_FETCH_CAP) break;
  }

  return out;
}

/**
 * Finds the TARGET_COUNT closest water features to (lat, lng), searching no
 * further than maxRadiusMiles. Rather than fetching everything in the full
 * requested radius (slow, and pointless once we already have far more
 * candidates than we'll ever show), this searches an expanding ring: start
 * small, and only widen if that ring didn't contain enough candidates.
 * Because each ring is a *complete* fetch of that radius (not a sample),
 * the moment a ring yields >= TARGET_COUNT candidates, the nearest
 * TARGET_COUNT among them are provably the true closest — anything closer
 * than that ring's radius would necessarily already be inside it.
 */
async function fetchNearestFeatures(
  lat: number,
  lng: number,
  maxRadiusMiles: number,
): Promise<{ features: WaterFeature[]; totalFound: number; searchedRadiusMiles: number }> {
  let ringMiles = Math.min(5, maxRadiusMiles);
  let combined: Omit<WaterFeature, "distanceMiles">[] = [];

  for (;;) {
    const radiusMeters = milesToMeters(ringMiles);
    const [wb, fl, sp] = await Promise.all([
      fetchLayerWithinRadius(LAYER_WATERBODY, lat, lng, radiusMeters),
      fetchLayerWithinRadius(LAYER_FLOWLINE, lat, lng, radiusMeters),
      fetchLayerWithinRadius(LAYER_SPRING, lat, lng, radiusMeters),
    ]);
    combined = [...wb, ...fl, ...sp];

    if (combined.length >= TARGET_COUNT || ringMiles >= maxRadiusMiles) break;
    ringMiles = Math.min(ringMiles * 3, maxRadiusMiles);
  }

  const withDistance: WaterFeature[] = combined.map((f) => ({
    ...f,
    distanceMiles: haversineMiles(lat, lng, f.lat, f.lng),
  }));
  withDistance.sort((a, b) => a.distanceMiles - b.distanceMiles);

  return {
    features: withDistance.slice(0, TARGET_COUNT),
    totalFound: withDistance.length,
    searchedRadiusMiles: ringMiles,
  };
}

async function fetchServiceMetadata(): Promise<{ attribution: string; sourceRefreshDate: string | null }> {
  try {
    const json = await fetchJson(`${USGS_BASE}?f=json`);
    const copyrightText: string = json.copyrightText ?? DEFAULT_ATTRIBUTION;
    const match = /Data refreshed ([A-Za-z]+ \d{1,2}, \d{4})/.exec(copyrightText);
    return { attribution: copyrightText, sourceRefreshDate: match ? match[1] : null };
  } catch (err) {
    logger.error("getWaterFeatures: could not fetch USGS service metadata", { err });
    return { attribution: DEFAULT_ATTRIBUTION, sourceRefreshDate: null };
  }
}

interface CacheDoc {
  lat: number;
  lng: number;
  radiusMiles: number;
  searchedRadiusMiles: number;
  features: WaterFeature[];
  count: number;
  totalFound: number;
  resultComplete: boolean;
  source: "usgs-3dhp";
  attribution: string;
  sourceRefreshDate: string | null;
  fetchedAt: number;
  expiresAt: number;
  schemaVersion: number;
  fetchLockedAt: number | null;
}

function toResult(doc: CacheDoc, fromCache: boolean): GetWaterFeaturesResult {
  return {
    features: doc.features,
    radiusMiles: doc.radiusMiles,
    searchedRadiusMiles: doc.searchedRadiusMiles,
    count: doc.count,
    totalFound: doc.totalFound,
    resultComplete: doc.resultComplete,
    source: doc.source,
    attribution: doc.attribution,
    sourceRefreshDate: doc.sourceRefreshDate,
    fetchedAt: doc.fetchedAt,
    fromCache,
  };
}

/**
 * Returns the TARGET_COUNT closest water features (rivers/streams, canals,
 * lake-class waterbodies, oceans/Great Lakes, springs, and drainageways) to
 * the given point, within radiusMiles, sourced from the official USGS 3D
 * Hydrography Program (3DHP) FeatureServer. Results are cached in Firestore
 * by rounded grid-cell + radius so repeat searches of the same area don't
 * re-hit USGS.
 *
 * This deliberately trades completeness for speed: earlier versions
 * returned every mapped feature in the radius (rejecting outright if that
 * was too many to fetch/store safely). That could mean paginating through
 * hundreds of thousands of records and rendering thousands of map markers,
 * which is what made the app slow in water-dense areas. Capping to the
 * nearest 100 — the ones actually useful for a person standing at that
 * point — fixes both, and an expanding-radius search (fetchNearestFeatures)
 * means we still don't have to fetch more than we need to find them.
 */
export const getWaterFeatures = onCall({ invoker: "public", timeoutSeconds: 120 }, async (request) => {
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
  const roundedLat = Number(lat.toFixed(2));
  const roundedLng = Number(lng.toFixed(2));
  const cacheKey = `${roundedLat}_${roundedLng}_${clampedRadius}`;

  const db = getFirestore();
  const cacheRef = db.collection("water_area_cache").doc(cacheKey);

  const now = Date.now();

  const cachedSnap = await cacheRef.get();
  if (cachedSnap.exists) {
    const data = cachedSnap.data() as CacheDoc;
    // schemaVersion guards against reading a pre-existing cache entry
    // written by an older version of this function (e.g. the previous
    // "return everything" shape, which lacks searchedRadiusMiles/totalFound
    // and could still hold thousands of features) — treat it as a miss.
    if (data.expiresAt > now && data.schemaVersion === SCHEMA_VERSION) {
      logger.info("getWaterFeatures: cache hit", { cacheKey, count: data.count });
      return toResult(data, true);
    }
  }

  // Best-effort duplicate-fetch guard: skip the write (not the fetch) if
  // another instance already holds a fresh lock on this cache key. The
  // caller still gets a fresh, correct response either way.
  let shouldWrite = true;
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(cacheRef);
      const lockedAt = snap.exists ? (snap.data() as Partial<CacheDoc>).fetchLockedAt : null;
      if (typeof lockedAt === "number" && now - lockedAt < LOCK_TIMEOUT_MS) {
        shouldWrite = false;
        return;
      }
      tx.set(cacheRef, { fetchLockedAt: now }, { merge: true });
    });
  } catch (err) {
    logger.error("getWaterFeatures: lock transaction failed", { err });
  }

  let nearest: { features: WaterFeature[]; totalFound: number; searchedRadiusMiles: number };
  let attribution = DEFAULT_ATTRIBUTION;
  let sourceRefreshDate: string | null = null;
  try {
    const [result, meta] = await Promise.all([
      fetchNearestFeatures(roundedLat, roundedLng, clampedRadius),
      fetchServiceMetadata(),
    ]);
    nearest = result;
    attribution = meta.attribution;
    sourceRefreshDate = meta.sourceRefreshDate;
  } catch (err) {
    logger.error("getWaterFeatures: USGS fetch failed", { err });
    throw new HttpsError("unavailable", "The USGS water-data source returned an error. Try again shortly.");
  }

  const doc: CacheDoc = {
    lat: roundedLat,
    lng: roundedLng,
    radiusMiles: clampedRadius,
    searchedRadiusMiles: nearest.searchedRadiusMiles,
    features: nearest.features,
    count: nearest.features.length,
    totalFound: nearest.totalFound,
    resultComplete: nearest.totalFound === nearest.features.length,
    source: "usgs-3dhp",
    attribution,
    sourceRefreshDate,
    fetchedAt: now,
    expiresAt: now + CACHE_TTL_MS,
    schemaVersion: SCHEMA_VERSION,
    fetchLockedAt: null,
  };

  if (shouldWrite) {
    try {
      await cacheRef.set(doc);
    } catch (err) {
      logger.error("getWaterFeatures: failed to write cache (request still succeeds)", { err });
    }
  }

  logger.info("getWaterFeatures: success", {
    cacheKey,
    count: doc.count,
    totalFound: doc.totalFound,
    searchedRadiusMiles: doc.searchedRadiusMiles,
  });

  return toResult(doc, false);
});
