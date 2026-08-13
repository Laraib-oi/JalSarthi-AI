import "server-only";

import type { CityIssueCategory } from "@/lib/city-monitor/types";

export type MinistryIssueSource = "KARTAVIEW_CITY_MONITOR" | "DEMONSTRATION_SIMULATION";
export type MinistryIssueStatus = "NEW" | "ACKNOWLEDGED" | "RESOLVED";
export type MinistryIssuePriority = "HIGH" | "MEDIUM" | "LOW";

export type MinistryIssueRecord = {
  ministryIssueId: string;
  source: MinistryIssueSource;
  sourceImageId: string;
  sourceImageUrl: string;
  category: CityIssueCategory;
  confidence: number;
  description: string;
  evidence: string[];
  latitude: number;
  longitude: number;
  capturedAt: string | null;
  discoveredAt: string;
  analyzedAt: string;
  receivedAt: string;
  status: MinistryIssueStatus;
  priority: MinistryIssuePriority;
  city: "Lucknow";
  state: "Uttar Pradesh";
  simulation?: {
    scenarioId: string;
    label: string;
    generatedAt: string;
  };
};

export type MinistryIssueSummary = {
  totalIssues: number;
  newIssues: number;
  acknowledgedIssues: number;
  resolvedIssues: number;
  byCategory: Record<CityIssueCategory, number>;
  byPriority: Record<MinistryIssuePriority, number>;
};
