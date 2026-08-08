import "server-only";

import drinkingWaterSafetyEn from "../../data/knowledge/documents/drinking-water-safety.en.json";
import drinkingWaterSafetyHi from "../../data/knowledge/documents/drinking-water-safety.hi.json";
import drinkingWaterQualityMonitoringEn from "../../data/knowledge/documents/drinking-water-quality-monitoring.en.json";
import drinkingWaterQualityMonitoringHi from "../../data/knowledge/documents/drinking-water-quality-monitoring.hi.json";
import jjmCommunityParticipationEn from "../../data/knowledge/documents/jjm-community-participation.en.json";
import jjmCommunityParticipationHi from "../../data/knowledge/documents/jjm-community-participation.hi.json";
import jjmOverviewEn from "../../data/knowledge/documents/jjm-overview.en.json";
import jjmOverviewHi from "../../data/knowledge/documents/jjm-overview.hi.json";
import rainwaterHarvestingEn from "../../data/knowledge/documents/rainwater-harvesting.en.json";
import rainwaterHarvestingHi from "../../data/knowledge/documents/rainwater-harvesting.hi.json";
import waterConservationEn from "../../data/knowledge/documents/water-conservation.en.json";
import waterConservationHi from "../../data/knowledge/documents/water-conservation.hi.json";
import type { KnowledgeDocument, KnowledgeDocumentLanguage } from "../../data/knowledge/schema";

// JSON imports are static so Next.js includes the controlled documents in the server bundle.
const ALL_KNOWLEDGE_DOCUMENTS: readonly KnowledgeDocument[] = [
  waterConservationEn as KnowledgeDocument,
  waterConservationHi as KnowledgeDocument,
  rainwaterHarvestingEn as KnowledgeDocument,
  rainwaterHarvestingHi as KnowledgeDocument,
  jjmOverviewEn as KnowledgeDocument,
  jjmOverviewHi as KnowledgeDocument,
  jjmCommunityParticipationEn as KnowledgeDocument,
  jjmCommunityParticipationHi as KnowledgeDocument,
  drinkingWaterSafetyEn as KnowledgeDocument,
  drinkingWaterSafetyHi as KnowledgeDocument,
  drinkingWaterQualityMonitoringEn as KnowledgeDocument,
  drinkingWaterQualityMonitoringHi as KnowledgeDocument,
];

/** Returns only documents authored in the requested language, without fallback. */
export function getKnowledgeDocuments(language: KnowledgeDocumentLanguage): KnowledgeDocument[] {
  return ALL_KNOWLEDGE_DOCUMENTS.filter((document) => document.language === language);
}
