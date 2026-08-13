import "server-only";

export type CityMonitorProvider = "kartaview" | "demonstration";

export type CitySimulationMetadata = {
  scenarioId: string;
  label: string;
  generatedAt: string;
};

export type CityMonitorCityConfig = {
  id: string;
  name: string;
  country: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radiusMeters: number;
  enabled: boolean;
};

export type CityImageryAsset = {
  provider: CityMonitorProvider;
  providerPhotoId: string;
  providerSequenceId: string | null;
  sequenceIndex: number | null;
  imageUrl: string;
  latitude: number;
  longitude: number;
  heading: number | null;
  capturedAt: string | null;
  addedAt: string | null;
  processedAt: string | null;
  discoveredAt: string;
  visibility: string | null;
  status: string | null;
  qualityLevel: number | null;
  processingStatus: string | null;
  simulation?: CitySimulationMetadata;
};

export type CityImageryIngestionStats = {
  cityId: string;
  provider: CityMonitorProvider;
  checkedAt: string;
  discovered: number;
  newImages: number;
  alreadyKnown: number;
  rejected: number;
  uniqueSequences: number;
  latestCapturedAt: string | null;
  latestAddedAt: string | null;
};

export type CityIssueCategory =
  | "WATER_FILLED_POTHOLE"
  | "WATER_LEAKAGE"
  | "DRAINAGE_ISSUE"
  | "WATERLOGGING"
  | "DAMAGED_WATER_INFRASTRUCTURE"
  | "OTHER_WATER_RELATED_ISSUE"
  | "NO_ISSUE"
  | "UNCERTAIN";

export type CityIssueAnalysis = {
  detected: boolean;
  category: CityIssueCategory;
  confidence: number;
  description: string;
  evidence: string[];
};

export type CityIssueProcessingStatus =
  "accepted_issue" | "no_issue" | "uncertain" | "rejected" | "analysis_failed";

export type CityIssueProcessingRecord = {
  provider?: CityMonitorProvider;
  providerPhotoId: string;
  status: CityIssueProcessingStatus;
  analyzedAt: string | null;
};

export type CityMonitorIssue = {
  issueId: string;
  provider: CityMonitorProvider;
  sourceImageId: string;
  sourceImageUrl: string;
  providerSequenceId: string | null;
  capturedAt: string | null;
  addedAt: string | null;
  discoveredAt: string;
  analyzedAt: string;
  latitude: number;
  longitude: number;
  analysis: CityIssueAnalysis;
  simulation?: CitySimulationMetadata;
};

export type CityIssueScreeningStats = {
  checkedAt: string;
  candidates: number;
  analyzed: number;
  acceptedIssues: number;
  rejected: number;
  noIssue: number;
  uncertain: number;
  duplicates: number;
  imageFailures: number;
  aiFailures: number;
};

export type CityMonitorStatus = {
  lastCheckedAt: string | null;
  lastSuccessfulCheckAt: string | null;
  lastErrorAt: string | null;
  totalKnownImages: number;
  latestCapturedAt: string | null;
  latestAddedAt: string | null;
  totalAnalyzedImages: number;
  totalAcceptedIssues: number;
  totalRejectedImages: number;
};
