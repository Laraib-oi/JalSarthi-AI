import "server-only";

import { GeminiCityIssueAnalyzer, CityIssueAnalyzerError, type CityIssueAnalyzer } from "@/lib/city-monitor/gemini-city-issue";

let analyzer: CityIssueAnalyzer | undefined;

export function getCityIssueAnalyzer(): CityIssueAnalyzer {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new CityIssueAnalyzerError("AI_PROVIDER_ERROR");
  analyzer ??= new GeminiCityIssueAnalyzer(apiKey);
  return analyzer;
}
