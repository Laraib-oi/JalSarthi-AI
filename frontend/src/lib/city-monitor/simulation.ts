import "server-only";

import type {
  CityImageryAsset,
  CityIssueAnalysis,
  CityIssueCategory,
  CityMonitorCityConfig,
  CitySimulationMetadata,
} from "@/lib/city-monitor/types";
import { getCityImageryStore } from "@/lib/city-monitor/store";
import { forwardToMinistry } from "@/lib/ministry/intake";
import { getMinistryIssueStore } from "@/lib/ministry/store";
import type { MinistryIssueStatus } from "@/lib/ministry/types";
import { getDemonstrationTimestamps } from "@/lib/city-monitor/demo-timestamps";

/**
 * A deterministic, server-created observation for demonstrations and judging.
 * It is deliberately not a KartaView photo and has no external image URL.
 */
export const DEMONSTRATION_SCENARIO_ID = "lucknow-water-filled-pothole-001";
export const DEMONSTRATION_SCENARIO_LABEL = "Simulated water-filled pothole detection";
export const DEMONSTRATION_DATASET_ID = "lucknow-monitor-dataset";
export const DEMONSTRATION_DATASET_SIZE = 120;
export const DEMONSTRATION_DATASET_TIMESTAMP = "2026-01-15T09:00:00.000Z";

const LOCALITIES = [
  ["Gomti Nagar", 26.8567, 81.0078],
  ["Gomti Nagar Extension", 26.8318, 81.0012],
  ["Hazratganj", 26.8509, 80.9496],
  ["Aliganj", 26.8884, 80.9463],
  ["Indira Nagar", 26.8786, 81.0012],
  ["Mahanagar", 26.8822, 80.9462],
  ["Alambagh", 26.8126, 80.9167],
  ["Charbagh", 26.8315, 80.9214],
  ["Chowk", 26.8682, 80.9113],
  ["Rajajipuram", 26.8387, 80.8716],
  ["Jankipuram", 26.9247, 80.9452],
  ["Vikas Nagar", 26.8991, 80.9799],
  ["Ashiyana", 26.7877, 80.8975],
  ["Krishna Nagar", 26.7957, 80.9168],
  ["Chinhat", 26.8726, 81.0539],
  ["Sushant Golf City", 26.7593, 81.0005],
  ["Kaiserbagh", 26.8598, 80.9378],
  ["Aminabad", 26.8467, 80.9286],
  ["Nishatganj", 26.8792, 80.9538],
  ["Daliganj", 26.8788, 80.9254],
] as const;

const CATEGORY_COUNTS: readonly [Exclude<CityIssueCategory, "NO_ISSUE" | "UNCERTAIN">, number][] = [
  ["WATER_FILLED_POTHOLE", 42],
  ["WATER_LEAKAGE", 23],
  ["DRAINAGE_ISSUE", 18],
  ["WATERLOGGING", 17],
  ["DAMAGED_WATER_INFRASTRUCTURE", 12],
  ["OTHER_WATER_RELATED_ISSUE", 8],
];

const STATUS_SEQUENCE: readonly MinistryIssueStatus[] = ["NEW", "ACKNOWLEDGED", "RESOLVED", "NEW", "ACKNOWLEDGED"];

export type DemonstrationDetectionEvent = {
  eventId: string;
  cityId: string;
  source: "DEMONSTRATION_SIMULATION";
  scenario: CitySimulationMetadata;
  asset: CityImageryAsset;
};

export type DemonstrationDatasetResult = {
  total: number;
  loaded: number;
  duplicate: number;
  byCategory: Record<string, number>;
};

type DemonstrationGlobalState = typeof globalThis & {
  __jalsarthiDemonstrationDatasetLoad?: Promise<DemonstrationDatasetResult>;
};

function categoryForIndex(index: number): Exclude<CityIssueCategory, "NO_ISSUE" | "UNCERTAIN"> {
  let cursor = 0;
  for (const [category, count] of CATEGORY_COUNTS) {
    cursor += count;
    if (index < cursor) return category;
  }
  return CATEGORY_COUNTS[CATEGORY_COUNTS.length - 1]![0];
}

function statusForIndex(index: number): MinistryIssueStatus {
  return STATUS_SEQUENCE[index % STATUS_SEQUENCE.length]!;
}

function confidenceForIndex(index: number): number {
  return Number((0.8 + ((index * 17) % 20) / 100).toFixed(2));
}

function createDatasetAsset(city: CityMonitorCityConfig, index: number): CityImageryAsset {
  const [area, latitude, longitude] = LOCALITIES[index % LOCALITIES.length]!;
  const category = categoryForIndex(index);
  const scenarioId = `lucknow-monitor-${String(index + 1).padStart(3, "0")}`;
  const confidence = confidenceForIndex(index);
  const { discoveredAt } = getDemonstrationTimestamps(scenarioId);
  const generatedAt = DEMONSTRATION_DATASET_TIMESTAMP;
  const address = `${area}, Lucknow, Uttar Pradesh`;
  const scenario: CitySimulationMetadata = {
    scenarioId,
    label: "Controlled demonstration monitoring data",
    generatedAt,
    category,
    confidence,
    area,
    address,
  };
  return {
    provider: "demonstration",
    providerPhotoId: scenarioId,
    providerSequenceId: null,
    sequenceIndex: index,
    imageUrl: `simulation://jalsarthi/${city.id}/${scenarioId}`,
    latitude: Number((latitude + (((index % 5) - 2) * 0.0002)).toFixed(6)),
    longitude: Number((longitude + (((index % 7) - 3) * 0.0002)).toFixed(6)),
    heading: null,
    capturedAt: null,
    addedAt: null,
    processedAt: null,
    discoveredAt,
    visibility: "simulation",
    status: "generated",
    qualityLevel: null,
    processingStatus: "simulation_ready",
    simulation: scenario,
  };
}

export function createDemonstrationDetectionEvent(
  city: CityMonitorCityConfig
): DemonstrationDetectionEvent {
  const generatedAt = new Date().toISOString();
  const scenario: CitySimulationMetadata = {
    scenarioId: DEMONSTRATION_SCENARIO_ID,
    label: DEMONSTRATION_SCENARIO_LABEL,
    generatedAt,
  };

  // The coordinates are intentionally close to the configured city center and
  // are marked as simulated metadata; they do not assert a real observation.
  const asset: CityImageryAsset = {
    provider: "demonstration",
    providerPhotoId: DEMONSTRATION_SCENARIO_ID,
    providerSequenceId: null,
    sequenceIndex: null,
    imageUrl: `simulation://jalsarthi/${city.id}/${DEMONSTRATION_SCENARIO_ID}`,
    latitude: Number((city.center.latitude + 0.0007).toFixed(6)),
    longitude: Number((city.center.longitude + 0.0005).toFixed(6)),
    heading: null,
    capturedAt: null,
    addedAt: null,
    processedAt: null,
    discoveredAt: generatedAt,
    visibility: "simulation",
    status: "generated",
    qualityLevel: null,
    processingStatus: "simulation_ready",
    simulation: scenario,
  };

  return {
    eventId: `demo-event:${DEMONSTRATION_SCENARIO_ID}`,
    cityId: city.id,
    source: "DEMONSTRATION_SIMULATION",
    scenario,
    asset,
  };
}

export function analyzeDemonstrationAsset(asset: CityImageryAsset): CityIssueAnalysis {
  if (asset.provider !== "demonstration" || !asset.simulation) {
    throw new Error("A demonstration analysis requires a demonstration asset.");
  }

  const category = asset.simulation.category ?? "WATER_FILLED_POTHOLE";
  return {
    detected: true,
    category,
    confidence: asset.simulation.confidence ?? 0.96,
    description: `Controlled demonstration observation: ${category.replaceAll("_", " ").toLowerCase()} flagged for Ministry review.`,
    evidence: [
      "The structured result is generated by the server-owned demonstration dataset.",
      `Locality context: ${asset.simulation.area ?? "Lucknow"}.`,
      "This record is synthetic and is not a KartaView observation.",
    ],
  };
}

export async function loadDemonstrationDataset(city: CityMonitorCityConfig): Promise<DemonstrationDatasetResult> {
  const imageryStore = getCityImageryStore();
  const ministryStore = getMinistryIssueStore();
  const byCategory: Record<string, number> = {};
  let loaded = 0;
  let duplicate = 0;

  for (let index = 0; index < DEMONSTRATION_DATASET_SIZE; index += 1) {
    const asset = createDatasetAsset(city, index);
    const category = asset.simulation?.category ?? "WATER_FILLED_POTHOLE";
    byCategory[category] = (byCategory[category] ?? 0) + 1;
    const existing = ministryStore.getBySource("DEMONSTRATION_SIMULATION", asset.providerPhotoId);
    if (existing) {
      duplicate += 1;
      continue;
    }
    if (!imageryStore.get(asset.providerPhotoId, "demonstration")) {
      imageryStore.save(asset);
    }
    const processing = imageryStore.getProcessing(asset.providerPhotoId, "demonstration");
    let issue = imageryStore.getIssue(asset.providerPhotoId, "demonstration");
    if (!processing || !issue) {
      const analysis = analyzeDemonstrationAsset(asset);
      const { analyzedAt } = getDemonstrationTimestamps(asset.providerPhotoId);
      issue = {
        issueId: `demo:${asset.providerPhotoId}`,
        provider: "demonstration",
        sourceImageId: asset.providerPhotoId,
        sourceImageUrl: asset.imageUrl,
        providerSequenceId: null,
        capturedAt: null,
        addedAt: null,
        discoveredAt: asset.discoveredAt,
        analyzedAt,
        latitude: asset.latitude,
        longitude: asset.longitude,
        area: asset.simulation?.area,
        address: asset.simulation?.address,
        analysis,
        simulation: asset.simulation,
      };
      imageryStore.saveIssue(issue);
      imageryStore.saveProcessing({ provider: "demonstration", providerPhotoId: asset.providerPhotoId, status: "accepted_issue", analyzedAt });
    }
    const forwarded = forwardToMinistry(issue.issueId);
    ministryStore.updateStatus(forwarded.issue.ministryIssueId, statusForIndex(index));
    loaded += 1;
  }
  return { total: DEMONSTRATION_DATASET_SIZE, loaded, duplicate, byCategory };
}

/** Hydrate the deterministic demo through the same intake/store path on demand. */
export function ensureDemonstrationDatasetLoaded(
  city: CityMonitorCityConfig
): Promise<DemonstrationDatasetResult> {
  const globalState = globalThis as DemonstrationGlobalState;
  globalState.__jalsarthiDemonstrationDatasetLoad ??= loadDemonstrationDataset(city);
  return globalState.__jalsarthiDemonstrationDatasetLoad;
}
