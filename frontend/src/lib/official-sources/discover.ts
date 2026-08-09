import "server-only";

import type { Language } from "@/constants/translations";
import { includesNormalizedPhrase, normalizeText, usefulTokens } from "@/lib/knowledge/normalize";

import { OFFICIAL_SOURCE_CATALOGUE, type OfficialSourceCatalogueEntry } from "./catalogue";

const MAX_RESULTS = 3;
const MINIMUM_SCORE = 12;

function scoreEntry(query: string, entry: OfficialSourceCatalogueEntry): number {
  const normalizedQuery = normalizeText(query);
  const queryTokens = new Set(usefulTokens(query));
  let score = includesNormalizedPhrase(normalizedQuery, entry.title) ? 24 : 0;

  for (const keyword of entry.keywords) {
    if (includesNormalizedPhrase(normalizedQuery, keyword)) score += 20;
  }

  for (const token of new Set(entry.keywords.flatMap((keyword) => usefulTokens(keyword)))) {
    if (queryTokens.has(token)) score += 8;
  }

  return score;
}

/** Searches only the static, verified catalogue for the requested language. */
export function discoverOfficialSources(
  query: string,
  language: Language
): OfficialSourceCatalogueEntry[] {
  return OFFICIAL_SOURCE_CATALOGUE
    .filter((entry) => entry.language === language && (entry.status === "verified" || entry.status === "approved"))
    .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
    .filter((result) => result.score >= MINIMUM_SCORE)
    .sort((first, second) => second.score - first.score || first.entry.id.localeCompare(second.entry.id))
    .slice(0, MAX_RESULTS)
    .map(({ entry }) => entry);
}
