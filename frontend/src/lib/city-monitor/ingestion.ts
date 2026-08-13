import "server-only";

import { getCityMonitorConfig } from "@/lib/city-monitor/config";
import { fetchKartaViewPhotos, isAllowedKartaViewImageUrl, KartaViewClientError, type KartaViewPhoto } from "@/lib/city-monitor/kartaview";
import { getCityImageryStore } from "@/lib/city-monitor/store";
import type {
  CityImageryAsset,
  CityImageryIngestionStats,
  CityMonitorCityConfig,
  CityMonitorStatus,
} from "@/lib/city-monitor/types";

const DEFAULT_DISCOVERY_WINDOW_DAYS = 30;

export type CityImageryDiscoveryOptions = {
  startDate?: string;
  endDate?: string;
};

export class CityMonitorIngestionError extends Error {
  constructor(
    public readonly code: "INVALID_CITY" | "INVALID_WINDOW" | "PROVIDER_UNAVAILABLE" | "PROVIDER_INVALID_RESPONSE"
  ) {
    super("City imagery ingestion could not be completed.");
    this.name = "CityMonitorIngestionError";
  }
}

let monitorStatus: CityMonitorStatus = {
  lastCheckedAt: null,
  lastSuccessfulCheckAt: null,
  lastErrorAt: null,
  totalKnownImages: 0,
  latestCapturedAt: null,
  latestAddedAt: null,
  totalAnalyzedImages: 0,
  totalAcceptedIssues: 0,
  totalRejectedImages: 0,
};

function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function dateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function resolveWindow(options: CityImageryDiscoveryOptions): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = options.endDate ?? dateOnly(now);
  const startDate = options.startDate ?? dateOnly(new Date(now.getTime() - DEFAULT_DISCOVERY_WINDOW_DAYS * 24 * 60 * 60 * 1_000));
  if (!isDateOnly(startDate) || !isDateOnly(endDate) || startDate > endDate) {
    throw new CityMonitorIngestionError("INVALID_WINDOW");
  }
  return { startDate, endDate };
}

function finiteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function optionalString(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function optionalNumber(value: unknown): number | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  return finiteNumber(value);
}

function parseTimestamp(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !value.trim()) return undefined;
  const source = value.trim();
  const normalizedSource = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/.test(source)
    ? `${source.replace(" ", "T")}Z`
    : source;
  const parsed = new Date(normalizedSource);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed.toISOString();
}

function providerId(value: unknown): string | undefined {
  const numeric = finiteNumber(value);
  if (numeric !== undefined && Number.isInteger(numeric) && numeric >= 0) return String(numeric);
  const text = optionalString(value);
  return text ?? undefined;
}

function isRecord(value: unknown): value is KartaViewPhoto {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function normalizeKartaViewPhoto(photo: KartaViewPhoto, discoveredAt: string): CityImageryAsset | undefined {
  const photoId = providerId(photo.id ?? photo.photoId);
  const latitude = finiteNumber(photo.lat ?? photo.latitude);
  const longitude = finiteNumber(photo.lng ?? photo.lon ?? photo.longitude);
  const urlValue = photo.imageProcUrl ?? photo.fileurlProc ?? photo.fileurl ?? photo.fileUrl;
  const url = isAllowedKartaViewImageUrl(urlValue) ? new URL(urlValue).toString() : undefined;
  if (!photoId || latitude === undefined || latitude < -90 || latitude > 90 || longitude === undefined || longitude < -180 || longitude > 180 || !url) {
    return undefined;
  }

  const sequenceIdValue = providerId(photo.sequenceId);
  const sequenceIndex = optionalNumber(photo.sequenceIndex);
  const heading = optionalNumber(photo.heading);
  const qualityLevel = optionalNumber(photo.qualityLevel);
  const capturedAt = parseTimestamp(photo.shotDate ?? photo.capturedAt);
  const addedAt = parseTimestamp(photo.dateAdded ?? photo.addedAt);
  const processedAt = parseTimestamp(photo.dateProcessed ?? photo.processedAt);
  if (sequenceIndex === undefined || heading === undefined || qualityLevel === undefined || capturedAt === undefined || addedAt === undefined || processedAt === undefined) {
    return undefined;
  }

  const visibility = optionalString(photo.visibility);
  const status = optionalString(photo.status);
  const processingStatus = optionalString(photo.autoImgProcessingStatus ?? photo.processingStatus);
  if (visibility === undefined || status === undefined || processingStatus === undefined) return undefined;

  return {
    provider: "kartaview",
    providerPhotoId: photoId,
    providerSequenceId: sequenceIdValue ?? null,
    sequenceIndex: sequenceIndex ?? null,
    imageUrl: url,
    latitude,
    longitude,
    heading: heading ?? null,
    capturedAt,
    addedAt,
    processedAt,
    discoveredAt,
    visibility,
    status,
    qualityLevel: qualityLevel ?? null,
    processingStatus,
  };
}

function latestTimestamp(assets: readonly CityImageryAsset[], key: "capturedAt" | "addedAt"): string | null {
  return assets.reduce<string | null>((latest, asset) => {
    const value = asset[key];
    return value && (!latest || value > latest) ? value : latest;
  }, null);
}

export async function discoverCityImagery(
  cityConfig: CityMonitorCityConfig,
  options: CityImageryDiscoveryOptions = {}
): Promise<CityImageryIngestionStats> {
  if (!cityConfig.enabled) throw new CityMonitorIngestionError("INVALID_CITY");
  const { startDate, endDate } = resolveWindow(options);
  const checkedAt = new Date().toISOString();
  monitorStatus = { ...monitorStatus, lastCheckedAt: checkedAt };

  let photos: unknown[];
  try {
    photos = await fetchKartaViewPhotos({
      latitude: cityConfig.center.latitude,
      longitude: cityConfig.center.longitude,
      radiusMeters: cityConfig.radiusMeters,
      startDate,
      endDate,
    });
  } catch (error) {
    monitorStatus = { ...monitorStatus, lastErrorAt: checkedAt };
    if (error instanceof KartaViewClientError && error.code === "INVALID_RESPONSE") {
      throw new CityMonitorIngestionError("PROVIDER_INVALID_RESPONSE");
    }
    throw new CityMonitorIngestionError("PROVIDER_UNAVAILABLE");
  }

  const store = getCityImageryStore();
  const normalized = new Map<string, CityImageryAsset>();
  let rejected = 0;
  for (const photo of photos) {
    if (!isRecord(photo)) {
      rejected += 1;
      continue;
    }
    const asset = normalizeKartaViewPhoto(photo, checkedAt);
    if (!asset) {
      rejected += 1;
      continue;
    }
    normalized.set(asset.providerPhotoId, asset);
  }

  let newImages = 0;
  let alreadyKnown = 0;
  for (const asset of normalized.values()) {
    if (store.has(asset.providerPhotoId, asset.provider)) {
      alreadyKnown += 1;
      continue;
    }
    store.save(asset);
    newImages += 1;
  }

  const assets = [...normalized.values()];
  const stats: CityImageryIngestionStats = {
    cityId: cityConfig.id,
    provider: "kartaview",
    checkedAt,
    discovered: assets.length,
    newImages,
    alreadyKnown,
    rejected,
    uniqueSequences: new Set(assets.map((asset) => asset.providerSequenceId).filter((id): id is string => Boolean(id))).size,
    latestCapturedAt: latestTimestamp(assets, "capturedAt"),
    latestAddedAt: latestTimestamp(assets, "addedAt"),
  };

  const latestKnownCapturedAt = [monitorStatus.latestCapturedAt, stats.latestCapturedAt]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;
  const latestKnownAddedAt = [monitorStatus.latestAddedAt, stats.latestAddedAt]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;
  monitorStatus = {
    lastCheckedAt: checkedAt,
    lastSuccessfulCheckAt: checkedAt,
    lastErrorAt: null,
    totalKnownImages: store.count(),
    latestCapturedAt: latestKnownCapturedAt,
    latestAddedAt: latestKnownAddedAt,
    totalAnalyzedImages: store.countAnalyzed(),
    totalAcceptedIssues: store.countIssues(),
    totalRejectedImages: store.countRejected(),
  };
  return stats;
}

export async function ingestConfiguredCity(
  cityId: string,
  options: CityImageryDiscoveryOptions = {}
): Promise<CityImageryIngestionStats> {
  const cityConfig = getCityMonitorConfig(cityId);
  if (!cityConfig) throw new CityMonitorIngestionError("INVALID_CITY");
  return discoverCityImagery(cityConfig, options);
}

export function getCityMonitorStatus(): CityMonitorStatus {
  return { ...monitorStatus, totalKnownImages: getCityImageryStore().count() };
}

export function syncCityMonitorStoreStatus(): void {
  const store = getCityImageryStore();
  monitorStatus = {
    ...monitorStatus,
    totalKnownImages: store.count(),
    totalAnalyzedImages: store.countAnalyzed(),
    totalAcceptedIssues: store.countIssues(),
    totalRejectedImages: store.countRejected(),
  };
}
