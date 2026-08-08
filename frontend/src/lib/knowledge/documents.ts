import "server-only";

import drinkingWaterSafetyEn from "../../data/knowledge/documents/drinking-water-safety.en.json";
import drinkingWaterSafetyHi from "../../data/knowledge/documents/drinking-water-safety.hi.json";
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
  drinkingWaterSafetyEn as KnowledgeDocument,
  drinkingWaterSafetyHi as KnowledgeDocument,
];

/** Returns only documents authored in the requested language, without fallback. */
export function getKnowledgeDocuments(language: KnowledgeDocumentLanguage): KnowledgeDocument[] {
  return ALL_KNOWLEDGE_DOCUMENTS.filter((document) => document.language === language);
}
