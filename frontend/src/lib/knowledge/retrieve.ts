import "server-only";

import type { KnowledgeDocument, KnowledgeDocumentLanguage } from "../../data/knowledge/schema";
import { getKnowledgeDocuments } from "./documents";
import { includesNormalizedPhrase, normalizeText, usefulTokens } from "./normalize";
import type { RetrievedDocument, RetrievalResult } from "./types";

const MAX_RESULTS = 3;
const MINIMUM_SCORE = 4;
const RELEVANT_SCORE = 14;

/**
 * Stable scoring order, from strongest to weakest:
 * - complete title in the query: 30
 * - exact keyword phrase: 16
 * - exact alias phrase: 12
 * - exact category phrase: 8
 * - useful keyword token: 8 each, capped at 16
 * - useful alias token: 6 each, capped at 12
 * - useful content token: 1 each, capped at 4
 */
function scoreDocument(query: string, document: KnowledgeDocument): RetrievedDocument {
  const normalizedQuery = normalizeText(query);
  const queryTokens = new Set(usefulTokens(query));
  const matchedTerms: string[] = [];
  let score = 0;

  const addMatch = (points: number, term: string) => {
    score += points;
    matchedTerms.push(term);
  };

  if (includesNormalizedPhrase(normalizedQuery, document.title)) {
    addMatch(30, `title:${document.title}`);
  }

  for (const keyword of document.keywords) {
    if (includesNormalizedPhrase(normalizedQuery, keyword)) {
      addMatch(16, `keyword:${keyword}`);
    }
  }

  for (const alias of document.aliases) {
    if (includesNormalizedPhrase(normalizedQuery, alias)) {
      addMatch(12, `alias:${alias}`);
    }
  }

  if (includesNormalizedPhrase(normalizedQuery, document.category.replace(/-/g, " "))) {
    addMatch(8, `category:${document.category}`);
  }

  const countTokenMatches = (value: string, pointsPerMatch: number, maximum: number, label: string) => {
    let awarded = 0;
    for (const token of usefulTokens(value)) {
      if (queryTokens.has(token) && awarded < maximum) {
        score += pointsPerMatch;
        awarded += pointsPerMatch;
        matchedTerms.push(`${label}:${token}`);
      }
    }
  };

  countTokenMatches(document.keywords.join(" "), 8, 16, "keyword-token");
  countTokenMatches(document.aliases.join(" "), 6, 12, "alias-token");

  const content = [
    document.title,
    document.summary,
    document.scope ?? "",
    ...document.sections.flatMap((section) => [section.heading, section.content]),
  ].join(" ");
  countTokenMatches(content, 1, 4, "content-token");

  return { document, score, matchedTerms: [...new Set(matchedTerms)] };
}

/**
 * Retrieves the best deterministic matches for one language only. Draft status
 * and source metadata are passed through unchanged for later policy decisions.
 */
export function retrieveKnowledge(query: string, language: KnowledgeDocumentLanguage): RetrievalResult {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return { status: "none", documents: [] };

  const documents = getKnowledgeDocuments(language)
    .map((document) => scoreDocument(normalizedQuery, document))
    .filter((result) => result.score >= MINIMUM_SCORE)
    .sort((first, second) => second.score - first.score || first.document.id.localeCompare(second.document.id))
    .slice(0, MAX_RESULTS);

  if (documents.length === 0) return { status: "none", documents: [] };

  return {
    status: documents[0]!.score >= RELEVANT_SCORE ? "relevant" : "partial",
    documents,
  };
}
