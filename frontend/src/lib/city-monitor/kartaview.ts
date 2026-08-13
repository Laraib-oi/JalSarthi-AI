import "server-only";

const KARTAVIEW_PHOTO_URL = "https://api.openstreetcam.org/2.0/photo/";
const KARTAVIEW_TIMEOUT_MS = 10_000;
const KARTAVIEW_COOLDOWN_MS = 1_000;

export type KartaViewQuery = {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  startDate: string;
  endDate: string;
};

export type KartaViewPhoto = Record<string, unknown>;

export class KartaViewClientError extends Error {
  constructor(
    public readonly code: "UNAVAILABLE" | "INVALID_RESPONSE" | "TIMEOUT"
  ) {
    super("KartaView could not provide a valid response.");
    this.name = "KartaViewClientError";
  }
}

export function isAllowedKartaViewImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  const host = parsed.hostname.toLowerCase();
  const allowedHost =
    host === "kartaview.org" ||
    host.endsWith(".kartaview.org") ||
    host === "openstreetcam.org" ||
    host.endsWith(".openstreetcam.org");
  return parsed.protocol === "https:" && allowedHost && !parsed.username && !parsed.password && Boolean(parsed.pathname);
}

let providerQueue: Promise<void> = Promise.resolve();
let nextProviderRequestAt = 0;

async function withProviderSlot<T>(task: () => Promise<T>): Promise<T> {
  const previous = providerQueue;
  let release!: () => void;
  providerQueue = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;
  try {
    const now = Date.now();
    const scheduledAt = Math.max(now, nextProviderRequestAt);
    nextProviderRequestAt = scheduledAt + KARTAVIEW_COOLDOWN_MS;
    const delay = scheduledAt - now;
    if (delay > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, delay));
    }
    return await task();
  } finally {
    release();
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isPhotoListResponse(value: unknown): value is { result?: { data: unknown[] } | null; status?: unknown } {
  if (!isRecord(value)) return false;
  if (value.result === undefined) {
    return isRecord(value.status) && value.status.apiCode === 601;
  }
  if (value.result === null) return true;
  return isRecord(value.result) && Array.isArray(value.result.data);
}

export function buildKartaViewPhotoUrl(query: KartaViewQuery): URL {
  const url = new URL(KARTAVIEW_PHOTO_URL);
  url.searchParams.set("lat", String(query.latitude));
  url.searchParams.set("lng", String(query.longitude));
  url.searchParams.set("radius", String(query.radiusMeters));
  url.searchParams.set("startDate", query.startDate);
  url.searchParams.set("endDate", query.endDate);
  url.searchParams.set("orderBy", "shotDate");
  url.searchParams.set("orderDirection", "desc");
  return url;
}

export async function fetchKartaViewPhotos(query: KartaViewQuery): Promise<unknown[]> {
  return withProviderSlot(async () => {
    let response: Response;
    try {
      response = await fetch(buildKartaViewPhotoUrl(query), {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(KARTAVIEW_TIMEOUT_MS),
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "TimeoutError") {
        throw new KartaViewClientError("TIMEOUT");
      }
      throw new KartaViewClientError("UNAVAILABLE");
    }

    if (!response.ok) throw new KartaViewClientError("UNAVAILABLE");

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new KartaViewClientError("INVALID_RESPONSE");
    }

    if (!isPhotoListResponse(payload)) throw new KartaViewClientError("INVALID_RESPONSE");
    return payload.result?.data ?? [];
  });
}
