const GENERIC_DOMAIN_TOKENS = new Set(["water", "जल", "पानी"]);

/**
 * Normalizes text without removing Unicode marks, which preserves Devanagari
 * vowel signs and other meaningful Hindi characters.
 */
export function normalizeText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(value: string): string[] {
  return normalizeText(value).split(" ").filter(Boolean);
}

export function uniqueTokens(value: string): string[] {
  return [...new Set(tokenize(value))];
}

/** Excludes generic domain words from loose token scoring, but not phrase scoring. */
export function usefulTokens(value: string): string[] {
  return uniqueTokens(value).filter((token) => !GENERIC_DOMAIN_TOKENS.has(token));
}

export function includesNormalizedPhrase(text: string, phrase: string): boolean {
  const normalizedText = normalizeText(text);
  const normalizedPhrase = normalizeText(phrase);
  return normalizedPhrase.length > 0 && normalizedText.includes(normalizedPhrase);
}
