export type PotholeClassification = "eligible" | "not_eligible" | "insufficient_evidence";
export type PotholeSeverity = "low" | "medium" | "high" | "unknown";

/** A validated, non-authoritative visual assessment returned by the pothole API. */
export type WaterloggedPotholeAnalysis = {
  classification: PotholeClassification;
  potholeVisible: boolean;
  standingWaterVisible: boolean;
  confidence: number;
  severity: PotholeSeverity;
  description: string;
  eligible: boolean;
};
