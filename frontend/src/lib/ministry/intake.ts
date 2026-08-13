import "server-only";

import { getCityImageryStore } from "@/lib/city-monitor/store";
import type { CityIssueCategory, CityMonitorIssue } from "@/lib/city-monitor/types";
import { getMinistryIssueStore } from "@/lib/ministry/store";
import type { MinistryIssuePriority, MinistryIssueRecord } from "@/lib/ministry/types";

export const MINISTRY_INTAKE_NAME = "Demonstration Ministry Intake";
export const MINISTRY_SOURCE = "KARTAVIEW_CITY_MONITOR" as const;

export class MinistryIntakeError extends Error {
  constructor(
    public readonly code: "INVALID_ISSUE_ID" | "ISSUE_NOT_FOUND" | "ISSUE_NOT_ACCEPTED"
  ) {
    super("The city issue could not be accepted by the demonstration Ministry intake.");
    this.name = "MinistryIntakeError";
  }
}

function priorityForIssue(
  category: CityIssueCategory,
  confidence: number
): MinistryIssuePriority {
  if ((category === "WATER_LEAKAGE" || category === "WATERLOGGING") && confidence >= 0.9)
    return "HIGH";
  if (
    category === "WATER_FILLED_POTHOLE" ||
    category === "DRAINAGE_ISSUE" ||
    category === "DAMAGED_WATER_INFRASTRUCTURE" ||
    category === "WATER_LEAKAGE" ||
    category === "WATERLOGGING"
  )
    return "MEDIUM";
  return "LOW";
}

function getAcceptedCityIssue(cityIssueId: string): CityMonitorIssue {
  if (
    typeof cityIssueId !== "string" ||
    !/^(kartaview|demo):[^\s:]+$/.test(cityIssueId) ||
    cityIssueId.length > 120
  ) {
    throw new MinistryIntakeError("INVALID_ISSUE_ID");
  }
  const prefix = cityIssueId.startsWith("demo:") ? "demo:" : "kartaview:";
  const sourceImageId = cityIssueId.slice(prefix.length);
  const store = getCityImageryStore();
  const expectedProvider = prefix === "demo:" ? "demonstration" : "kartaview";
  const issue =
    store.getIssue(cityIssueId, expectedProvider) ??
    store.getIssue(sourceImageId, expectedProvider);
  if (!issue) throw new MinistryIntakeError("ISSUE_NOT_FOUND");
  if (issue.provider !== expectedProvider)
    throw new MinistryIntakeError("ISSUE_NOT_FOUND");
  const processing = store.getProcessing(issue.sourceImageId, issue.provider);
  if (!processing || processing.status !== "accepted_issue")
    throw new MinistryIntakeError("ISSUE_NOT_ACCEPTED");
  return issue;
}

function createRecord(issue: CityMonitorIssue): MinistryIssueRecord {
  const store = getMinistryIssueStore();
  const source =
    issue.provider === "demonstration" ? "DEMONSTRATION_SIMULATION" : MINISTRY_SOURCE;
  return store.create({
    source,
    sourceImageId: issue.sourceImageId,
    sourceImageUrl: issue.sourceImageUrl,
    providerSequenceId: issue.providerSequenceId,
    category: issue.analysis.category,
    confidence: issue.analysis.confidence,
    description: issue.analysis.description,
    evidence: [...issue.analysis.evidence],
    latitude: issue.latitude,
    longitude: issue.longitude,
    area: issue.area ?? "Lucknow",
    address: issue.address ?? `Lucknow, Uttar Pradesh`,
    capturedAt: issue.capturedAt,
    discoveredAt: issue.discoveredAt,
    analyzedAt: issue.analyzedAt,
    receivedAt: new Date().toISOString(),
    status: "NEW",
    priority: priorityForIssue(issue.analysis.category, issue.analysis.confidence),
    city: "Lucknow",
    state: "Uttar Pradesh",
    ...(issue.imageValidation ? { imageValidation: issue.imageValidation } : {}),
    ...(issue.simulation ? { simulation: issue.simulation } : {}),
  });
}

export type MinistryForwardResult = {
  success: true;
  duplicate: boolean;
  issue: MinistryIssueRecord;
};

export function forwardToMinistry(cityIssueId: string): MinistryForwardResult {
  const issue = getAcceptedCityIssue(cityIssueId);
  const store = getMinistryIssueStore();
  const source =
    issue.provider === "demonstration" ? "DEMONSTRATION_SIMULATION" : MINISTRY_SOURCE;
  const existing = store.getBySource(source, issue.sourceImageId);
  if (existing) return { success: true, duplicate: true, issue: existing };
  return { success: true, duplicate: false, issue: createRecord(issue) };
}
