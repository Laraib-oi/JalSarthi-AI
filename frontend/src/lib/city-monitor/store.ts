import "server-only";

import type {
  CityImageryAsset,
  CityIssueProcessingRecord,
  CityMonitorIssue,
  CityMonitorProvider,
} from "@/lib/city-monitor/types";

function storeKey(provider: CityMonitorProvider, providerPhotoId: string): string {
  return `${provider}:${providerPhotoId}`;
}

export interface CityImageryStore {
  has(providerPhotoId: string, provider?: CityMonitorProvider): boolean;
  get(providerPhotoId: string, provider?: CityMonitorProvider): CityImageryAsset | undefined;
  save(asset: CityImageryAsset): void;
  count(): number;
  listRecent(limit?: number): CityImageryAsset[];
  getProcessing(providerPhotoId: string, provider?: CityMonitorProvider): CityIssueProcessingRecord | undefined;
  saveProcessing(record: CityIssueProcessingRecord): void;
  saveIssue(issue: CityMonitorIssue): void;
  getIssue(issueIdOrPhotoId: string, provider?: CityMonitorProvider): CityMonitorIssue | undefined;
  countIssues(): number;
  countAnalyzed(): number;
  countRejected(): number;
  listUnprocessed(limit?: number): CityImageryAsset[];
}

/**
 * Temporary server-side persistence for the city monitor. It is deliberately
 * behind an interface so a later SQLite store can replace it. State resets
 * when the server process restarts; it is not presented as durable storage.
 */
class InMemoryCityImageryStore implements CityImageryStore {
  private readonly assets = new Map<string, CityImageryAsset>();
  private readonly processing = new Map<string, CityIssueProcessingRecord>();
  private readonly issues = new Map<string, CityMonitorIssue>();

  has(providerPhotoId: string, provider?: CityMonitorProvider): boolean {
    return provider
      ? this.assets.has(storeKey(provider, providerPhotoId))
      : [...this.assets.values()].some((asset) => asset.providerPhotoId === providerPhotoId);
  }

  get(providerPhotoId: string, provider?: CityMonitorProvider): CityImageryAsset | undefined {
    if (provider) return this.assets.get(storeKey(provider, providerPhotoId));
    return [...this.assets.values()].find((asset) => asset.providerPhotoId === providerPhotoId);
  }

  save(asset: CityImageryAsset): void {
    this.assets.set(storeKey(asset.provider, asset.providerPhotoId), asset);
  }

  count(): number {
    return this.assets.size;
  }

  listRecent(limit = 100): CityImageryAsset[] {
    return [...this.assets.values()]
      .sort((left, right) => right.discoveredAt.localeCompare(left.discoveredAt))
      .slice(0, Math.max(0, limit));
  }

  getProcessing(providerPhotoId: string, provider?: CityMonitorProvider): CityIssueProcessingRecord | undefined {
    if (provider) return this.processing.get(storeKey(provider, providerPhotoId));
    return [...this.processing.values()].find((record) => record.providerPhotoId === providerPhotoId);
  }

  saveProcessing(record: CityIssueProcessingRecord): void {
    this.processing.set(storeKey(record.provider ?? "kartaview", record.providerPhotoId), record);
  }

  saveIssue(issue: CityMonitorIssue): void {
    this.issues.set(storeKey(issue.provider, issue.sourceImageId), issue);
  }

  getIssue(issueIdOrPhotoId: string, provider?: CityMonitorProvider): CityMonitorIssue | undefined {
    if (provider) {
      return this.issues.get(storeKey(provider, issueIdOrPhotoId))
        ?? [...this.issues.values()].find((issue) => issue.provider === provider && issue.issueId === issueIdOrPhotoId);
    }
    return [...this.issues.values()].find((issue) => issue.issueId === issueIdOrPhotoId || issue.sourceImageId === issueIdOrPhotoId);
  }

  countIssues(): number {
    return this.issues.size;
  }

  countAnalyzed(): number {
    return [...this.processing.values()].filter((record) => record.status !== "analysis_failed").length;
  }

  countRejected(): number {
    return [...this.processing.values()].filter((record) => record.status === "rejected" || record.status === "analysis_failed").length;
  }

  listUnprocessed(limit = 20): CityImageryAsset[] {
    return this.listRecent(1000)
      .filter((asset) => !this.processing.has(storeKey(asset.provider, asset.providerPhotoId)))
      .slice(0, Math.max(0, limit));
  }
}

const cityImageryStore: CityImageryStore = new InMemoryCityImageryStore();

export function getCityImageryStore(): CityImageryStore {
  return cityImageryStore;
}
