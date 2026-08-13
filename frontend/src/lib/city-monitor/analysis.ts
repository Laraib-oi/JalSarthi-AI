import "server-only";

import { CityIssueAnalyzerError } from "@/lib/city-monitor/gemini-city-issue";
import {
  fetchAndValidateCityImage,
  CityImageRetrievalError,
} from "@/lib/city-monitor/image-retrieval";
import { getCityIssueAnalyzer } from "@/lib/city-monitor/provider";
import { getCityImageryStore } from "@/lib/city-monitor/store";
import {
  ingestConfiguredCity,
  syncCityMonitorStoreStatus,
} from "@/lib/city-monitor/ingestion";
import { forwardToMinistry } from "@/lib/ministry/intake";
import { getMinistryIssueStore } from "@/lib/ministry/store";
import type { MinistryForwardResult } from "@/lib/ministry/intake";
import {
  createDemonstrationDetectionEvent,
  analyzeDemonstrationAsset,
} from "@/lib/city-monitor/simulation";
import { getCityMonitorConfig } from "@/lib/city-monitor/config";
import type {
  CityImageryAsset,
  CityIssueAnalysis,
  CityIssueProcessingStatus,
  CityIssueScreeningStats,
  CityMonitorIssue,
} from "@/lib/city-monitor/types";

export const CITY_ISSUE_ACCEPTANCE_THRESHOLD = 0.8;

export type CityIssueScreeningOptions = {
  cityId: string;
  startDate?: string;
  endDate?: string;
  maxImages?: number;
};

export class CityIssueScreeningError extends Error {
  constructor(public readonly code: "INVALID_LIMIT" | "INGESTION_FAILED") {
    super("City issue screening could not be completed.");
    this.name = "CityIssueScreeningError";
  }
}

function isAcceptedIssue(asset: CityImageryAsset, analysis: CityIssueAnalysis): boolean {
  const hasSourceTimestamp =
    asset.provider === "demonstration"
      ? Boolean(asset.discoveredAt)
      : Boolean(asset.capturedAt ?? asset.addedAt);
  return (
    analysis.detected &&
    analysis.category !== "NO_ISSUE" &&
    analysis.category !== "UNCERTAIN" &&
    analysis.confidence >= CITY_ISSUE_ACCEPTANCE_THRESHOLD &&
    Boolean(asset.providerPhotoId) &&
    hasSourceTimestamp &&
    Number.isFinite(asset.latitude) &&
    Number.isFinite(asset.longitude)
  );
}

function nonIssueStatus(analysis: CityIssueAnalysis): CityIssueProcessingStatus {
  if (analysis.category === "NO_ISSUE") return "no_issue";
  if (analysis.category === "UNCERTAIN") return "uncertain";
  return "rejected";
}

export async function screenCityImageryAsset(
  asset: CityImageryAsset
): Promise<
  | "accepted_issue"
  | "no_issue"
  | "uncertain"
  | "rejected"
  | "analysis_failed"
  | "duplicate"
> {
  const store = getCityImageryStore();
  if (store.getProcessing(asset.providerPhotoId, asset.provider)) return "duplicate";

  let analysis: CityIssueAnalysis;
  let imageValidation: CityMonitorIssue["imageValidation"];
  const analyzedAt = new Date().toISOString();
  try {
    if (asset.provider === "demonstration") {
      analysis = analyzeDemonstrationAsset(asset);
    } else {
      const image = await fetchAndValidateCityImage(asset);
      imageValidation = {
        status: "PASSED",
        mimeType: image.mimeType,
        width: image.width,
        height: image.height,
        validatedAt: analyzedAt,
      };
      analysis = await getCityIssueAnalyzer().analyze(image);
    }
  } catch (error) {
    if (error instanceof CityImageRetrievalError) {
      store.saveProcessing({
        provider: asset.provider,
        providerPhotoId: asset.providerPhotoId,
        status: "rejected",
        analyzedAt: null,
      });
      return "rejected";
    }
    store.saveProcessing({
      provider: asset.provider,
      providerPhotoId: asset.providerPhotoId,
      status: "analysis_failed",
      analyzedAt,
    });
    if (error instanceof CityIssueAnalyzerError) return "analysis_failed";
    return "analysis_failed";
  }

  if (!isAcceptedIssue(asset, analysis)) {
    const status = nonIssueStatus(analysis);
    store.saveProcessing({
      provider: asset.provider,
      providerPhotoId: asset.providerPhotoId,
      status,
      analyzedAt,
    });
    return status;
  }

  const issue: CityMonitorIssue = {
    issueId: `${asset.provider === "demonstration" ? "demo" : "kartaview"}:${asset.providerPhotoId}`,
    provider: asset.provider,
    sourceImageId: asset.providerPhotoId,
    sourceImageUrl: asset.imageUrl,
    providerSequenceId: asset.providerSequenceId,
    capturedAt: asset.capturedAt,
    addedAt: asset.addedAt,
    discoveredAt: asset.discoveredAt,
    analyzedAt,
    latitude: asset.latitude,
    longitude: asset.longitude,
    analysis,
    ...(imageValidation ? { imageValidation } : {}),
    ...(asset.simulation ? { simulation: asset.simulation } : {}),
  };
  store.saveIssue(issue);
  store.saveProcessing({
    provider: asset.provider,
    providerPhotoId: asset.providerPhotoId,
    status: "accepted_issue",
    analyzedAt,
  });
  forwardToMinistry(issue.issueId);
  return "accepted_issue";
}

export async function runDemonstrationDetection(cityId: string): Promise<{
  event: ReturnType<typeof createDemonstrationDetectionEvent>;
  result: "accepted_issue" | "duplicate";
  issue: CityMonitorIssue;
  ministry: ReturnType<typeof forwardToMinistry>;
}> {
  const city = getCityMonitorConfig(cityId);
  if (!city) throw new CityIssueScreeningError("INGESTION_FAILED");

  const event = createDemonstrationDetectionEvent(city);
  const store = getCityImageryStore();
  const existingAsset = store.get(event.asset.providerPhotoId, "demonstration");
  const asset = existingAsset ?? event.asset;
  if (!existingAsset) store.save(asset);
  const stableEvent = existingAsset?.simulation
    ? { ...event, scenario: existingAsset.simulation, asset: existingAsset }
    : event;

  const existingIssue = store.getIssue(asset.providerPhotoId, asset.provider);
  const existingMinistry = getMinistryIssueStore().getBySource(
    "DEMONSTRATION_SIMULATION",
    asset.providerPhotoId
  );
  if (!existingIssue) await screenCityImageryAsset(asset);
  const issue = store.getIssue(asset.providerPhotoId, asset.provider);
  if (!issue) throw new CityIssueScreeningError("INGESTION_FAILED");

  const currentMinistry = getMinistryIssueStore().getBySource(
    "DEMONSTRATION_SIMULATION",
    asset.providerPhotoId
  );
  let ministry: MinistryForwardResult;
  if (existingMinistry) {
    ministry = { success: true, duplicate: true, issue: existingMinistry };
  } else if (currentMinistry) {
    ministry = { success: true, duplicate: false, issue: currentMinistry };
  } else {
    ministry = forwardToMinistry(issue.issueId);
  }
  syncCityMonitorStoreStatus();
  return {
    event: stableEvent,
    result: existingIssue ? "duplicate" : "accepted_issue",
    issue,
    ministry,
  };
}

export async function analyzeConfiguredCity(options: CityIssueScreeningOptions): Promise<{
  ingestion: Awaited<ReturnType<typeof ingestConfiguredCity>>;
  screening: CityIssueScreeningStats;
}> {
  if (
    options.maxImages !== undefined &&
    (!Number.isInteger(options.maxImages) ||
      options.maxImages < 1 ||
      options.maxImages > 20)
  ) {
    throw new CityIssueScreeningError("INVALID_LIMIT");
  }

  let ingestion;
  try {
    ingestion = await ingestConfiguredCity(options.cityId, {
      startDate: options.startDate,
      endDate: options.endDate,
    });
  } catch {
    throw new CityIssueScreeningError("INGESTION_FAILED");
  }

  const checkedAt = new Date().toISOString();
  const candidates = getCityImageryStore().listUnprocessed(options.maxImages ?? 20);
  const screening: CityIssueScreeningStats = {
    checkedAt,
    candidates: candidates.length,
    analyzed: 0,
    acceptedIssues: 0,
    rejected: 0,
    noIssue: 0,
    uncertain: 0,
    duplicates: 0,
    imageFailures: 0,
    aiFailures: 0,
  };

  for (const asset of candidates) {
    const result = await screenCityImageryAsset(asset);
    if (result === "duplicate") {
      screening.duplicates += 1;
    } else if (result === "accepted_issue") {
      screening.analyzed += 1;
      screening.acceptedIssues += 1;
    } else if (result === "no_issue") {
      screening.analyzed += 1;
      screening.noIssue += 1;
    } else if (result === "uncertain") {
      screening.analyzed += 1;
      screening.uncertain += 1;
    } else if (result === "analysis_failed") {
      screening.rejected += 1;
      screening.aiFailures += 1;
    } else {
      screening.rejected += 1;
      screening.imageFailures += 1;
    }
  }

  syncCityMonitorStoreStatus();
  return { ingestion, screening };
}
