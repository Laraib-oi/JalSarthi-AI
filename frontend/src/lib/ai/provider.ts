import "server-only";

import { OpenRouterProvider } from "@/lib/ai/openrouter";
import { AiProviderError, type AiProvider } from "@/lib/ai/types";

let provider: AiProvider | undefined;

/**
 * Returns the configured provider. This boundary is deliberately small so a
 * future provider or knowledge-retrieval layer can be introduced here.
 */
export function getAiProvider(): AiProvider {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    throw new AiProviderError(
      "AI chat is not configured. Set OPENROUTER_API_KEY and OPENROUTER_MODEL on the server.",
      "AI_NOT_CONFIGURED"
    );
  }

  provider ??= new OpenRouterProvider({ apiKey, model });
  return provider;
}
