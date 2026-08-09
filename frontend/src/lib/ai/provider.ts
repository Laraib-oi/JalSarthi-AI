import "server-only";

import { GeminiProvider } from "@/lib/ai/gemini";
import { AiProviderError, type AiProvider } from "@/lib/ai/types";

let provider: AiProvider | undefined;

/**
 * Returns the configured provider. This boundary is deliberately small so a
 * future provider or knowledge-retrieval layer can be introduced here.
 */
export function getAiProvider(): AiProvider {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new AiProviderError(
      "AI chat is not configured. Set GEMINI_API_KEY on the server.",
      "AI_NOT_CONFIGURED"
    );
  }

  provider ??= new GeminiProvider({ apiKey });
  return provider;
}
