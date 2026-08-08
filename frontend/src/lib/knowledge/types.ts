import type { KnowledgeDocument } from "../../data/knowledge/schema";

export type RetrievalStatus = "relevant" | "partial" | "none";

/** A knowledge document selected by deterministic retrieval. */
export type RetrievedDocument = {
  document: KnowledgeDocument;
  score: number;
  matchedTerms: string[];
};

/** The complete, provider-neutral outcome of a knowledge lookup. */
export type RetrievalResult = {
  status: RetrievalStatus;
  documents: RetrievedDocument[];
};
