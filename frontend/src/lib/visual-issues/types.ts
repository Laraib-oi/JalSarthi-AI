import "server-only";

import type { Language } from "@/constants/translations";
import type { WaterloggedPotholeAnalysis } from "@/types/pothole-analysis";

export type ValidatedVisualImage = {
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  bytes: Uint8Array;
  width: number;
  height: number;
};

export type VisualIssueAnalysisRequest = {
  image: ValidatedVisualImage;
  language: Language;
};

export interface VisualIssueAnalyzer {
  analyzeWaterloggedPothole(
    request: VisualIssueAnalysisRequest
  ): Promise<WaterloggedPotholeAnalysis>;
}

export class VisualIssueAnalyzerError extends Error {
  constructor(
    public readonly code: "AI_PROVIDER_ERROR" | "AI_INVALID_RESPONSE" = "AI_PROVIDER_ERROR"
  ) {
    const message = code === "AI_INVALID_RESPONSE"
      ? "The visual analysis provider returned an invalid response."
      : "The visual analysis provider could not complete the request.";
    super(message);
    this.name = "VisualIssueAnalyzerError";
  }
}
