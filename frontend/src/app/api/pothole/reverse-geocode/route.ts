import { NextResponse } from "next/server";

import type { Language } from "@/constants/translations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const NOMINATIM_USER_AGENT = "JalSarthi-AI/0.1 (reverse-geocoding)";
const PROVIDER_TIMEOUT_MS = 8_000;
const MINIMUM_REQUEST_INTERVAL_MS = 1_000;
const MAX_ADDRESS_LENGTH = 300;
const MAX_REQUEST_BODY_BYTES = 16 * 1024;

type ReverseGeocodeRequest = {
  latitude?: unknown;
  longitude?: unknown;
  language?: unknown;
};

type NominatimResponse = {
  display_name?: unknown;
};

let nextProviderRequestAt = 0;

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "hi";
}

function isValidLatitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= -180 && value <= 180;
}

function isReverseGeocodeRequest(value: unknown): value is ReverseGeocodeRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const body = value as ReverseGeocodeRequest;
  const allowedKeys = new Set(["latitude", "longitude", "language"]);
  return (
    Object.keys(body).length === 3 &&
    Object.keys(body).every((key) => allowedKeys.has(key)) &&
    isValidLatitude(body.latitude) &&
    isValidLongitude(body.longitude) &&
    isLanguage(body.language)
  );
}

function sanitizeAddress(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const address = value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return address && address.length <= MAX_ADDRESS_LENGTH ? address : undefined;
}

async function waitForProviderSlot(): Promise<void> {
  const now = Date.now();
  const scheduledAt = Math.max(now, nextProviderRequestAt);
  nextProviderRequestAt = scheduledAt + MINIMUM_REQUEST_INTERVAL_MS;
  const delay = scheduledAt - now;

  if (delay > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, delay));
  }
}

function noStoreJson(body: object, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_BYTES) {
    return noStoreJson({ error: "REQUEST_TOO_LARGE" }, { status: 413 });
  }

  let body: ReverseGeocodeRequest;
  try {
    const payload: unknown = await request.json();
    if (!isReverseGeocodeRequest(payload)) {
      return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });
    }
    body = payload;
  } catch {
    return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const { latitude, longitude, language } = body;
  if (!isValidLatitude(latitude) || !isValidLongitude(longitude) || !isLanguage(language)) {
    return noStoreJson({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const providerUrl = new URL(NOMINATIM_REVERSE_URL);
  providerUrl.searchParams.set("format", "jsonv2");
  providerUrl.searchParams.set("lat", String(latitude));
  providerUrl.searchParams.set("lon", String(longitude));
  providerUrl.searchParams.set("addressdetails", "0");
  providerUrl.searchParams.set("accept-language", language);

  try {
    await waitForProviderSlot();
    const response = await fetch(providerUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": NOMINATIM_USER_AGENT,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });

    if (response.status === 429) {
      return noStoreJson({ error: "GEOCODER_RATE_LIMIT" }, { status: 503 });
    }
    if (!response.ok) {
      return noStoreJson({ error: "GEOCODER_UNAVAILABLE" }, { status: 503 });
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return noStoreJson({ error: "GEOCODER_INVALID_RESPONSE" }, { status: 502 });
    }

    let providerBody: NominatimResponse;
    try {
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return noStoreJson({ error: "GEOCODER_INVALID_RESPONSE" }, { status: 502 });
      }
      providerBody = payload as NominatimResponse;
    } catch {
      return noStoreJson({ error: "GEOCODER_INVALID_RESPONSE" }, { status: 502 });
    }

    const address = sanitizeAddress(providerBody.display_name);
    if (!address) {
      return noStoreJson({ error: "ADDRESS_NOT_FOUND" }, { status: 404 });
    }

    return noStoreJson({ address });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return noStoreJson({ error: "GEOCODER_TIMEOUT" }, { status: 504 });
    }
    return noStoreJson({ error: "GEOCODER_UNAVAILABLE" }, { status: 503 });
  }
}
