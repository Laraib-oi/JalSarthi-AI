import "server-only";

import { GeminiWaterloggedPotholeAnalyzer } from "@/lib/visual-issues/gemini-waterlogged-pothole";
import { VisualIssueAnalyzerError, type VisualIssueAnalyzer } from "@/lib/visual-issues/types";

let analyzer: VisualIssueAnalyzer | undefined;

export function getVisualIssueAnalyzer(): VisualIssueAnalyzer {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new VisualIssueAnalyzerError("AI_PROVIDER_ERROR");
  analyzer ??= new GeminiWaterloggedPotholeAnalyzer(apiKey);
  return analyzer;
}
