/**
 * Shared contract for controlled JalSarthi knowledge documents.
 *
 * Draft documents intentionally permit empty source metadata. A document must
 * carry complete, human-verified source metadata before it can be marked
 * verified or approved for future retrieval.
 */
export type KnowledgeDocumentLanguage = "en" | "hi";

export type KnowledgeDocumentCategory =
  | "water-conservation"
  | "rainwater-harvesting"
  | "scheme-overview"
  | "drinking-water-safety";

export type KnowledgeSourceType =
  | "official-website"
  | "official-publication"
  | "government-publication"
  | "other-authoritative";

export type KnowledgeSection = {
  heading: string;
  content: string;
};

type KnowledgeDocumentCommon = {
  id: string;
  documentFamilyId: string;
  version: string;
  title: string;
  category: KnowledgeDocumentCategory;
  language: KnowledgeDocumentLanguage;
  jurisdiction: string;
  effectiveDate?: string | null;
  keywords: string[];
  aliases: string[];
  summary: string;
  sections: KnowledgeSection[];
  audience?: string[];
  scope?: string;
  verificationNotes?: string;
};

type DraftKnowledgeDocument = KnowledgeDocumentCommon & {
  status: "draft";
  sourceName: null;
  sourceUrl: null;
  sourceType: null;
  publisher: null;
  lastVerifiedAt: null;
};

type VerifiedKnowledgeDocument = KnowledgeDocumentCommon & {
  status: "verified" | "approved";
  sourceName: string;
  sourceUrl: string;
  sourceType: KnowledgeSourceType;
  publisher: string;
  lastVerifiedAt: string;
};

export type KnowledgeDocument = DraftKnowledgeDocument | VerifiedKnowledgeDocument;
