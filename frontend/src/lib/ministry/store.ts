import "server-only";

import type { MinistryIssueRecord, MinistryIssueSummary } from "@/lib/ministry/types";
import type { CityIssueCategory } from "@/lib/city-monitor/types";

export interface MinistryIssueStore {
  create(record: Omit<MinistryIssueRecord, "ministryIssueId">): MinistryIssueRecord;
  get(ministryIssueId: string): MinistryIssueRecord | undefined;
  getBySource(source: MinistryIssueRecord["source"], sourceImageId: string): MinistryIssueRecord | undefined;
  updateStatus(ministryIssueId: string, status: MinistryIssueRecord["status"]): MinistryIssueRecord | undefined;
  list(): MinistryIssueRecord[];
  summary(): MinistryIssueSummary;
}

const CATEGORIES: readonly CityIssueCategory[] = [
  "WATER_FILLED_POTHOLE",
  "WATER_LEAKAGE",
  "DRAINAGE_ISSUE",
  "WATERLOGGING",
  "DAMAGED_WATER_INFRASTRUCTURE",
  "OTHER_WATER_RELATED_ISSUE",
  "NO_ISSUE",
  "UNCERTAIN",
];

class InMemoryMinistryIssueStore implements MinistryIssueStore {
  private readonly issues = new Map<string, MinistryIssueRecord>();
  private nextReference = 1;

  create(record: Omit<MinistryIssueRecord, "ministryIssueId">): MinistryIssueRecord {
    let ministryIssueId: string;
    do {
      ministryIssueId = `JSM-LKO-${String(this.nextReference).padStart(6, "0")}`;
      this.nextReference += 1;
    } while (this.issues.has(ministryIssueId));

    const issue: MinistryIssueRecord = { ministryIssueId, ...record };
    this.issues.set(ministryIssueId, issue);
    return issue;
  }

  get(ministryIssueId: string): MinistryIssueRecord | undefined {
    return this.issues.get(ministryIssueId);
  }

  getBySource(source: MinistryIssueRecord["source"], sourceImageId: string): MinistryIssueRecord | undefined {
    return [...this.issues.values()].find((issue) => issue.source === source && issue.sourceImageId === sourceImageId);
  }

  updateStatus(ministryIssueId: string, status: MinistryIssueRecord["status"]): MinistryIssueRecord | undefined {
    const issue = this.issues.get(ministryIssueId);
    if (!issue) return undefined;
    const updated = { ...issue, status };
    this.issues.set(ministryIssueId, updated);
    return updated;
  }

  list(): MinistryIssueRecord[] {
    return [...this.issues.values()].sort((left, right) => right.receivedAt.localeCompare(left.receivedAt));
  }

  summary(): MinistryIssueSummary {
    const issues = this.list();
    const byCategory = Object.fromEntries(CATEGORIES.map((category) => [category, 0])) as Record<CityIssueCategory, number>;
    const byPriority = { HIGH: 0, MEDIUM: 0, LOW: 0 } as MinistryIssueSummary["byPriority"];
    for (const issue of issues) {
      byCategory[issue.category] += 1;
      byPriority[issue.priority] += 1;
    }
    return {
      totalIssues: issues.length,
      newIssues: issues.filter((issue) => issue.status === "NEW").length,
      acknowledgedIssues: issues.filter((issue) => issue.status === "ACKNOWLEDGED").length,
      resolvedIssues: issues.filter((issue) => issue.status === "RESOLVED").length,
      byCategory,
      byPriority,
    };
  }
}

const ministryIssueStore: MinistryIssueStore = new InMemoryMinistryIssueStore();

export function getMinistryIssueStore(): MinistryIssueStore {
  return ministryIssueStore;
}
